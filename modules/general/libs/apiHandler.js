import { auth } from "@/modules/auth/libs/auth";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";
import connectMongo from "@/modules/general/libs/mongoose";
import { checkReqRateLimit } from "@/modules/general/libs/rateLimit";
import {
  isResponseMock,
  responseError,
  responseMock,
} from "@/modules/general/libs/utils.server";
import User from "@/modules/general/models/User";

/**
 * Higher-order function to wrap API handlers with common logic.
 *
 * @param {Function} handler - The actual logic for the API route.
 * @param {Object} options - Configuration for the handler.
 * @param {string} options.type - The key in settings.forms for this handler (e.g. 'Board', 'Post').
 * @param {boolean} options.needAuth - Whether to check for an active session.
 * @param {boolean} options.needAccess - Whether to check if user has hasAccess=true.
 * @param {string} options.rateLimitKey - The key for rate limiting (e.g. 'board-create').
 * @param {boolean} options.connectDb - Whether to connect to MongoDB automatically.
 */
export function withApiHandler(handler, options = {}) {
  const {
    type = null,
    needAuth = true,
    needAccess = true,
    rateLimitKey = null,
    connectDb = true,
  } = options;

  return async (req, ...args) => {
    // 1. Mock Handling
    if (type && isResponseMock(type)) {
      return responseMock(type);
    }

    const { notAuthorized, sessionLost, serverError, noAccess } =
      settings.forms.general.backend.responses;

    // 2. Rate Limiting
    if (rateLimitKey) {
      const rateLimitError = await checkReqRateLimit(req, rateLimitKey);
      if (rateLimitError) return rateLimitError;
    }

    try {
      // 3. Database Connection
      if (connectDb) {
        await connectMongo();
      }

      let session = null;
      let user = null;

      // 4. Authentication and Access Checks
      session = await auth();

      if (needAuth && !session) {
        return responseError(notAuthorized.message, {}, notAuthorized.status);
      }

      if (session?.user?.id) {
        user = await User.findById(session.user.id);

        if (!user && (needAuth || needAccess)) {
          return responseError(sessionLost.message, {}, sessionLost.status);
        }

        if (needAccess && !user.hasAccess) {
          return responseError(noAccess.message, {}, noAccess.status);
        }
      }

      // 5. Execute actual handler
      // Pass session and user for convenience
      return await handler(req, { session, user, ...args });
    } catch (e) {
      console.error(`API Error [${type || "Unknown"}]: ${e?.message}`, e);
      return responseError(serverError.message, {}, serverError.status);
    }
  };
}
