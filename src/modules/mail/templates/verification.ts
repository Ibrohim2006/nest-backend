export const verificationTemplate = (username: string, code: number) => {
  return `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome, ${username}! 🎉</h2>

    <p>Thank you for registering. Please use the code below to verify your email:</p>

    <div style="
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      text-align: center;
      background: #f0f4ff;
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
      color: #3b5bdb;
    ">
      ${code}
    </div>

    <p>This code is valid for <strong>10 minutes</strong>.</p>

    <hr />

    <p style="color: #888; font-size: 12px;">
      If you did not register, please ignore this email.
    </p>
  </body>
</html>
  `;
};