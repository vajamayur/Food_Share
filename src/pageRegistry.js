import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Donor from "./pages/Donor";
import Volunteer from "./pages/Volunteer";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerSignup from "./pages/VolunteerSignup";
import AllPages from "./AllPages";

export const pageRegistry = [
  { name: "Home", path: "/", component: Home },
  { name: "Login", path: "/login", component: Login },
  { name: "Signup", path: "/signup", component: Signup },
  { name: "About", path: "/about", component: About },
  { name: "Contact", path: "/contact", component: Contact },
  { name: "Donor Dashboard", path: "/donor-dashboard", component: DonorDashboard },
  { name: "NGO Dashboard", path: "/ngo-dashboard", component: NgoDashboard },
  { name: "Volunteer Dashboard", path: "/volunteer-dashboard", component: VolunteerDashboard },
  { name: "Admin Dashboard", path: "/admin-dashboard", component: AdminDashboard },
  { name: "Admin Login", path: "/admin-login", component: AdminLogin },
  { name: "Admin Signup", path: "/admin-signup", component: AdminSignup },
  { name: "Forgot Password", path: "/forgot-password", component: ForgotPassword },
  { name: "Reset Password", path: "/reset-password", component: ResetPassword },
  { name: "Volunteer Login", path: "/volunteer-login", component: VolunteerLogin },
  { name: "Volunteer Signup", path: "/volunteer-signup", component: VolunteerSignup },
  { name: "Donor", path: "/donor", component: Donor },
  { name: "Volunteer", path: "/volunteer", component: Volunteer },
  { name: "All Pages", path: "/all-pages", component: AllPages },
];
