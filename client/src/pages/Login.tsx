import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-80px)]">
      <SignIn signUpUrl="/register" />
    </div>
  );
}

export default Login
