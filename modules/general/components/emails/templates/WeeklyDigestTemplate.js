import { getEmailBranding } from "@/modules/general/components/emails/email-theme";
import EmailIconLogo from "@/modules/general/components/emails/EmailIconLogo";
import {
  EmailBody,
  EmailButton,
  EmailContainer,
  GenericLayout,
} from "@/modules/general/components/emails/EmailLayout";

export default function WeeklyDigestTemplate({
  baseUrl,
  userName,
  boards,
  styling,
}) {
  const branding = getEmailBranding(styling);
  const {
    themeColor,
    base100,
    base200,
    content,
    appName,
    font,
    dividerColor,
    cardRoundness,
    btnRoundness,
    cardShadow,
    cardBorder,
  } = branding;

  const primaryFont = font.split(",")[0].trim().replace(/['"]/g, "");
  const fontImportName = primaryFont.replace(/\s+/g, "+");

  return (
    <GenericLayout font={primaryFont} fontImportName={fontImportName}>
      <EmailBody style={{ backgroundColor: base200, fontFamily: font }}>
        <EmailContainer
          style={{
            backgroundColor: base200,
            padding: "60px 20px",
            fontFamily: font,
          }}
        >
          <EmailContainer
            style={{
              maxWidth: "440px",
              margin: "0 auto",
              backgroundColor: base100,
              padding: "48px 32px",
              borderRadius: cardRoundness,
              boxShadow: cardShadow,
              border: cardBorder,
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "40px",
                whiteSpace: "nowrap",
              }}
            >
              <EmailIconLogo branding={branding} />
              <h1
                style={{
                  display: "inline-block",
                  fontSize: "22px",
                  fontWeight: 800,
                  margin: 0,
                  color: content,
                  letterSpacing: "-0.025em",
                  verticalAlign: "middle",
                  fontFamily: font,
                }}
              >
                {appName}
              </h1>
            </div>

            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: "0 0 16px 0",
                  color: content,
                  fontFamily: font,
                }}
              >
                Weekly Board Stats 📈
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: content,
                  opacity: 0.8,
                  marginBottom: "32px",
                  lineHeight: 1.5,
                  fontFamily: font,
                }}
              >
                Hi {userName || "there"}, here is your weekly summary for your
                boards:
              </p>

              <div style={{ textAlign: "left", marginBottom: "32px" }}>
                {boards && boards.length > 0 ? (
                  boards.map((board, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "24px",
                        paddingBottom: "24px",
                        borderBottom:
                          index < boards.length - 1
                            ? `1px solid ${dividerColor}`
                            : "none",
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontSize: "16px",
                          color: content,
                          marginBottom: "8px",
                        }}
                      >
                        {board.name}
                      </strong>
                      <div
                        style={{
                          fontSize: "14px",
                          color: content,
                          opacity: 0.8,
                          lineHeight: 1.6,
                        }}
                      >
                        👀 Views: {board.stats.views}
                        <br />
                        📝 Posts: {board.stats.posts}
                        <br />
                        👍 Votes: {board.stats.votes}
                        <br />
                        💬 Comments: {board.stats.comments}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "14px", color: content, opacity: 0.8 }}>
                    No activity this week.
                  </p>
                )}
              </div>

              <EmailButton
                href={baseUrl}
                style={{
                  backgroundColor: themeColor,
                  color: "#ffffff",
                  padding: "14px 40px",
                  borderRadius: btnRoundness,
                  fontWeight: 600,
                  fontSize: "16px",
                  fontFamily: font,
                }}
              >
                Go to Dashboard
              </EmailButton>
            </div>

            <div
              style={{
                borderTop: `1px solid ${dividerColor}`,
                paddingTop: "32px",
                marginTop: "32px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: content,
                  opacity: 0.7,
                  textAlign: "center",
                  margin: 0,
                  lineHeight: 1.4,
                  fontFamily: font,
                }}
              >
                Keep up the great work!
              </p>
            </div>
          </EmailContainer>
        </EmailContainer>
      </EmailBody>
    </GenericLayout>
  );
}
