"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { getMyProperties, deleteProperty, updateProperty } from "../../services/api";
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
  const { user, loading, isAuthenticated, isOwner } = useAuth();
  const [properties, setProperties] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isOwner)) router.push("/login");
  }, [loading, isAuthenticated, isOwner, router]);

  useEffect(() => {
    async function load() {
      const res = await getMyProperties();
      if (res.success) setProperties(res.properties);
      setFetching(false);
    }
    if (isAuthenticated && isOwner) load();
  }, [isAuthenticated, isOwner]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    const res = await deleteProperty(id);
    if (res.success) setProperties((p) => p.filter((prop) => prop.id !== id));
  };

  const startEdit = (prop) => {
    setEditingId(prop.id);
    setEditForm({ title: prop.title, price: prop.price, location: prop.location, area: prop.area });
  };

  const saveEdit = async () => {
    const res = await updateProperty(editingId, editForm);
    if (res.success) {
      setProperties((p) => p.map((prop) => prop.id === editingId ? { ...prop, ...editForm } : prop));
      setEditingId(null);
    }
  };

  if (loading || fetching) return null;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        {/* Breadcrumb */}
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

        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}><span className={styles.statValue}>{properties.length}</span><span className={styles.statLabel}>Total Listings</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{properties.filter(p => p.listingType === "buy").length}</span><span className={styles.statLabel}>For Sale</span></div>
          <div className={styles.statCard}><span className={styles.statValue}>{properties.filter(p => p.listingType === "rent").length}</span><span className={styles.statLabel}>For Rent</span></div>
        </div>

        {properties.length > 0 ? (
          <div className={styles.propList}>
            {properties.map((prop) => (
              <div key={prop.id} className={styles.propCard}>
                <div className={styles.propImage}>
                  <img src={prop.image || "/img/buy-properties/1.jpg"} alt={prop.title} loading="lazy" />
                  <span className={styles.propBadge}>{prop.listingType === "rent" ? "Rent" : "Sale"}</span>
                </div>
                <div className={styles.propInfo}>
                  {editingId === prop.id ? (
                    <div className={styles.editInline}>
                      <input className={styles.editInput} value={editForm.title} onChange={(e) => setEditForm(p => ({...p, title: e.target.value}))} placeholder="Title" />
                      <input className={styles.editInput} value={editForm.location} onChange={(e) => setEditForm(p => ({...p, location: e.target.value}))} placeholder="Location" />
                      <input className={styles.editInput} type="number" value={editForm.price} onChange={(e) => setEditForm(p => ({...p, price: Number(e.target.value)}))} placeholder="Price" />
                      <input className={styles.editInput} type="number" value={editForm.area} onChange={(e) => setEditForm(p => ({...p, area: Number(e.target.value)}))} placeholder="Area" />
                      <div className={styles.editBtns}>
                        <button className={styles.saveBtn} onClick={saveEdit}>Save</button>
                        <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={styles.propTitle}>{prop.title}</h3>
                      <p className={styles.propLocation}>{prop.location}, {prop.city}</p>
                      <div className={styles.propMeta}>
                        {prop.bhk > 0 && <span>{prop.bhk} BHK</span>}
                        <span>{prop.area} Sq.Ft.</span>
                        <span className={styles.propPrice}>{formatPrice(prop.price)}</span>
                      </div>
                    </>
                  )}
                </div>
                {editingId !== prop.id && (
                  <div className={styles.propActions}>
                    <button className={styles.editBtn} onClick={() => startEdit(prop)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(prop.id)}>Delete</button>
                  </div>
                )}
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
    </div>
  );
}
