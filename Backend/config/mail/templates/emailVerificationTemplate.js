const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DreamyDate - Email Verification</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
      }
      
      body {
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 30px 20px;
        text-align: center;
        background: linear-gradient(135deg, #fff0f5 0%, #ffe0eb 100%);
        border-radius: 16px;
        box-shadow: 0 6px 24px rgba(255, 75, 110, 0.15);
      }
      
      .logo-container {
        margin-bottom: 25px;
      }
      
      .logo {
        max-width: 150px;
        height: auto;
      }
      
      h1 {
        color: #ff4b6e;
        font-size: 28px;
        margin-bottom: 20px;
        font-weight: 600;
      }
      
      p {
        color: #555;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 16px;
      }
      
      .otp-container {
        padding: 20px;
        margin: 25px auto;
        background: white;
        border-radius: 12px;
        max-width: 320px;
        box-shadow: 0 4px 15px rgba(255, 75, 110, 0.1);
        border: 1px solid rgba(255, 75, 110, 0.2);
      }
      
      .otp {
        font-size: 36px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #ff4b6e;
        background: linear-gradient(45deg, #ff4b6e, #ff83a8);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 10px 0;
      }
      
      .expire-text {
        font-size: 14px;
        color: #888;
        margin-top: 10px;
        font-style: italic;
      }
      
      .divider {
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(255, 75, 110, 0.3), transparent);
        margin: 25px auto;
        width: 80%;
      }
      
      .footer {
        margin-top: 20px;
        font-size: 13px;
        color: #999;
      }
      
      .heart {
        color: #ff4b6e;
        font-size: 16px;
      }
      
      .brand-name {
        font-weight: bold;
        color: #ff0055;
      }
      
      /* Media Queries for better mobile experience */
      @media only screen and (max-width: 480px) {
        .container {
          padding: 20px 15px;
        }
        
        h1 {
          font-size: 24px;
        }
        
        p {
          font-size: 15px;
        }
        
        .otp {
          font-size: 32px;
          letter-spacing: 5px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo-container">
        <img class="logo" src="https://res.cloudinary.com/da783tmgj/image/upload/v1747332715/5dc69eea0f8b5fad3ecd1829b211876fd85659f5_vczlcj.png" alt="DreamyDate Logo">
      </div>
      
      <h1>Email Verification</h1>
      <p>Thank you for choosing <span class="brand-name">DreamyDate</span>! To complete your registration, please use the verification code below:</p>
      
      <div class="otp-container">
        <div class="otp">${otp}</div>
        <p class="expire-text">This code will expire in 5 minutes</p>
      </div>
      
      <p>If you didn't request this code, please ignore this email.</p>
      
      <div class="divider"></div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} DreamyDate. All rights reserved.</p>
        <p style="margin-bottom: 0;">With <span class="heart">❤️</span> from the DreamyDate Team</p>
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = otpTemplate;
