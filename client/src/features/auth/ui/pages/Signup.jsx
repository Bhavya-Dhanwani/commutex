"use client";

import { LuUserPlus, LuUser, LuMail } from "react-icons/lu";

import AuthLayout from "../layouts/jsx/AuthLayout";
import LeftPanel from "../layouts/jsx/LeftPanel";
import RightPanel from "../layouts/jsx/RightPanel";

import Card from "../components/jsx/Card";
import FormHeader from "../components/jsx/FormHeader";
import InputField from "../components/jsx/InputField";
import PasswordField from "../components/jsx/PasswordField";
import ActionButton from "../components/jsx/ActionButton";
import Divider from "../components/jsx/Divider";
import FormFooter from "../components/jsx/FormFooter";

import useSignup from "../../hooks/useSignup";
import usePublicRoute from "../../hooks/usePublicRoute";
import styles from "../css/Signup.module.css";

export default function Signup() {
  const { loading: sessionLoading } = usePublicRoute();
  const { form, onSubmit, serverError, isSubmitting } = useSignup();
  const { register, formState: { errors } } = form;

  if (sessionLoading) {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#111111", fontFamily: "var(--font-poppins), sans-serif" }}>Verifying session...</p>
      </div>
    );
  }

  return (
    <AuthLayout>
      <LeftPanel />
      <RightPanel>
        <Card>
          <FormHeader
            icon={<LuUserPlus size={24} />}
            title="Create your account"
            subtitle="Fill in the details to get started"
          />

          <form onSubmit={onSubmit} className={styles.form}>
            <InputField
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              icon={LuUser}
              error={errors.name?.message}
              {...register("name")}
              required
            />

            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              icon={LuMail}
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

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              required
            />

            {serverError && <p className={styles.error}>{serverError}</p>}

            <ActionButton type="submit" loading={isSubmitting}>
              Sign Up
            </ActionButton>
          </form>

          <div className={styles.footerSection}>
            <Divider />
            <FormFooter
              text="Already have an account?"
              linkText="Login"
              href="/login"
            />
          </div>
        </Card>
      </RightPanel>
    </AuthLayout>
  );
}
