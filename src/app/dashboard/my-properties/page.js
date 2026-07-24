"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { getMyProperties, deleteProperty } from "../../services/api";
import { showWishlistToast } from "../../components/WishlistToast";
import ConfirmModal from "../../components/ConfirmModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./myproperties.module.css";

function formatPrice(price) {
  if (!price) return "N/A";
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} Lakh`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

export default function MyPropertiesPage() {
  const router = useRouter();
  const { loading, isAuthenticated, isOwner } = useAuth();
  const [properties, setProperties] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isOwner)) router.push("/login");
  }, [loading, isAuthenticated, isOwner, router]);

  useEffect(() => {
    async function load() {
      const res = await getMyProperties();
      if (res.success) setProperties(res.properties || []);
      setFetching(false);
    }
    if (isAuthenticated && isOwner) load();
  }, [isAuthenticated, isOwner]);

  const handleDelete = async () => {
    setDeleting(true);
    const res = await deleteProperty(deleteId);
    setDeleting(false);
    if (res.success) {
      setProperties((p) => p.filter((prop) => prop.id !== deleteId));
      showWishlistToast("Property deleted successfully.", "removed");
    } else {
      showWishlistToast("Failed to delete property.", "removed");
    }
    setDeleteId(null);
  };

  if (loading || fetching) return null;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.breadcrumb}>
          <Link href="/profile" className={styles.breadcrumbLink}>← Back to Dashboard</Link>
        </div>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>My Properties</h1>
            <p className={styles.pageSubtitle}>
              {properties.length === 0 ? "No properties listed yet" : `Manage your ${properties.length} listed ${properties.length === 1 ? "property" : "properties"}`}
            </p>
          </div>
          <Link href="/dashboard/add-property" className={styles.addBtn}>+ Add New</Link>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}><span className={styles.statValue}>{properties.length}</span><span className={styles.statLabel}>Total</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{properties.filter(p => p.listingType === "buy").length}</span><span className={styles.statLabel}>For Sale</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{properties.filter(p => p.listingType === "rent").length}</span><span className={styles.statLabel}>For Rent</span></div>
        </div>

        {properties.length > 0 ? (
          <div className={styles.propList}>
            {properties.map((prop) => (
              <div key={prop.id} className={styles.propCard}>
                <div className={styles.propImage}>
                  <img src={prop.image && !prop.image.startsWith("blob:") ? prop.image : "/img/buy-properties/1.jpg"} alt={prop.title} loading="lazy" />
                  <span className={styles.propBadge}>{prop.listingType === "rent" ? "Rent" : "Sale"}</span>
                </div>
                <div className={styles.propInfo}>
                  <h3 className={styles.propTitle}>{prop.title}</h3>
                  <p className={styles.propLocation}>{prop.location}{prop.city ? `, ${prop.city}` : ""}</p>
                  <div className={styles.propMeta}>
                    {prop.bhk > 0 && <span>{prop.bhk} BHK</span>}
                    {prop.area > 0 && <span>{prop.area} Sq.Ft.</span>}
                    <span className={styles.propPrice}>{formatPrice(prop.price)}</span>
                  </div>
                </div>
                <div className={styles.propActions}>
                  <Link href={`/dashboard/edit-property/${prop.id}`} className={styles.editBtn}>Edit</Link>
                  <button className={styles.deleteBtn} onClick={() => setDeleteId(prop.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>No properties listed yet</h3>
            <p>Start by adding your first property listing.</p>
            <Link href="/dashboard/add-property" className={styles.addBtn}>+ Add Property</Link>
          </div>
        )}
      </main>
      <Footer />

      {deleteId && (
        <ConfirmModal
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
