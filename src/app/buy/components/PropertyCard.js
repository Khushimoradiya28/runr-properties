"use client";

import { useWishlist } from "../../context/WishlistContext";
import styles from "./PropertyCard.module.css";

function formatPrice(price) {
  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹ ${(price / 100000).toFixed(1)} Lakh`;
  }
  return `₹ ${price.toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PropertyCard({ property, viewMode }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(property.id);

  const isListView = viewMode === "list";

  return (
    <article className={`${styles.card} ${isListView ? styles.cardList : ""}`}>
      {/* Image */}
      <div className={styles.cardImageWrap}>
        <div className={styles.cardImage}>
          <img src={property.image} alt={property.title} className={styles.cardImg} loading="lazy" />
        </div>
        {/* Badges */}
        <div className={styles.badgeRow}>
          <span className={styles.badgeType}>{capitalizeFirst(property.type)}</span>
          {property.furnishing !== "unfurnished" && (
            <span className={styles.badgeFurnish}>
              {property.furnishing === "furnished" ? "Furnished" : "Semi-Furnished"}
            </span>
          )}
        </div>
        {/* Like button */}
        <button
          className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
          onClick={() => toggleWishlist(property)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={liked ? "#e0245e" : "transparent"}
              stroke={liked ? "none" : "#ffffff"}
              strokeWidth="1.6"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{property.title}</h3>
          <p className={styles.cardLocation}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 21s-6.2-5.2-8.4-9.1A5.6 5.6 0 0 1 12 4.6a5.6 5.6 0 0 1 8.4 7.3C18.2 15.8 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
              />
              <circle cx="12" cy="11.2" r="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
            {property.location}
          </p>
        </div>

        {/* Details */}
        <div className={styles.cardDetails}>
          {property.bhk > 0 && (
            <span className={styles.detailItem}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 21V8l9-5 9 5v13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
                <rect x="7" y="13" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <rect x="13" y="13" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
              {property.bhk} BHK
            </span>
          )}
          <span className={styles.detailItem}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
              <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            {property.area.toLocaleString("en-IN")} Sq.Ft.
          </span>
          <span className={styles.detailItem}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" fill="none" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {formatDate(property.postedDate)}
          </span>
        </div>

        {/* Amenities */}
        {property.amenities.length > 0 && (
          <div className={styles.amenities}>
            {property.amenities.slice(0, 3).map((a) => (
              <span key={a} className={styles.amenityTag}>{a}</span>
            ))}
            {property.amenities.length > 3 && (
              <span className={styles.amenityMore}>+{property.amenities.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={styles.cardFooter}>
          <div className={styles.priceBlock}>
            <span className={styles.priceValue}>{formatPrice(property.price)}</span>
            <span className={styles.priceLabel}>onwards</span>
          </div>
          <div className={styles.postedBy}>
            <span className={styles.postedByLabel}>by</span>
            <span className={styles.postedByValue}>{capitalizeFirst(property.postedBy)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
