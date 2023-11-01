function otpmail(otp) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #777;
            font-size: 16px;
        }

        .otp-code {
            background: #f5f5f5;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            font-size: 24px;
            text-align: center;
        }

        .expiration-message {
            color: #ff6347; /* Red color for emphasis */
            font-size: 14px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to EZMONY!</h1>
        <p>Your OTP for verification is:</p>
        <div class="otp-code"><strong>${otp}</strong></div>
        <p>Please use this OTP to complete your verification.</p>
        <p class="expiration-message">Note: This OTP will expire after 5 minutes.</p>
    </div>
</body>
</html>`;
}

export default otpmail;