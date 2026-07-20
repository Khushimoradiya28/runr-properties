"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { addProperty } from "../../services/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./addproperty.module.css";

const amenitiesList = ["Parking", "Gym", "Swimming Pool", "Garden", "Lift", "AC", "Club House", "Security", "Power Backup", "Water Supply"];

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, isOwner } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "", location: "", city: "", type: "apartment", bhk: "2",
    price: "", area: "", furnishing: "unfurnished", description: "",
    image: "/img/buy-properties/1.jpg", amenities: [], listingType: "buy",
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isOwner)) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, isOwner, router]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const toggleAmenity = (amenity) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(amenity)
        ? p.amenities.filter((a) => a !== amenity)
        : [...p.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.location || !form.city || !form.price || !form.area) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    const result = await addProperty({
      ...form,
      price: parseInt(form.price),
      area: parseInt(form.area),
      bhk: parseInt(form.bhk),
      postedBy: "owner",
      postedDate: new Date().toISOString().split("T")[0],
    });
    setSubmitting(false);

    if (result.success) {
      setSuccess("Property listed successfully!");
      setTimeout(() => router.push("/profile"), 1500);
    } else {
      setError(result.message);
    }
  };

  if (loading || !user) return null;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/profile" className={styles.breadcrumbLink}>Profile</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Add Property</span>
          </div>
          <h1 className={styles.pageTitle}>Add New Property</h1>
        </div>

        <div className={styles.formCard}>
          {error && <div className={styles.errorMsg}>{error}</div>}
          {success && <div className={styles.successMsg}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Basic Details</h3>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Property Title *</label>
                  <input name="title" className={styles.formInput} value={form.title} onChange={handleChange} placeholder="e.g. 3 BHK Luxury Apartment" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Listing Type *</label>
                  <select name="listingType" className={styles.formSelect} value={form.listingType} onChange={handleChange}>
                    <option value="buy">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Property Type *</label>
                  <select name="type" className={styles.formSelect} value={form.type} onChange={handleChange}>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa / House</option>
                    <option value="plot">Plot / Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>BHK</label>
                  <select name="bhk" className={styles.formSelect} value={form.bhk} onChange={handleChange}>
                    <option value="0">N/A</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Furnishing</label>
                  <select name="furnishing" className={styles.formSelect} value={form.furnishing} onChange={handleChange}>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="furnished">Furnished</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Location</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City *</label>
                  <select name="city" className={styles.formSelect} value={form.city} onChange={handleChange}>
                    <option value="">Select City</option>
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="surat">Surat</option>
                    <option value="vadodara">Vadodara</option>
                    <option value="rajkot">Rajkot</option>
                    <option value="gandhinagar">Gandhinagar</option>
                    <option value="bhavnagar">Bhavnagar</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Locality / Address *</label>
                  <input name="location" className={styles.formInput} value={form.location} onChange={handleChange} placeholder="e.g. SG Highway, Near Mall" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Pricing & Area</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{form.listingType === "rent" ? "Monthly Rent (₹) *" : "Price (₹) *"}</label>
                  <input name="price" type="number" className={styles.formInput} value={form.price} onChange={handleChange} placeholder={form.listingType === "rent" ? "e.g. 25000" : "e.g. 8500000"} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Area (Sq.Ft.) *</label>
                  <input name="area" type="number" className={styles.formInput} value={form.area} onChange={handleChange} placeholder="e.g. 1200" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Amenities</h3>
              <div className={styles.amenitiesGrid}>
                {amenitiesList.map((a) => (
                  <button key={a} type="button" className={`${styles.amenityChip} ${form.amenities.includes(a) ? styles.amenityChipActive : ""}`} onClick={() => toggleAmenity(a)}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Property Image</h3>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Upload Image * (600×400px, JPG/PNG, max 500KB)</label>
                <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className={styles.formInput} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setForm((p) => ({ ...p, image: url, imageFile: file }));
                  }
                }} />
                {form.image && (
                  <div className={styles.imagePreview}>
                    <img src={form.image} alt="Preview" />
                    <span className={styles.imageHint}>Recommended: 600×400px, Landscape, JPG/PNG</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Description</h3>
              <div className={styles.formGroup}>
                <textarea name="description" className={styles.formTextarea} value={form.description} onChange={handleChange} placeholder="Describe your property..." />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              <span>{submitting ? "Listing Property..." : "List Property"}</span>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
