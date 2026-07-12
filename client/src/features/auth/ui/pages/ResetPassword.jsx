"use client";

import { useSearchParams } from "next/navigation";
import { LuLock, LuArrowLeft, LuCircleCheck } from "react-icons/lu";

import CenteredAuthLayout from "../layouts/jsx/CenteredAuthLayout";
import Card from "../components/jsx/Card";
import Logo from "../components/jsx/Logo";
import PasswordField from "../components/jsx/PasswordField";
import ActionButton from "../components/jsx/ActionButton";

import useResetPassword from "../../hooks/useResetPassword";
import styles from "../css/ForgotPassword.module.css"; // We reuse forgot password layout css style
import successStyles from "../components/css/SuccessMessage.module.css";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { form, onSubmit, serverError, isSubmitting, submitted } = useResetPassword(token);
  const { register, formState: { errors } } = form;

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  if (!token) {
    return (
      <CenteredAuthLayout>
        <Card className={styles.card}>
          <div className={styles.logoSection}>
            <Logo />
            <p className={styles.platform}>TransitOps Management Platform</p>
          </div>
          <div className={successStyles.container}>
            <h2 className={styles.error} style={{ width: "100%" }}>
              No reset token found. Please check your email link.
            </h2>
            <button type="button" className={successStyles.button} onClick={handleBackToLogin}>
              <LuArrowLeft size={18} />
              Back to Login
            </button>
          </div>
        </Card>
      </CenteredAuthLayout>
    );
  }

  return (
    <CenteredAuthLayout>
      <Card className={styles.card}>
        <div className={styles.logoSection}>
          <Logo />
          <p className={styles.platform}>TransitOps Management Platform</p>
        </div>

        {submitted ? (
          <div className={successStyles.container}>
            <div className={successStyles.icon}>
              <LuCircleCheck size={48} />
            </div>
            <h2 className={successStyles.title}>Password Reset Successful</h2>
            <p className={successStyles.description}>
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <button type="button" className={successStyles.button} onClick={handleBackToLogin}>
              <LuArrowLeft size={18} />
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className={styles.form}>
            <p className={styles.description}>
              Create a new strong password for your commuteX account.
            </p>

            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              error={errors.password?.message}
              {...register("password")}
              required
            />

            <PasswordField
              label="Confirm New Password"
              placeholder="Confirm new password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              required
            />

            {serverError && <p className={styles.error}>{serverError}</p>}

            <ActionButton type="submit" loading={isSubmitting}>
              Reset Password
            </ActionButton>
          </form>
        )}
      </Card>
    </CenteredAuthLayout>
  );
}
