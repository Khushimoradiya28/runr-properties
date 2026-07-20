"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./enquiries.module.css";

// Mock enquiries - will come from API later
const mockEnquiries = [
  { id: 1, name: "Raj Patel", email: "raj@email.com", phone: "9876543210", message: "Interested in this property. Please share more details.", propertyTitle: "3 BHK Luxury Apartment", date: "2025-07-15" },
  { id: 2, name: "Priya Shah", email: "priya@email.com", phone: "9988776655", message: "Is this property available for immediate possession?", propertyTitle: "2 BHK Modern Flat", date: "2025-07-14" },
];

export default function EnquiriesPage() {
  const router = useRouter();
  const { loading, isAuthenticated, isOwner } = useAuth();
  const [enquiries] = useState(mockEnquiries);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isOwner)) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isOwner, router]);

  if (loading) return null;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.backLink}><a href="/profile">← Back to Dashboard</a></div>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Property Enquiries</h1>
          <p className={styles.pageSubtitle}>{enquiries.length} enquiries received</p>
        </div>

        {enquiries.length > 0 ? (
          <div className={styles.enquiryList}>
            {enquiries.map((enq) => (
              <div key={enq.id} className={styles.enquiryCard}>
                <div className={styles.enquiryHeader}>
                  <div className={styles.enquiryAvatar}>{enq.name.charAt(0)}</div>
                  <div className={styles.enquiryMeta}>
                    <h3 className={styles.enquiryName}>{enq.name}</h3>
                    <span className={styles.enquiryDate}>{new Date(enq.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
                <div className={styles.enquiryBody}>
                  <p className={styles.enquiryProperty}>Re: <strong>{enq.propertyTitle}</strong></p>
                  <p className={styles.enquiryMessage}>{enq.message}</p>
                </div>
                <div className={styles.enquiryFooter}>
                  <a href={`tel:${enq.phone}`} className={styles.contactBtn}>📞 {enq.phone}</a>
                  <a href={`mailto:${enq.email}`} className={styles.contactBtn}>✉️ {enq.email}</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>No enquiries yet</h3>
            <p>When buyers enquire about your properties, they will appear here.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
