import { defaultSetting as settings } from "@/libs/defaults";
import connectMongo from "@/libs/mongoose";
import { checkReqRateLimit } from "@/libs/rateLimit";
import {
  getBaseUrl,
  isResponseMock,
  responseError,
  responseMock,
  responseSuccess,
} from "@/libs/utils.server";
import User from "@/models/User";
import { auth } from "@/modules/auth/libs/auth";
import Stripe from "stripe";

const TYPE = "Billing";

const { notAuthorized, sessionLost, serverError } =
  settings.forms.general.backend.responses;

const { portalCreated } = settings.forms[TYPE].backend.responses;

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  }

  const error = await checkReqRateLimit(req, "billing-create-portal");
  if (error) return error;

  try {
    const session = await auth();

    if (!session) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const body = await req.json();

    if (!body.returnUrl) {
      body.returnUrl = getBaseUrl() + settings.paths.dashboard.source;
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

    if (!user.customerId) {
      return responseError(
        "You don't have a billing account yet. Make a purchase first.",
        {},
        400,
      );
    }

    const stripeCustomerPortal = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: body.returnUrl,
    });

    return responseSuccess(
      portalCreated.message,
      { url: stripeCustomerPortal.url },
      portalCreated.status,
    );
  } catch (e) {
    console.error("Stripe portal creation error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
