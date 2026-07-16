"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FeaturedProperties.module.css";

const featuredItems = [
  {
    title: "3 BHK Apartment",
    location: "Ahmedabad",
    price: "₹ 85 Lakh",
    size: "1240 Sq.Ft.",
    image: "/img/featured-properties/1.jpg",
  },
  {
    title: "2 BHK Apartment",
    location: "Surat",
    price: "₹ 65 Lakh",
    size: "980 Sq.Ft.",
    image: "/img/featured-properties/2.jpg",
  },
  {
    title: "4 BHK Villa",
    location: "Vadodara",
    price: "₹ 1.35 Cr",
    size: "2200 Sq.Ft.",
    image: "/img/featured-properties/3.jpg",
  },
  {
    title: "2 BHK Apartment",
    location: "Rajkot",
    price: "₹ 55 Lakh",
    size: "860 Sq.Ft.",
    image: "/img/featured-properties/4.jpg",
  },
  {
    title: "Premium Plot",
    location: "Gandhinagar",
    price: "₹ 1.1 Cr",
    size: "1750 Sq.Ft.",
    image: "/img/featured-properties/1.jpg",
  },
  {
    title: "Luxury Villa",
    location: "Vadodara",
    price: "₹ 2.2 Cr",
    size: "3200 Sq.Ft.",
    image: "/img/featured-properties/2.jpg",
  },
];

function PropertyCard({ item }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked((v) => !v);
  };

  return (
    <article className={styles.propertyCard}>
      <div
        className={styles.cardImage}
        style={{ backgroundImage: `url('${item.image}')` }}
      >
        <button
          className={liked ? `${styles.cardActionOverlay} ${styles.liked}` : styles.cardActionOverlay}
          aria-label={liked ? "Unlike property" : "Like property"}
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
          <span className={styles.cardPrice}>{item.price}</span>
          <span className={styles.cardSize}>{item.size}</span>
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
          <PropertyCard key={`${item.title}-${item.location}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}
