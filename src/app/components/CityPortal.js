import Link from "next/link";
import styles from "./CityPortal.module.css";

const cities = [
  { slug: "ahmedabad", name: "Ahmedabad", label: "Ahmedabad", image: "/img/cities-icon/1.png" },
  { slug: "surat", name: "Surat", label: "Surat", image: "/img/cities-icon/2.png" },
  { slug: "vadodara", name: "Vadodara", label: "Vadodara", image: "/img/cities-icon/3.png" },
  { slug: "rajkot", name: "Rajkot", label: "Rajkot", image: "/img/cities-icon/4.png" },
  { slug: "gandhinagar", name: "Gandhinagar", label: "Gandhinagar", image: "/img/cities-icon/5.png" },
  { slug: "bhavnagar", name: "Bhavnagar", label: "Bhavnagar", image: "/img/cities-icon/6.png" },
];

export default function CityPortal() {
  return (
    <section className={styles.citySection}>
      <div className={styles.cityHeader}>
        <div className={styles.sectionTitle}>
          <h2>Explore Properties in Top Cities</h2>
          <h4 className={styles.titleTagline}>Find listings by city, across Gujarat</h4>
        </div>
      </div>

      <div className={styles.cityGrid}>
        {cities.map((city) => (
          <Link key={city.slug} href={`/city/${city.slug}`} className={styles.cityCard}>
            <div className={styles.cityIcon} aria-hidden="true">
              <img src={city.image} alt={city.name} className={styles.cityImage} />
            </div>
            <div className={styles.cityInfo}>
              <span className={styles.cityName}>{city.name}</span>
              <span className={styles.cityLabel}>{city.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
