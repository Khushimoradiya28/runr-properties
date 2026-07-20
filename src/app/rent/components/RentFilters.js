"use client";

import { useState } from "react";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
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
          {/* City */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>City</label>
            <MultiSelectDropdown
              options={cityOptions}
              selected={filters.city || []}
              onChange={(val) => onFilterChange("city", val)}
              placeholder="All Cities"
            />
          </div>

          {/* Property Type */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Property Type</label>
            <MultiSelectDropdown
              options={typeOptions}
              selected={filters.type || []}
              onChange={(val) => onFilterChange("type", val)}
              placeholder="All Types"
            />
          </div>

          {/* BHK */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>BHK</label>
            <MultiSelectDropdown
              options={bhkOptions}
              selected={filters.bhk || []}
              onChange={(val) => onFilterChange("bhk", val)}
              placeholder="Any BHK"
            />
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
            <MultiSelectDropdown
              options={furnishingOptions}
              selected={filters.furnishing || []}
              onChange={(val) => onFilterChange("furnishing", val)}
              placeholder="Any"
            />
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
