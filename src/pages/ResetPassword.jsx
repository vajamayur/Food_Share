import ForgotPassword from "./ForgotPassword";

export default function ResetPassword() {
  return <ForgotPassword mode="reset" />;
}
<<<<<<< HEAD
=======


export const authApi = {

  // તમારા existing methods અહીં રાખો
  // login()
  // register()
  // etc.

  async forgotPassword(email) {
    const response = await fetch(
      "http://localhost:8081/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Unable to send OTP."
      );
    }

    return result;
  },

  async verifyOtp(email, otp) {
    const response = await fetch(
      "http://localhost:8081/auth/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Invalid OTP."
      );
    }

    return result;
  },

  async resetPassword({
    email,
    otp,
    newPassword
  }) {
    const response = await fetch(
      "http://localhost:8081/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
          newPassword: newPassword
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Unable to reset password."
      );
    }

    return result;
  }
};

>>>>>>> 713e2ec (Add New Feature in Forgot Password)
