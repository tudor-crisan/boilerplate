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

    const type = body.type; // 'monthly' or 'lifetime'
    let priceId = process.env.STRIPE_PRICE_ID;
    let mode = "subscription";

    if (type === "lifetime") {
      priceId = process.env.STRIPE_PRICE_ID_LIFETIME;
      mode = "payment";
    }

    if (!priceId) {
      console.error(`Stripe price ID missing for type: ${type}`);
      return responseError(serverError.message, {}, serverError.status);
    }

    const stripeSessionConfig = {
      mode: mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      client_reference_id: user._id.toString(),
    };

    if (user.customerId) {
      stripeSessionConfig.customer = user.customerId;
    } else {
      stripeSessionConfig.customer_email = user.email;

      // Force customer creation for one-time payments so we can use the billing portal later
      if (mode === "payment") {
        stripeSessionConfig.customer_creation = "always";
      }
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create(stripeSessionConfig);

    return responseSuccess(checkoutCreated.message, { url: stripeCheckoutSession.url }, checkoutCreated.status);
  } catch (e) {
    console.error("Stripe checkout creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
