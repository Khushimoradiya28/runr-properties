"use client";

import { useState } from "react";
import styles from "./HeroBanner.module.css";

const marketTabs = ["Buy", "Rent", "Commercial"];

export default function HeroBanner() {
  const [activeTab, setActiveTab] = useState("Buy");

  const handleSearch = (event) => {
    event.preventDefault();
  };

  return (
    <section className={styles.bannerSection}>
      <div className={styles.bannerInner}>
        <div className={styles.bannerTop}>
          <div className={styles.bannerCopy}>
            <h1 className={styles.bannerTitle}>
              Find Your Perfect Property,
              <span className={styles.bannerHighlight}> Your Way.</span>
            </h1>
            <p className={styles.bannerText}>
              Buy, Rent or Invest in verified properties across top cities.
            </p>
          </div>
        </div>

        <div className={styles.bannerBottom}>
          <div className={styles.searchShell}>
            <div className={styles.marketTabs} role="tablist" aria-label="Market tabs">
              {marketTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={activeTab === tab ? styles.tabActive : styles.tabLabel}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form className={styles.bannerSearchCard} onSubmit={handleSearch}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="hero-location">
                  Location
                </label>
                <div className={styles.inputWithIcon}>
                  <svg className={styles.fieldIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 21s-6.2-5.2-8.4-9.1A5.6 5.6 0 0 1 12 4.6a5.6 5.6 0 0 1 8.4 7.3C18.2 15.8 12 21 12 21Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                    />
                    <circle cx="12" cy="11.2" r="2.2" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  </svg>
                  <input
                    id="hero-location"
                    className={styles.fieldInput}
                    placeholder="Enter city or locality"
                    aria-label="Enter city or locality"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="hero-property-type">
                  Property Type
                </label>
                <div className={styles.inputWithIcon}>
                  <svg className={styles.fieldIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 10.5 12 5l8 5.5V19a1 1 0 0 1-1 1h-5v-5.5h-4V20H5a1 1 0 0 1-1-1v-8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className={styles.selectWrap}>
                    <select id="hero-property-type" className={styles.select} aria-label="Select property type">
                      <option value="">Select type</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Plot</option>
                      <option>Commercial</option>
                    </select>
                    <svg className={styles.selectIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="hero-budget">
                  Budget
                </label>
                <div className={styles.inputWithIcon}>
                  <span className={styles.rupeeIcon} aria-hidden="true">
                    ₹
                  </span>
                  <div className={styles.selectWrap}>
                    <select id="hero-budget" className={styles.select} aria-label="Select budget">
                      <option value="">Min - Max</option>
                      <option>₹ 25L - 50L</option>
                      <option>₹ 50L - 1Cr</option>
                      <option>₹ 1Cr - 2Cr</option>
                      <option>₹ 2Cr - 5Cr</option>
                      <option>₹ 5Cr+</option>
                    </select>
                    <svg className={styles.selectIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="hero-bhk">
                  BHK
                </label>
                <div className={styles.inputWithIcon}>
                  <svg className={styles.fieldIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M6 8h12v10H6z" stroke="currentColor" strokeWidth="1.6" fill="none" />
                    <path d="M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <div className={styles.selectWrap}>
                    <select id="hero-bhk" className={styles.select} aria-label="Select BHK">
                      <option value="">Any</option>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4 BHK</option>
                      <option>4+ BHK</option>
                    </select>
                    <svg className={styles.selectIcon} viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>

              <button className={styles.bannerCTA} type="submit">
                Search
              </button>
            </form>
          </div>

          <div className={styles.bannerStats}>
            <div className={styles.statItem}>
              <strong>12,480</strong>
              <span>Verified listings</span>
            </div>
            <div className={styles.statItem}>
              <strong>4.8/5</strong>
              <span>Customer rating</span>
            </div>
            <div className={styles.statItem}>
              <strong>24/7</strong>
              <span>Support availability</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
