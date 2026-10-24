import { useLayoutEffect } from "react";
import { API_BASE_URL } from "../api/client";
import { notificationApi, paymentApi } from "../api/services";
import LegacyPage from "../components/LegacyPage";

export default function DonorDashboard() {
  useLayoutEffect(() => {
    window.foodshareApiBaseUrl = API_BASE_URL;
    window.foodsharePaymentApi = paymentApi;
    window.foodshareNotificationApi = notificationApi;
    return () => {
      delete window.foodshareApiBaseUrl;
      delete window.foodsharePaymentApi;
      delete window.foodshareNotificationApi;
    };
  }, []);

  return <LegacyPage pageKey="donor-dashboard.html" />;
}
