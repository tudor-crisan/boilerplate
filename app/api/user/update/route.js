import { auth } from "@/libs/auth";
import clientPromise from "@/libs/mongo";
import User from "@/models/User";
import { isResponseMock, responseMock, responseSuccess, responseError } from "@/libs/utils.server";
import { checkReqRateLimit } from "@/libs/rateLimit";

import setting from "@/data/modules/setting/setting0.json";

const TYPE = "UserUpdate";

export async function POST(req) {
  if (isResponseMock(TYPE)) {
    return responseMock(TYPE);
  }

  const error = await checkReqRateLimit(req, "user-update");
  if (error) return error;

  const {
    notAuthorized,
    serverError,
  } = setting.forms.general.backend.responses;

  const {
    profileUpdated
  } = setting.forms.User.backend.responses;

  try {
    const session = await auth();

    if (!session?.user) {
      return responseError(notAuthorized.message, {}, notAuthorized.status);
    }

    const { name, image } = await req.json();

    await clientPromise;
    await User.updateOne({ email: session.user.email }, { $set: { name, image } });

    return responseSuccess(profileUpdated.message, { name, image }, profileUpdated.status);
  } catch (e) {
    console.error("User update error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}
