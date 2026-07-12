"use client";

import { useState } from "react";
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

import styles from "../css/Signup.module.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      console.log("Signup:", form);
    } catch (err) {
      console.error("Signup error:", err);
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
            icon={<LuUserPlus size={24} />}
            title="Create your account"
            subtitle="Fill in the details to get started"
          />

          <form onSubmit={handleSubmit} className={styles.form}>
            <InputField
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              icon={LuUser}
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              icon={LuMail}
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <ActionButton type="submit" loading={loading}>
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
