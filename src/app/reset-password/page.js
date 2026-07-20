"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../login/auth.module.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.newPassword || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    // In real app, token comes from URL query param
    const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") || "mock-token" : "mock-token";
    const result = await resetPassword({ token, newPassword: form.newPassword });
    setLoading(false);

    if (result.success) {
      setMsg(result.message);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Reset Password</h1>
            <p className={styles.authSubtitle}>Enter your new password below</p>
          </div>

          <form className={styles.authForm} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            {msg && <div className={styles.infoMsg}>{msg}</div>}

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="reset-password">New Password</label>
              <input id="reset-password" type="password" className={styles.formInput} value={form.newPassword} onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))} placeholder="Min 6 characters" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="reset-confirm">Confirm Password</label>
              <input id="reset-confirm" type="password" className={styles.formInput} value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="Re-enter password" />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </button>
          </form>

          <p className={styles.switchText}>
            Remember your password? <Link href="/login" className={styles.switchLink}>Sign In</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
