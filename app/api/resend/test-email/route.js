import { auth } from "@/libs/auth";
import { NextResponse } from "next/server";
import { sendEmail, MagicLinkEmail, WeeklyDigestEmail } from "@/libs/email";
import { defaultSetting as settings } from "@/libs/defaults";

export async function POST(req) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { template, data, styling } = await req.json();

    let emailContent;

    // We force the 'to' address to be the current user's email to prevent abuse
    // The user can only test emails sending to themselves
    const to = session.user.email;
    const from = settings.business?.support_email || "noreply@example.com";

    if (template === 'Magic Link') {
      const { host, url } = data;
      emailContent = await MagicLinkEmail({ host, url, styling });
    } else if (template === 'Weekly Digest') {
      const { baseUrl, userName, boards } = data;
      emailContent = await WeeklyDigestEmail({ baseUrl, userName, boards, styling });
    } else {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (!emailContent) {
      return NextResponse.json({ error: "Error generating email content" }, { status: 500 });
    }

    console.log("Sending test email:", { template, subject: emailContent.subject });

    await sendEmail({
      from,
      to: to,
      email: to, // sendEmail uses 'email' param as 'to' based on viewing libs/email.js
      subject: "[TEST] " + emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json({ success: true, to });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json({ error: error.message || JSON.stringify(error) }, { status: 500 });
  }
}
