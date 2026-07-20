"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../login/auth.module.css";

export default function ForgotPasswordPage() {
  const { forgotPass } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    const result = await forgotPass({ email });
    setLoading(false);

    if (result.success) {
      setMsg(result.message);
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
            <h1 className={styles.authTitle}>Forgot Password</h1>
            <p className={styles.authSubtitle}>Enter your email to receive a password reset link</p>
          </div>

          <form className={styles.authForm} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            {msg && <div className={styles.infoMsg}>{msg}</div>}

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="forgot-email">Email</label>
              <input id="forgot-email" type="email" className={styles.formInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              <span>{loading ? "Sending..." : "Send Reset Link"}</span>
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
