"use client";

import { useState } from "react";
import styles from "./RentFilters.module.css";

const cityOptions = [
  { value: "ahmedabad", label: "Ahmedabad" },
  { value: "surat", label: "Surat" },
  { value: "vadodara", label: "Vadodara" },
  { value: "rajkot", label: "Rajkot" },
  { value: "gandhinagar", label: "Gandhinagar" },
  { value: "bhavnagar", label: "Bhavnagar" },
];

const typeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa / House" },
  { value: "commercial", label: "Commercial" },
];

const bhkOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK" },
  { value: "5", label: "5+ BHK" },
];

const rentOptions = [
  { value: "5000", label: "₹ 5,000" },
  { value: "10000", label: "₹ 10,000" },
  { value: "15000", label: "₹ 15,000" },
  { value: "25000", label: "₹ 25,000" },
  { value: "35000", label: "₹ 35,000" },
  { value: "50000", label: "₹ 50,000" },
  { value: "75000", label: "₹ 75,000" },
  { value: "100000", label: "₹ 1,00,000" },
];

const furnishingOptions = [
  { value: "", label: "Any" },
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

const postedByOptions = [
  { value: "", label: "Anyone" },
  { value: "owner", label: "Owner" },
  { value: "agent", label: "Agent" },
  { value: "builder", label: "Builder" },
];

export default function RentFilters({ filters, onFilterChange, onClearFilters, resultCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasActiveFilters = Object.values(filters).some((v) => Array.isArray(v) ? v.length > 0 : v !== "");

  const toggleMulti = (key, value) => {
    const current = filters[key] || [];
    if (current.includes(value)) {
      onFilterChange(key, current.filter((v) => v !== value));
    } else {
      onFilterChange(key, [...current, value]);
    }
  };

  return (
    <>
      <button className={styles.mobileFilterBtn} onClick={() => setMobileOpen(true)} aria-label="Open filters">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 4h18M7 9h10M10 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Filters
        {hasActiveFilters && <span className={styles.filterBadge} />}
      </button>

      {mobileOpen && <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} aria-hidden="true" />}

      <aside className={`${styles.filterSidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.filterHeader}>
          <div className={styles.filterHeaderLeft}>
            <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 4h18M7 9h10M10 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <h3 className={styles.filterTitle}>Filters</h3>
          </div>
          <div className={styles.filterHeaderRight}>
            {hasActiveFilters && <button className={styles.clearBtn} onClick={onClearFilters}>Clear All</button>}
            <button className={styles.mobileCloseBtn} onClick={() => setMobileOpen(false)} aria-label="Close filters">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.filterBody}>
          {/* City - Multi Select */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>City (select multiple)</label>
            <div className={styles.chipGroup}>
              {cityOptions.map((opt) => (
                <button key={opt.value} type="button" className={`${styles.chip} ${(filters.city || []).includes(opt.value) ? styles.chipActive : ""}`} onClick={() => toggleMulti("city", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type - Multi Select */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Property Type (select multiple)</label>
            <div className={styles.chipGroup}>
              {typeOptions.map((opt) => (
                <button key={opt.value} type="button" className={`${styles.chip} ${(filters.type || []).includes(opt.value) ? styles.chipActive : ""}`} onClick={() => toggleMulti("type", opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* BHK */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>BHK</label>
            <div className={styles.chipGroup}>
              {bhkOptions.map((opt) => (
                <button key={opt.value} type="button" className={`${styles.chip} ${filters.bhk === opt.value ? styles.chipActive : ""}`} onClick={() => onFilterChange("bhk", filters.bhk === opt.value ? "" : opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Rent */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Monthly Rent</label>
            <div className={styles.rangeRow}>
              <select className={styles.filterSelect} value={filters.rentMin} onChange={(e) => onFilterChange("rentMin", e.target.value)}>
                <option value="">Min</option>
                {rentOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <span className={styles.rangeSep}>to</span>
              <select className={styles.filterSelect} value={filters.rentMax} onChange={(e) => onFilterChange("rentMax", e.target.value)}>
                <option value="">Max</option>
                {rentOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Furnishing */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Furnishing</label>
            <select className={styles.filterSelect} value={filters.furnishing} onChange={(e) => onFilterChange("furnishing", e.target.value)}>
              {furnishingOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Posted By */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Posted By</label>
            <div className={styles.chipGroup}>
              {postedByOptions.map((opt) => (
                <button key={opt.value} type="button" className={`${styles.chip} ${filters.postedBy === opt.value ? styles.chipActive : ""}`} onClick={() => onFilterChange("postedBy", filters.postedBy === opt.value ? "" : opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Available From */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Available From</label>
            <input type="date" className={styles.filterInput} value={filters.availableFrom} onChange={(e) => onFilterChange("availableFrom", e.target.value)} />
          </div>
        </div>

        <div className={styles.mobileApplyBar}>
          <span className={styles.mobileResultCount}>{resultCount} Properties Found</span>
          <button className={styles.applyBtn} onClick={() => setMobileOpen(false)}>View Results</button>
        </div>
      </aside>
    </>
  );
}
