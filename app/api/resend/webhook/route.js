import { NextResponse } from 'next/server';
import { sendEmail } from '@/libs/api';
import { defaultSetting as settings } from '@/libs/defaults';

export async function POST(req) {
  try {
    const payload = await req.json();

    if (payload.type !== 'email.received') {
      return NextResponse.json({ message: 'Events ignored' }, { status: 200 });
    }

    const { subject, from, to, html, text } = payload.data;
    const forwardingEmail = settings.business.incoming_email;

    if (!forwardingEmail) {
      console.error("No forwarding email configured in settings.");
      return NextResponse.json({ message: 'Configuration error' }, { status: 500 });
    }

    // Forward the email
    await sendEmail({
      // We will likely default to the system's "from" address for sending the forward, 
      // but maybe include original sender info in the content or reply-to?
      // Since `sendEmail` uses `process.env.RESEND_EMAIL_FROM` by default or what is passed.
      // We'll resend FROM our system, TO the forwarding address.
      email: forwardingEmail,
      subject: `FW: ${subject}`,
      html: `
        <div style="background-color: #f3f3f3; padding: 10px; margin-bottom: 20px; border-bottom: 1px solid #ccc;">
          <p><strong>Forwarded from:</strong> ${from}</p>
          <p><strong>To:</strong> ${to.join(', ')}</p>
          <p><strong>Original Subject:</strong> ${subject}</p>
        </div>
        ${html || text}
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
