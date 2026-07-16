import Link from "next/link";
import styles from "./city.module.css";

const cityDetails = {
  ahmedabad: {
    title: "Ahmedabad Properties",
    description: "Explore the best residential and premium listings in Ahmedabad.",
  },
  surat: {
    title: "Surat Properties",
    description: "Discover curated homes and investments in Surat.",
  },
  vadodara: {
    title: "Vadodara Properties",
    description: "Browse luxury apartments and family homes in Vadodara.",
  },
  rajkot: {
    title: "Rajkot Properties",
    description: "Find the finest properties available in Rajkot.",
  },
  gandhinagar: {
    title: "Gandhinagar Properties",
    description: "See premium plots and ready-to-move homes in Gandhinagar.",
  },
  bhavnagar: {
    title: "Bhavnagar Properties",
    description: "Explore curated options for homes and plots in Bhavnagar.",
  },
};

export default function CityPage({ params }) {
  const city = cityDetails[params.slug] || {
    title: "City Properties",
    description: "Browse featured city listings.",
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.breadcrumb}>
            <Link href="/" className={styles.link}>
              Home
            </Link>
            <span> / {params.slug}</span>
          </p>
          <h2>{city.title}</h2>
          <h4>{city.description}</h4>
        </div>
      </section>

      <section className={styles.listings}>
        <h2>Featured listings in {params.slug}</h2>
        <h4>These listings are handpicked for the best locations and amenities.</h4>
        <div className={styles.cardsGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.cardImg} />
              <div className={styles.cardBody}>
                <h3>{city.title} {index + 1}</h3>
                <p>Ready to move 2/3 BHK with premium amenities.</p>
                <span>₹ {65 + index * 15} Lakh</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
