"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout, update, isOwner } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", mobile: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const [passMsg, setPassMsg] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, mobile: user.mobile || "" });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}><p>Loading...</p></main>
        <Footer />
      </div>
    );
  }

  const handleProfileSave = async () => {
    const result = await update(editForm);
    if (result.success) {
      setMsg("Profile updated successfully");
      setEditing(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMsg("");
    if (passForm.newPassword.length < 6) {
      setPassMsg("New password must be at least 6 characters");
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg("Passwords do not match");
      return;
    }
    const result = await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
    setPassMsg(result.message);
    if (result.success) {
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPassMsg(""), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className={styles.userName}>{user.name}</h1>
            <span className={styles.roleBadge}>{user.role === "owner" ? "Property Owner" : "Buyer"}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        {msg && <div className={styles.successMsg}>{msg}</div>}

        {/* Profile Info */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Profile Information</h2>
            {!editing && <button className={styles.editBtn} onClick={() => setEditing(true)}>Edit</button>}
          </div>

          {editing ? (
            <div className={styles.editGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Full Name</label>
                <input className={styles.fieldInput} value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Mobile</label>
                <input className={styles.fieldInput} value={editForm.mobile} onChange={(e) => setEditForm((p) => ({ ...p, mobile: e.target.value }))} />
              </div>
              <div className={styles.editActions}>
                <button className={styles.saveBtn} onClick={handleProfileSave}>Save Changes</button>
                <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><span className={styles.infoLabel}>Name</span><span className={styles.infoValue}>{user.name}</span></div>
              <div className={styles.infoItem}><span className={styles.infoLabel}>Email</span><span className={styles.infoValue}>{user.email}</span></div>
              <div className={styles.infoItem}><span className={styles.infoLabel}>Mobile</span><span className={styles.infoValue}>{user.mobile || "Not added"}</span></div>
              <div className={styles.infoItem}><span className={styles.infoLabel}>Role</span><span className={styles.infoValue}>{user.role === "owner" ? "Property Owner" : "Buyer"}</span></div>
              <div className={styles.infoItem}><span className={styles.infoLabel}>Member Since</span><span className={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span></div>
            </div>
          )}
        </section>

        {/* Change Password */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Security</h2>
            <button className={styles.editBtn} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Close" : "Change Password"}
            </button>
          </div>

          {showPassword && (
            <form className={styles.editGrid} onSubmit={handlePasswordChange}>
              {passMsg && <div className={styles.infoMsg}>{passMsg}</div>}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Current Password</label>
                <input type="password" className={styles.fieldInput} value={passForm.currentPassword} onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>New Password</label>
                <input type="password" className={styles.fieldInput} value={passForm.newPassword} onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Confirm New Password</label>
                <input type="password" className={styles.fieldInput} value={passForm.confirmPassword} onChange={(e) => setPassForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
              <button type="submit" className={styles.saveBtn}>Update Password</button>
            </form>
          )}
        </section>

        {/* Owner section */}
        {isOwner && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>My Properties</h2>
              <button className={styles.addPropertyBtn}>+ Add Property</button>
            </div>
            <p className={styles.emptyText}>You haven't listed any properties yet. Click &quot;Add Property&quot; to get started.</p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
