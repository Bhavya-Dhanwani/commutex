"use client";

import { LuUser } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";

import AuthLayout from "../layouts/jsx/AuthLayout";
import LeftPanel from "../layouts/jsx/LeftPanel";
import RightPanel from "../layouts/jsx/RightPanel";

import Card from "../components/jsx/Card";
import FormHeader from "../components/jsx/FormHeader";
import InputField from "../components/jsx/InputField";
import PasswordField from "../components/jsx/PasswordField";
import ActionButton from "../components/jsx/ActionButton";
import Divider from "../components/jsx/Divider";
import SocialButton from "../components/jsx/SocialButton";
import FormFooter from "../components/jsx/FormFooter";
import ForgotPasswordLink from "../components/jsx/ForgotPasswordLink";
import DemoAccounts from "../components/jsx/DemoAccounts";

import useLogin from "../../hooks/useLogin";
import usePublicRoute from "../../hooks/usePublicRoute";
import styles from "../css/Login.module.css";

export default function Login() {
  const { loading: sessionLoading } = usePublicRoute();
  const { form, onSubmit, serverError, isSubmitting } = useLogin();
  const { register, setValue, formState: { errors } } = form;

  if (sessionLoading) {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#111111", fontFamily: "var(--font-poppins), sans-serif" }}>Verifying session...</p>
      </div>
    );
  }

  const handleDemoSelect = ({ email, password }) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
  };

  return (
    <AuthLayout>
      <LeftPanel />
      <RightPanel>
        <Card>
          <FormHeader
            icon={<LuUser size={24} />}
            title="Welcome back"
            subtitle="Login to your account to continue."
          />

          <form onSubmit={onSubmit} className={styles.form}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register("email")}
              required
            />

            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
              required
            />

            <ForgotPasswordLink />

            {serverError && <p className={styles.error}>{serverError}</p>}

            <ActionButton type="submit" loading={isSubmitting}>
              Login
            </ActionButton>
          </form>

          <Divider text="or" />

          <SocialButton icon={FcGoogle}>
            Continue with Google
          </SocialButton>

          <div className={styles.demoSection}>
            <DemoAccounts onSelect={handleDemoSelect} />
          </div>

          <FormFooter
            text="Don't have an account?"
            linkText="Sign up"
            href="/signup"
          />
        </Card>
      </RightPanel>
    </AuthLayout>
  );
}
