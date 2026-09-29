import Login from "./Login";

export default function AdminLogin() {
  return (
    <Login
      title="Admin account"
      heading="Welcome admin"
      intro="Manage the platform, review requests and support the broader food network."
      forgotPasswordHref="/admin-forgot-password"
      secondaryLink={{ label: "Not admin?", href: "/login", text: "Return to sign in" }}
    />
  );
}
