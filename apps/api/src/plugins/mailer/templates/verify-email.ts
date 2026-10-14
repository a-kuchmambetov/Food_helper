const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export interface VerifyEmailTemplateData {
  name: string;
  url: string;
}

export const verifyEmailTemplate = ({ name, url }: VerifyEmailTemplateData) => {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);

  return {
    subject: "Verify your email for Food Helper",
    text: [
      `Hi ${name},`,
      "",
      "Please confirm your email address by opening this link:",
      url,
      "",
      "The link expires in 24 hours. If you didn't create a Food Helper account, you can ignore this email.",
    ].join("\n"),
    html: `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:12px;padding:32px;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px;font-size:22px;">Food Helper</h1>
                <p style="margin:0 0 16px;">Hi ${safeName},</p>
                <p style="margin:0 0 24px;">Please confirm your email address to finish creating your account.</p>
                <p style="margin:0 0 24px;">
                  <a href="${safeUrl}" style="display:inline-block;padding:12px 20px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:8px;">Verify email</a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;color:#52525b;">Or paste this link into your browser:</p>
                <p style="margin:0 0 24px;font-size:13px;word-break:break-all;"><a href="${safeUrl}" style="color:#52525b;">${safeUrl}</a></p>
                <p style="margin:0;font-size:13px;color:#71717a;">The link expires in 24 hours. If you didn't create a Food Helper account, you can ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
};
