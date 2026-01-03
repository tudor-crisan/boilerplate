import connectMongo from "@/libs/mongoose";
import { auth } from "@/libs/auth";
import { isResponseMock, responseMock, responseSuccess, responseError, getBaseUrl } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import User from "@/models/User";
import Stripe from "stripe";
import { checkReqRateLimit } from "@/libs/rateLimit";

const TYPE = "Billing";

const {
  notAuthorized,
  sessionLost,
  serverError,
} = settings.forms.general.backend.responses;

const {
  urlsRequired,
  checkoutCreated,
} = settings.forms[TYPE].backend.responses;

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  const error = await checkReqRateLimit(req, "billing-create-checkout");
  if (error) return error;

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const body = await req.json();

    if (!body.successUrl) {
      body.successUrl = getBaseUrl() + settings.paths.billingSuccess.source;
    }

    if (!body.cancelUrl) {
      body.cancelUrl = getBaseUrl() + settings.paths.dashboard.source;
    }

    await connectMongo();
    const user = await User.findById(session.user.id);

    if (!user) {
      return responseError(sessionLost.message, {}, sessionLost.status);
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing from environment variables");
      return responseError(serverError.message, {}, serverError.status);
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      customer_email: user.email,
      client_reference_id: user._id.toString(),
    });

    return responseSuccess(checkoutCreated.message, { url: stripeCheckoutSession.url }, checkoutCreated.status);
  } catch (e) {
    console.error("Stripe checkout creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
