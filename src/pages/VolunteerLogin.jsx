import Login from "./Login";

export default function VolunteerLogin() {
  return (
    <Login
      title="Volunteer account"
      heading="Welcome back"
      intro="View active requests and help coordinate food deliveries."
      forgotPasswordHref="/forgot-password"
      secondaryLink={{ label: "Need a different role?", href: "/login", text: "Sign in as user" }}
    />
  );
}
