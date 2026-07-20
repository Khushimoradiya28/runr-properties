"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useWishlist } from "../../context/WishlistContext";
import styles from "./city.module.css";

const cityInfo = {
  ahmedabad: { name: "Ahmedabad", description: "Explore premium residential and commercial listings in Ahmedabad." },
  surat: { name: "Surat", description: "Discover curated homes and investment opportunities in Surat." },
  vadodara: { name: "Vadodara", description: "Browse luxury apartments and family homes in Vadodara." },
  rajkot: { name: "Rajkot", description: "Find the finest properties available in Rajkot." },
  gandhinagar: { name: "Gandhinagar", description: "See premium plots and ready-to-move homes in Gandhinagar." },
  bhavnagar: { name: "Bhavnagar", description: "Explore curated options for homes and plots in Bhavnagar." },
};

const allProperties = [
  { id: 1, title: "3 BHK Luxury Apartment", location: "Satellite, Ahmedabad", city: "ahmedabad", type: "Apartment", bhk: 3, price: 8500000, area: 1450, image: "/img/buy-properties/1.jpg" },
  { id: 2, title: "2 BHK Modern Flat", location: "Vesu, Surat", city: "surat", type: "Apartment", bhk: 2, price: 5500000, area: 980, image: "/img/buy-properties/2.jpg" },
  { id: 3, title: "4 BHK Premium Villa", location: "Gotri, Vadodara", city: "vadodara", type: "Villa", bhk: 4, price: 18500000, area: 2800, image: "/img/buy-properties/3.jpg" },
  { id: 4, title: "2 BHK Apartment", location: "Kalawad Road, Rajkot", city: "rajkot", type: "Apartment", bhk: 2, price: 4200000, area: 860, image: "/img/buy-properties/4.jpg" },
  { id: 5, title: "Premium Residential Plot", location: "Kudasan, Gandhinagar", city: "gandhinagar", type: "Plot", bhk: 0, price: 11000000, area: 2000, image: "/img/buy-properties/5.jpg" },
  { id: 6, title: "3 BHK Penthouse", location: "SG Highway, Ahmedabad", city: "ahmedabad", type: "Apartment", bhk: 3, price: 14500000, area: 2100, image: "/img/buy-properties/6.jpg" },
  { id: 7, title: "1 BHK Starter Home", location: "Pal, Surat", city: "surat", type: "Apartment", bhk: 1, price: 2800000, area: 550, image: "/img/buy-properties/7.jpg" },
  { id: 8, title: "Commercial Shop", location: "CG Road, Ahmedabad", city: "ahmedabad", type: "Commercial", bhk: 0, price: 9500000, area: 600, image: "/img/buy-properties/8.jpg" },
  { id: 9, title: "4 BHK Independent House", location: "Manjalpur, Vadodara", city: "vadodara", type: "Villa", bhk: 4, price: 12000000, area: 2400, image: "/img/buy-properties/9.jpg" },
  { id: 10, title: "3 BHK Smart Home", location: "Adajan, Surat", city: "surat", type: "Apartment", bhk: 3, price: 7200000, area: 1350, image: "/img/buy-properties/10.jpg" },
  { id: 11, title: "Luxury Villa with Pool", location: "Bopal, Ahmedabad", city: "ahmedabad", type: "Villa", bhk: 5, price: 32000000, area: 4500, image: "/img/buy-properties/1.jpg" },
  { id: 12, title: "2 BHK Budget Flat", location: "Naroda, Ahmedabad", city: "ahmedabad", type: "Apartment", bhk: 2, price: 3200000, area: 780, image: "/img/buy-properties/2.jpg" },
  { id: 13, title: "3 BHK Near Railway", location: "Bhavnagar Road", city: "bhavnagar", type: "Apartment", bhk: 3, price: 4500000, area: 1100, image: "/img/buy-properties/3.jpg" },
  { id: 14, title: "2 BHK Sea View", location: "Ghogha Circle, Bhavnagar", city: "bhavnagar", type: "Apartment", bhk: 2, price: 3800000, area: 900, image: "/img/buy-properties/4.jpg" },
];

function formatPrice(price) {
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} Lakh`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

function PropertyCard({ property }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(property.id);

  return (
    <article className={styles.card}>
      <div className={styles.cardImageWrap}>
        <img src={property.image} alt={property.title} className={styles.cardImg} loading="lazy" />
        <span className={styles.badge}>{property.type}</span>
        <button className={`${styles.likeBtn} ${liked ? styles.liked : ""}`} onClick={() => toggleWishlist(property)} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={liked ? "#e0245e" : "transparent"} stroke={liked ? "none" : "#ffffff"} strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{property.title}</h3>
        <p className={styles.cardLocation}>{property.location}</p>
        <div className={styles.cardDetails}>
          {property.bhk > 0 && <span>{property.bhk} BHK</span>}
          <span>{property.area.toLocaleString("en-IN")} Sq.Ft.</span>
        </div>
        <p className={styles.cardPrice}>{formatPrice(property.price)}</p>
      </div>
    </article>
  );
}

export default function CityPage() {
  const params = useParams();
  const slug = params.slug;
  const city = cityInfo[slug] || { name: slug, description: "Browse properties in this city." };

  const cityProperties = useMemo(() => {
    return allProperties.filter((p) => p.city === slug);
  }, [slug]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>{city.name}</span>
          </div>
          <h1 className={styles.heroTitle}>Properties in {city.name}</h1>
          <p className={styles.heroText}>{city.description}</p>
          <span className={styles.resultCount}>{cityProperties.length} properties found</span>
        </section>

        {cityProperties.length > 0 ? (
          <div className={styles.cardsGrid}>
            {cityProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>No properties found in {city.name}</h3>
            <p>Check back soon for new listings.</p>
            <Link href="/buy" className={styles.browseCta}>Browse All Properties</Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
