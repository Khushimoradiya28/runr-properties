"use client";

import { useEffect, useRef } from "react";
import { useWishlist } from "../context/WishlistContext";
import styles from "./FeaturedProperties.module.css";

const featuredItems = [
  {
    id: 101,
    title: "3 BHK Apartment",
    location: "Ahmedabad",
    city: "ahmedabad",
    type: "apartment",
    bhk: 3,
    price: 8500000,
    area: 1240,
    image: "/img/featured-properties/1.jpg",
  },
  {
    id: 102,
    title: "2 BHK Apartment",
    location: "Surat",
    city: "surat",
    type: "apartment",
    bhk: 2,
    price: 6500000,
    area: 980,
    image: "/img/featured-properties/2.jpg",
  },
  {
    id: 103,
    title: "4 BHK Villa",
    location: "Vadodara",
    city: "vadodara",
    type: "villa",
    bhk: 4,
    price: 13500000,
    area: 2200,
    image: "/img/featured-properties/3.jpg",
  },
  {
    id: 104,
    title: "2 BHK Apartment",
    location: "Rajkot",
    city: "rajkot",
    type: "apartment",
    bhk: 2,
    price: 5500000,
    area: 860,
    image: "/img/featured-properties/4.jpg",
  },
  {
    id: 105,
    title: "Premium Plot",
    location: "Gandhinagar",
    city: "gandhinagar",
    type: "plot",
    bhk: 0,
    price: 11000000,
    area: 1750,
    image: "/img/featured-properties/1.jpg",
  },
  {
    id: 106,
    title: "Luxury Villa",
    location: "Vadodara",
    city: "vadodara",
    type: "villa",
    bhk: 4,
    price: 22000000,
    area: 3200,
    image: "/img/featured-properties/2.jpg",
  },
];

function formatPrice(price) {
  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹ ${(price / 100000).toFixed(0)} Lakh`;
  }
  return `₹ ${price.toLocaleString("en-IN")}`;
}

function PropertyCard({ item }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(item.id);

  const toggleLike = (e) => {
    e.stopPropagation();
    toggleWishlist(item);
  };

  return (
    <article className={styles.propertyCard}>
      <div className={styles.cardImage}>
        <img src={item.image} alt={item.title} className={styles.cardImg} loading="lazy" />
        <button
          className={liked ? `${styles.cardActionOverlay} ${styles.liked}` : styles.cardActionOverlay}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={liked}
          onClick={toggleLike}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={liked ? '#e0245e' : 'transparent'}
              stroke={liked ? 'none' : '#ffffff'}
              strokeWidth={1.6}
            />
          </svg>
        </button>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
        </div>
        <p className={styles.cardLocation}>{item.location}</p>
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>{formatPrice(item.price)}</span>
          <span className={styles.cardSize}>{item.area.toLocaleString("en-IN")} Sq.Ft.</span>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProperties() {
  const sliderRef = useRef(null);
  const cardWidthRef = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const visibleCards = 4;
  const loopItems = [...featuredItems, ...featuredItems, ...featuredItems];
  const coreSectionStart = featuredItems.length;

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector(`.${styles.propertyCard}`);
    if (!card) return;

    const cardWidth = card.offsetWidth + 24;
    cardWidthRef.current = cardWidth;
    slider.scrollLeft = cardWidth * coreSectionStart;
  }, [coreSectionStart]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const normalizePosition = () => {
      const cardWidth = cardWidthRef.current;
      if (!cardWidth) return;
      const min = cardWidth * 0.5;
      const max = cardWidth * (coreSectionStart * 2) - cardWidth * 0.5;

      if (slider.scrollLeft <= min) {
        slider.scrollLeft += cardWidth * featuredItems.length;
      } else if (slider.scrollLeft >= max) {
        slider.scrollLeft -= cardWidth * featuredItems.length;
      }
    };

    const onScroll = () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(normalizePosition, 80);
    };

    slider.addEventListener("scroll", onScroll);
    return () => {
      slider.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [coreSectionStart]);

  const handlePrev = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = cardWidthRef.current || slider.clientWidth / visibleCards;
    slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const handleNext = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = cardWidthRef.current || slider.clientWidth / visibleCards;
    slider.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  return (
    <section className={styles.featuredSection}>
      <div className={styles.featuredHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Featured Properties</h2>
        </div>
        <a href="#" className={styles.viewAll}>View All →</a>
      </div>

      <div className={styles.sliderControls}>
        <button
          type="button"
          className={styles.sliderButton}
          onClick={handlePrev}
          aria-label="Show previous featured properties"
        >
          ←
        </button>
        <button
          type="button"
          className={styles.sliderButton}
          onClick={handleNext}
          aria-label="Show next featured properties"
        >
          →
        </button>
      </div>

      <div ref={sliderRef} className={styles.featuredGrid} suppressHydrationWarning>
        {loopItems.map((item, index) => (
          <PropertyCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}
