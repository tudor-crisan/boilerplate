import { withApiHandler } from "@/libs/apiHandler";
import { defaultSetting as setting } from "@/libs/defaults";
import {
  generateLogoBase64,
  responseError,
  responseSuccess,
} from "@/libs/utils.server";
import User from "@/models/User";

const TYPE = "UserUpdate";

async function handler(req, { session }) {
  const { serverError } = setting.forms.general.backend.responses;

  const { profileUpdated } = setting.forms.User.backend.responses;

  try {
    const { name, image, styling, visualConfig } = await req.json();

    // Generate logo server-side
    let stylingData = { ...styling };

    if (visualConfig?.logo?.shape) {
      const logoShape = visualConfig.logo.shape || "";
      const logo = generateLogoBase64(styling, { logo: { shape: logoShape } });
      // Merge logo into styling object
      stylingData = { ...styling, logo };
    }

    await User.updateOne(
      { email: session.user.email },
      { $set: { name, image, styling: stylingData } },
    );

    return responseSuccess(
      profileUpdated.message,
      { name, image, styling: stylingData },
      profileUpdated.status,
    );
  } catch (e) {
    console.error("User update error: " + e?.message);
    return responseError(serverError.message, {}, serverError.status);
  }
}

export const POST = withApiHandler(handler, {
  type: TYPE,
  rateLimitKey: "user-update",
  needAccess: false, // Profile update doesn't usually require paid access
});
