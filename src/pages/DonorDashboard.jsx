import { useLayoutEffect } from "react";
import { paymentApi } from "../api/services";
import LegacyPage from "../components/LegacyPage";

export default function DonorDashboard() {
  useLayoutEffect(() => {
    window.foodsharePaymentApi = paymentApi;
    return () => {
      delete window.foodsharePaymentApi;
    };
  }, []);

  return <LegacyPage pageKey="donor-dashboard.html" />;
}
