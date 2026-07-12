"use client";

import { LuMail } from "react-icons/lu";

import CenteredAuthLayout from "../layouts/jsx/CenteredAuthLayout";
import Card from "../components/jsx/Card";
import Logo from "../components/jsx/Logo";
import InputField from "../components/jsx/InputField";
import ActionButton from "../components/jsx/ActionButton";
import SuccessMessage from "../components/jsx/SuccessMessage";

import useForgotPassword from "../../hooks/useForgotPassword";
import usePublicRoute from "../../hooks/usePublicRoute";
import styles from "../css/ForgotPassword.module.css";

export default function ForgotPassword() {
  const { loading: sessionLoading } = usePublicRoute();
  const { form, onSubmit, serverError, isSubmitting, submitted } = useForgotPassword();
  const { register, formState: { errors } } = form;

  if (sessionLoading) {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "#111111", fontFamily: "var(--font-poppins), sans-serif" }}>Verifying session...</p>
      </div>
    );
  }

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <CenteredAuthLayout>
      <Card className={styles.card}>
        <div className={styles.logoSection}>
          <Logo />
          <p className={styles.platform}>TransitOps Management Platform</p>
        </div>

        {submitted ? (
          <SuccessMessage onBack={handleBackToLogin} />
        ) : (
          <form onSubmit={onSubmit} className={styles.form}>
            <p className={styles.description}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

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

            {serverError && <p className={styles.error}>{serverError}</p>}

            <ActionButton type="submit" loading={isSubmitting}>
              Send Reset Link
            </ActionButton>
          </form>
        )}
      </Card>
    </CenteredAuthLayout>
  );
}
