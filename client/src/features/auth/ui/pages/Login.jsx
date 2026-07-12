"use client";

import { useState } from "react";
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

import styles from "../css/Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleDemoSelect = ({ email, password }) => {
    setForm({ email, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API call will be handled by parent/container component
      console.log("Login:", form);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <ForgotPasswordLink />

            {error && <p className={styles.error}>{error}</p>}

            <ActionButton type="submit" loading={loading}>
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
