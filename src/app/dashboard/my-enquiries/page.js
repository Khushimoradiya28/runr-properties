"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { getMyEnquiries, deleteEnquiry } from "../../services/api";
import { showWishlistToast } from "../../components/WishlistToast";
import ConfirmModal from "../../components/ConfirmModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./myenquiries.module.css";

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatPrice(price) {
  if (!price) return "";
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} Lakh`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

function getImage(prop) {
  if (!prop) return "/img/buy-properties/1.jpg";
  if (prop.images && prop.images.length > 0) {
    const img = prop.images[0];
    if (img.startsWith("/uploads")) return `http://localhost:5000${img}`;
    return img;
  }
  return "/img/buy-properties/1.jpg";
}

export default function MyEnquiriesPage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    async function load() {
      const res = await getMyEnquiries();
      if (res.success) setEnquiries(res.enquiries);
      setFetching(false);
    }
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const handleDelete = async () => {
    setDeleting(true);
    const res = await deleteEnquiry(deleteId);
    setDeleting(false);
    if (res.success) {
      setEnquiries((p) => p.filter((e) => e._id !== deleteId));
      showWishlistToast("Enquiry deleted.", "removed");
    } else {
      showWishlistToast(res.message || "Failed to delete.", "removed");
    }
    setDeleteId(null);
  };

  if (loading || fetching) return null;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.backLink}><Link href="/profile">← Back to Dashboard</Link></div>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Enquiries</h1>
          <p className={styles.pageSubtitle}>{enquiries.length} enquiries sent</p>
        </div>

        {enquiries.length > 0 ? (
          <div className={styles.enquiryList}>
            {enquiries.map((enq) => {
              const prop = enq.property || {};
              return (
                <div key={enq._id} className={styles.enquiryCard}>
                  <div className={styles.cardImage}>
                    <img src={getImage(prop)} alt={prop.title || "Property"} loading="lazy" />
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <h3 className={styles.propTitle}>{prop.title || "Property"}</h3>
                      {(prop.locality || prop.city) && (
                        <p className={styles.propLocation}>{prop.locality}{prop.city ? `, ${prop.city}` : ""}</p>
                      )}
                      {prop.price > 0 && <span className={styles.propPrice}>{formatPrice(prop.price)}</span>}
                    </div>
                    <p className={styles.messageText}><strong>Message:</strong> {enq.message}</p>
                    <div className={styles.cardMeta}>
                      <span className={`${styles.statusBadge} ${styles[`status${enq.status || "Pending"}`]}`}>{enq.status || "Pending"}</span>
                      <span className={styles.dateText}>Sent: {formatDate(enq.createdAt)}</span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    {prop._id && <Link href={`/property/${prop._id}`} className={styles.viewBtn}>View</Link>}
                    <button className={styles.deleteBtn} onClick={() => setDeleteId(enq._id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>No enquiries sent yet</h3>
            <p>Browse properties and send enquiries to get started.</p>
            <Link href="/buy" className={styles.browseBtn}>Browse Properties</Link>
          </div>
        )}
      </main>
      <Footer />
      {deleteId && <ConfirmModal title="Delete Enquiry" message="Are you sure you want to delete this enquiry?" confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
    </div>
  );
}
