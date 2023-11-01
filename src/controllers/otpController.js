// Generates a 6-digit OTP.
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Validates an entered OTP against an existing OTP.
export const validateOTP = (enteredOTP, existedOTP) => {
  if (enteredOTP !== existedOTP.otp) {
    return false;
  }
  if (Date.now() > existedOTP.expiresAt) {
    return false;
  }
  return true;
};
