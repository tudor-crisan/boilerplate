import { getEmailBranding, getLogoUrl } from '@/components/emails/email-theme';
import { GenericLayout, EmailBody, EmailContainer, EmailButton } from '@/components/emails/EmailLayout';

export default function MagicLinkTemplate({ host, url }) {
  const branding = getEmailBranding();
  const {
    themeColor, base100, base200, content, appName, font,
    dividerColor, cardRoundness, btnRoundness, cardShadow, cardBorder
  } = branding;

  const logoUrl = getLogoUrl(host);
  const primaryFont = font.split(',')[0].trim().replace(/['"]/g, '');
  const fontImportName = primaryFont.replace(/\s+/g, '+');

  return (
    <GenericLayout font={primaryFont} fontImportName={fontImportName}>
      <EmailBody style={{ backgroundColor: base200, fontFamily: font }}>
        <EmailContainer style={{ backgroundColor: base200, padding: '60px 20px', fontFamily: font }}>
          <EmailContainer style={{
            maxWidth: '440px',
            margin: '0 auto',
            backgroundColor: base100,
            padding: '48px 32px',
            borderRadius: cardRoundness,
            boxShadow: cardShadow,
            border: cardBorder
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px', whiteSpace: 'nowrap' }}>
              {logoUrl && (
                <div style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '12px', lineHeight: 0 }}>
                  <img
                    src={logoUrl}
                    width="32"
                    height="32"
                    alt="Logo"
                    style={{ display: 'block', width: '32px', height: '32px', borderRadius: btnRoundness }}
                  />
                </div>
              )}
              <h1 style={{
                display: 'inline-block',
                fontSize: '22px',
                fontWeight: 800,
                margin: 0,
                color: themeColor,
                letterSpacing: '-0.025em',
                verticalAlign: 'middle',
                fontFamily: font
              }}>
                {appName}
              </h1>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: content, fontFamily: font }}>
                Sign in to {host}
              </h2>
              <p style={{ fontSize: '16px', color: content, opacity: 0.8, marginBottom: '32px', lineHeight: 1.5, fontFamily: font }}>
                Click the button below to securely sign in to your account.
              </p>
              <EmailButton
                href={url}
                style={{
                  backgroundColor: themeColor,
                  color: '#ffffff',
                  padding: '14px 40px',
                  borderRadius: btnRoundness,
                  fontWeight: 600,
                  fontSize: '16px',
                  fontFamily: font
                }}
              >
                Sign in
              </EmailButton>
            </div>

            <div style={{ borderTop: `1px solid ${dividerColor}`, paddingTop: '32px', marginTop: '32px' }}>
              <p style={{ fontSize: '14px', color: content, opacity: 0.7, textAlign: 'center', margin: 0, lineHeight: 1.4, fontFamily: font }}>
                If you did not request this email, you can safely ignore it.
              </p>
            </div>
          </EmailContainer>
        </EmailContainer>
      </EmailBody>
    </GenericLayout>
  );
};
