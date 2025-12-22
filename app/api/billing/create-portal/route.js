import connectMongo from "@/libs/mongoose";
import { auth } from "@/libs/auth";
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
  portalCreated,
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

    if (!body.returnUrl) {
      return responseError(urlsRequired.message, {}, urlsRequired.status);
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

    const stripeCustomerPortal = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: body.returnUrl,
    });

    return responseSuccess(portalCreated.message, { url: stripeCustomerPortal.url }, portalCreated.status);
  } catch (e) {
    console.log('e', e)
    return responseError(serverError.message, {}, serverError.status);
  }
}
