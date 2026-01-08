import { NextResponse } from 'next/server';
import { sendEmail } from '@/libs/api';
import { defaultSetting as settings } from '@/libs/defaults';
import { Webhook } from 'svix';
import { Resend } from 'resend';

export async function POST(req) {
  try {
    const payload = await req.json();
    const payloadString = JSON.stringify(payload);

    const headerPayload = req.headers;
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ message: 'Error occured -- no svix headers' }, { status: 400 });
    }

    const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(payloadString, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return NextResponse.json({ message: 'Error occured' }, { status: 400 });
    }

    if (evt.type !== 'email.received') {
      return NextResponse.json({ message: 'Events ignored' }, { status: 200 });
    }

    const { email_id, subject, from, to, message_id } = evt.data;
    const forwardingEmail = settings.business.incoming_email;

    if (!forwardingEmail) {
      console.error("No forwarding email configured in settings.");
      return NextResponse.json({ message: 'Configuration error' }, { status: 500 });
    }

    // Retrieve the full email body since the webhook payload doesn't contain it
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data: emailData, error: emailError } = await resend.emails.receiving.get(email_id);

    if (emailError) {
      console.error('Failed to retrieve email content:', emailError);
      return NextResponse.json({ message: 'Error retrieving email content' }, { status: 500 });
    }

    const html = emailData.html;
    const text = emailData.text;

    // Determine the best "From" address to use
    // We try to match the "To" address (the alias used) if it belongs to our domain.
    // This way, if email was sent to `LoyalBoards@tudorcrisan.dev`, the forward comes FROM `LoyalBoards@tudorcrisan.dev`
    const systemFromAddress = process.env.RESEND_EMAIL_FROM || '';
    // Extract domain from "Name <email@domain.com>" or "email@domain.com"
    const domainMatch = systemFromAddress.match(/@([\w.-]+\.[a-zA-Z]{2,})/);
    const domain = domainMatch ? domainMatch[0] : null;

    let senderFrom = systemFromAddress;
    if (domain) {
      const aliasAddress = to.find(t => t.toLowerCase().includes(domain.toLowerCase()));
      if (aliasAddress) {
        senderFrom = aliasAddress;
      }
    }

    // Forward the email
    await sendEmail({
      // We will likely default to the system's "from" address for sending the forward, 
      // but maybe include original sender info in the content or reply-to?
      // Since `sendEmail` uses `process.env.RESEND_EMAIL_FROM` by default or what is passed.
      // We'll resend FROM our system, TO the forwarding address.
      apiKey: process.env.RESEND_API_KEY,
      from: senderFrom,
      replyTo: from,
      email: forwardingEmail,
      subject: `FW: ${subject}`,
      headers: {
        "In-Reply-To": message_id,
        "References": message_id
      },
      html: `
        <div style="background-color: #f3f3f3; padding: 10px; margin-bottom: 20px; border-bottom: 1px solid #ccc;">
          <p><strong>Forwarded from:</strong> ${from}</p>
          <p><strong>To:</strong> ${to.join(', ')}</p>
          <p><strong>Original Subject:</strong> ${subject}</p>
        </div>
        ${html || text || '(No content)'}
      `,
      text: `
Forwarded from: ${from}
To: ${to.join(', ')}
Original Subject: ${subject}

----------------------------------------

${text || '(No text content)'}
      `
    });

    return NextResponse.json({ message: 'Email forwarded' }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
