/**

* ==========================================
* Email Service
* ==========================================
  */

const transporter = require("../config/emailConfig");

/**

* ==========================================
* GLOBAL EMAIL TEMPLATE
* ==========================================
  */

const generateEmailTemplate = ({
  title,
  greeting,
  message,
  buttonText,
  buttonUrl,
  footerMessage,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f1f5f9;
    font-family:Arial, Helvetica, sans-serif;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background:#f1f5f9;
      padding:40px 15px;
    "
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:640px;
            background:#ffffff;
            border-radius:20px;
            overflow:hidden;
            border:1px solid #e5e7eb;
            box-shadow:0 15px 40px rgba(15,23,42,.08);
          "
        >

          <!-- BRAND HEADER -->

          <tr>
            <td
              align="center"
              style="
                background:#0f172a;
                padding:45px 20px;
              "
            >

              <h1
                style="
                  margin:0;
                  color:#c8b36a;
                  font-size:36px;
                  font-weight:700;
                  letter-spacing:1px;
                "
              >
                ResolveStation
              </h1>

              <p
                style="
                  margin:12px 0 0;
                  color:#94a3b8;
                  font-size:12px;
                  letter-spacing:3px;
                  text-transform:uppercase;
                "
              >
                Facility & Complaint Management
              </p>

            </td>
          </tr>

          <!-- CONTENT -->

          <tr>
            <td
              style="
                padding:55px 45px;
              "
            >

              <h2
                style="
                  margin:0 0 30px;
                  color:#0f172a;
                  font-size:32px;
                  line-height:1.3;
                  font-weight:700;
                "
              >
                ${title}
              </h2>

              <p
                style="
                  margin:0 0 20px;
                  color:#475569;
                  font-size:16px;
                  line-height:1.9;
                "
              >
                ${greeting}
              </p>

              <div
                style="
                  color:#475569;
                  font-size:16px;
                  line-height:1.9;
                "
              >
                ${message}
              </div>

              ${
                buttonUrl
                  ? `
                <div
                  style="
                    text-align:center;
                    margin:45px 0;
                  "
                >
                  <a
                    href="${buttonUrl}"
                    style="
                      display:inline-block;
                      background:#c8b36a;
                      color:#ffffff;
                      text-decoration:none;
                      padding:16px 42px;
                      border-radius:12px;
                      font-size:15px;
                      font-weight:700;
                      letter-spacing:.3px;
                    "
                  >
                    ${buttonText}
                  </a>
                </div>

                <div
                  style="
                    color:#94a3b8;
                    font-size:12px;
                    line-height:1.8;
                    word-break:break-word;
                  "
                >
                  If the button doesn't work,
                  copy and paste the following link into your browser:

                  <br><br>

                  ${buttonUrl}
                </div>
              `
                  : ""
              }

              <div
                style="
                  margin-top:35px;
                  color:#64748b;
                  font-size:15px;
                  line-height:1.9;
                "
              >
                ${footerMessage}
              </div>

            </td>
          </tr>

          <!-- FOOTER -->

          <tr>
            <td
              align="center"
              style="
                background:#f8fafc;
                padding:35px;
                border-top:1px solid #e5e7eb;
              "
            >

              <p
                style="
                  margin:0;
                  color:#0f172a;
                  font-size:16px;
                  font-weight:700;
                "
              >
                ResolveStation
              </p>

              <p
                style="
                  margin:10px 0 0;
                  color:#94a3b8;
                  font-size:13px;
                "
              >
                Secure • Reliable • Professional
              </p>

              <p
                style="
                  margin:12px 0 0;
                  color:#94a3b8;
                  font-size:12px;
                "
              >
                © ${new Date().getFullYear()} ResolveStation.
                All rights reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};

/**

* ==========================================
* VERIFY EMAIL
* ==========================================
  */

const sendVerificationEmail = async (user, verificationUrl) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,

    to: user.email,

    subject: "Verify Your ResolveStation Account",

    html: generateEmailTemplate({
      title: "Verify Your Email Address",

      greeting: `Hello ${user.name},`,

      message:
        "Thank you for registering with ResolveStation. Please verify your email address to activate your account and gain access to all available features.",

      buttonText: "Verify Email",

      buttonUrl: verificationUrl,

      footerMessage:
        "This verification link will expire in 24 hours. If you did not create an account, you can safely ignore this email.",
    }),
  });
};

/**

* ==========================================
* PASSWORD RESET
* ==========================================
  */

const sendPasswordResetEmail = async (user, resetUrl) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,

    to: user.email,

    subject: "Reset Your ResolveStation Password",

    html: generateEmailTemplate({
      title: "Password Reset Request",

      greeting: `Hello ${user.name},`,

      message:
        "We received a request to reset your ResolveStation account password. Click the button below to create a new password.",

      buttonText: "Reset Password",

      buttonUrl: resetUrl,

      footerMessage:
        "This password reset link will expire in 15 minutes. If you didn't request a password reset, please ignore this email.",
    }),
  });
};

/**
 * ==========================================
 * STAFF ACCOUNT EMAIL
 * ==========================================
 */

const sendStaffCredentialsEmail = async (user, tempPassword) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,

    to: user.email,

    subject: "Your ResolveStation Staff Account",

    html: generateEmailTemplate({
      title: "Staff Account Created",

      greeting: `Hello ${user.name},`,

      message: `
        Your ResolveStation staff account has been created successfully.

        <br><br>

        <strong>Email:</strong>
        ${user.email}

        <br><br>

        <strong>Temporary Password:</strong>
        ${tempPassword}

        <br><br>

        Please sign in and change your password as soon as possible.
      `,

      buttonText: "Login",

      buttonUrl: `${process.env.APP_URL}/auth/login`,

      footerMessage:
        "For security reasons, please change your password after your first login.",
    }),
  });
};

/**

* ==========================================
* CONTACT FORM EMAIL
* ==========================================
  */

const sendContactEmail = async (name, email, message) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,

    to: process.env.EMAIL_USER,

    subject: "New Contact Form Submission",

    html: generateEmailTemplate({
      title: "New Contact Form Submission",

      greeting: `Submitted by: ${name}`,

      message: `
    <strong>Email:</strong>
    ${email}

    <br><br>

    <strong>Message:</strong>

    <br><br>

    ${message}
  `,

      buttonText: null,

      buttonUrl: null,

      footerMessage:
        "This email was generated automatically from the ResolveStation contact form.",
    }),
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendContactEmail,
  sendStaffCredentialsEmail,
};
