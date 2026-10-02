import { apiRequest, setAccessToken } from "./client";

export function dashboardPathForRole(role) {
  const dashboardByRole = {
    ADMIN: "/admin-dashboard",
    DONOR: "/donor-dashboard",
    NGO: "/ngo-dashboard",
    VOLUNTEER: "/volunteer-dashboard"
  };
  return dashboardByRole[String(role || "").toUpperCase()] || "/";
}

function syncLegacyDashboardSession(response) {
  const legacyUser = {
    id: response.userId,
    role: String(response.role || "").toLowerCase(),
    name: response.fullName,
    email: response.email
  };
  const users = JSON.parse(localStorage.getItem("foodshare_users") || "[]");
  const existingIndex = users.findIndex((user) => user.id === legacyUser.id || user.email === legacyUser.email);
  if (existingIndex >= 0) users[existingIndex] = { ...users[existingIndex], ...legacyUser };
  else users.push(legacyUser);
  localStorage.setItem("foodshare_users", JSON.stringify(users));
  localStorage.setItem("foodshare_session", JSON.stringify({ userId: legacyUser.id }));
}

export const authApi = {
  async login(credentials) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    if (!response.token) throw new Error(response.message || "Login failed");
    setAccessToken(response.token);
    syncLegacyDashboardSession(response);
    return response;
  },
  async register(details) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(details)
    });
    if (!response.token) throw new Error(response.message || "Registration failed");
    await userApi.register({
      fullName: details.fullName,
      email: details.email,
      password: details.password,
      role: details.role,
      phone: details.phone || `9${String(response.userId).padStart(9, "0")}`,
      address: details.address || null
    });
    setAccessToken(response.token);
    syncLegacyDashboardSession(response);
    return response;
  },
<<<<<<< HEAD
=======
  // Forgot Password
    async forgotPassword(email) { const response = await apiRequest( "/auth/forgot-password", 
      { method: "POST", body: JSON.stringify({ email: email }) } ); if (!response.success) { throw new Error( response.message || "Unable to send OTP" ); } return response; },

  // Verify OTP
  async verifyOtp(email, otp) { const response = await apiRequest( "/auth/verify-otp", { method: "POST", body: JSON.stringify({ email: email, otp: otp }) } ); if (!response.success) { throw new Error( response.message || "Invalid OTP" ); } return response; },
  // Reset Password
  async resetPassword({ email, otp, newPassword }) { const response = await apiRequest( "/auth/reset-password", { method: "POST", body: JSON.stringify({ email: email, otp: otp, newPassword: newPassword }) } ); if (!response.success) { throw new Error( response.message || "Password reset failed" ); } return response; },
>>>>>>> 713e2ec (Add New Feature in Forgot Password)
  logout() {
    setAccessToken(null);
  }
};

export const emailApi = {
  async sendPasswordResetOtp({ email, otp }) {
    console.info(`[FoodShare] Verification OTP for ${email}: ${otp}`);
    return {
      success: true,
      otp,
      message: `Verification code generated.`
    };
  },
  async resetPassword({ email, password }) {
    const users = JSON.parse(localStorage.getItem("foodshare_users") || "[]");
    const index = users.findIndex((user) => user.email && user.email.toLowerCase() === String(email).toLowerCase());

    if (index === -1) {
      users.push({
        id: Date.now(),
        email: String(email).trim().toLowerCase(),
        password,
        name: String(email).split("@")[0],
        role: "donor"
      });
      localStorage.setItem("foodshare_users", JSON.stringify(users));
      return { success: true, message: "Password updated successfully." };
    }

    users[index] = { ...users[index], password };
    localStorage.setItem("foodshare_users", JSON.stringify(users));
    return { success: true, message: "Password updated successfully." };
  }
};

export const foodApi = {
  getAvailable() {
    return apiRequest("/foods/available");
  },
  getAll() {
    return apiRequest("/foods");
  },
  create(food) {
    return apiRequest("/foods", { method: "POST", body: JSON.stringify(food) });
  },
  update(id, food) {
    return apiRequest(`/foods/${id}`, { method: "PUT", body: JSON.stringify(food) });
  },
  remove(id) {
    return apiRequest(`/foods/${id}`, { method: "DELETE" });
  }
};

export const requestApi = {
  create(request) {
    return apiRequest("/requests", { method: "POST", body: JSON.stringify(request) });
  },
  getByUser(userId) {
    return apiRequest(`/requests/user/${userId}`);
  },
  accept(id) {
    return apiRequest(`/requests/${id}/accept`, { method: "PUT" });
  },
  reject(id) {
    return apiRequest(`/requests/${id}/reject`, { method: "PUT" });
  }
};

export const userApi = {
  register(details) {
    return apiRequest("/users/register", { method: "POST", body: JSON.stringify(details) });
  },
  get(id) {
    return apiRequest(`/users/${id}`);
  },
  update(id, details) {
    return apiRequest(`/users/${id}`, { method: "PUT", body: JSON.stringify(details) });
  }
};