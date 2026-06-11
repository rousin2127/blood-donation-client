import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hook/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import { toastError, toastSuccess } from "../../../utils/toast";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL || "demo@bloodcare.bd";
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || "Demo@123456";

const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { signInUser, signInGoogle } = useAuth();
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    setAuthError("");
    setLoading(true);
    signInUser(data.email.trim(), data.password)
      .then(() => {
        toastSuccess("Logged in successfully.");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
          setAuthError("Invalid email or password.");
        } else if (error.code === "auth/user-not-found") {
          setAuthError("No account found with this email.");
        } else {
          setAuthError("Login failed. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  };

  const handleGoogle = () => {
    setLoading(true);
    signInGoogle()
      .then(() => {
        toastSuccess("Signed in with Google.");
        navigate(from, { replace: true });
      })
      .catch(() => toastError("Google sign-in failed."))
      .finally(() => setLoading(false));
  };

  const fillDemo = () => {
    setValue("email", DEMO_EMAIL);
    setValue("password", DEMO_PASSWORD);
    toastSuccess("Demo credentials filled. Click Login.");
  };

  return (
    <Card className="w-full max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold text-center">Welcome back</h1>
      <p className="text-center text-base-content/70 text-sm mt-1">Sign in to your BloodCare account</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {authError && (
          <div className="alert alert-error text-sm rounded-xl">{authError}</div>
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          error={errors.password?.message}
        />

        <div className=" flex flex-col gap-3 mt-6">
          <Button type="submit" className="w-full" loading={loading}>
            Login
          </Button>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>

          <Button type="button" variant="ghost" className="w-full text-sm" onClick={fillDemo}>
            Use demo account
          </Button>

          <p className="text-center text-sm text-base-content/70">
            No account?{" "}
            <Link to="/register" className="link link-primary font-medium">Register</Link>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default Login;
