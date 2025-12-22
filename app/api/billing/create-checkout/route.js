import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { defaultSetting as settings } from "@/libs/defaults";
import User from "@/models/User";
import Stripe from "stripe";

const TYPE = "Billing";

const {
  notAuthorized,
  sessionLost,
  serverError,
} = settings.forms.general.backend.responses;

const {
  urlsRequired,
} = settings.forms[TYPE].backend.responses;

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  };

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const body = await req.json();

    if (!body.successUrl || !body.cancelUrl) {
      return responseError(urlsRequired.message, {}, urlsRequired.status);
    }

    await connectMongo();
    const user = await User.findById(session.user.id);

    if (!user) {
      return responseError(sessionLost.message, {}, sessionLost.status);
    }

    const stripe = new Stripe(process.env.STRIPE_API_KEY);

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

    return responseSuccess(null, { url: stripeCheckoutSession.url });

  } catch (e) {
    return responseError(serverError.message, {}, serverError.status);
  }
}
