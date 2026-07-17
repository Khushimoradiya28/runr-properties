"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PropertyFilters from "./components/PropertyFilters";
import PropertyGrid from "./components/PropertyGrid";
import styles from "./buy.module.css";

const allProperties = [
  {
    id: 1,
    title: "3 BHK Luxury Apartment",
    location: "Satellite, Ahmedabad",
    city: "ahmedabad",
    type: "apartment",
    bhk: 3,
    price: 8500000,
    area: 1450,
    furnishing: "semi-furnished",
    postedBy: "builder",
    postedDate: "2025-07-10",
    image: "/img/buy-properties/1.jpg",
    amenities: ["Parking", "Gym", "Swimming Pool"],
  },
  {
    id: 2,
    title: "2 BHK Modern Flat",
    location: "Vesu, Surat",
    city: "surat",
    type: "apartment",
    bhk: 2,
    price: 5500000,
    area: 980,
    furnishing: "furnished",
    postedBy: "owner",
    postedDate: "2025-07-08",
    image: "/img/buy-properties/2.jpg",
    amenities: ["Parking", "Garden"],
  },
  {
    id: 3,
    title: "4 BHK Premium Villa",
    location: "Gotri, Vadodara",
    city: "vadodara",
    type: "villa",
    bhk: 4,
    price: 18500000,
    area: 2800,
    furnishing: "furnished",
    postedBy: "builder",
    postedDate: "2025-07-05",
    image: "/img/buy-properties/3.jpg",
    amenities: ["Parking", "Garden", "Swimming Pool", "Gym"],
  },
  {
    id: 4,
    title: "2 BHK Apartment",
    location: "Kalawad Road, Rajkot",
    city: "rajkot",
    type: "apartment",
    bhk: 2,
    price: 4200000,
    area: 860,
    furnishing: "unfurnished",
    postedBy: "agent",
    postedDate: "2025-07-12",
    image: "/img/buy-properties/4.jpg",
    amenities: ["Parking"],
  },
  {
    id: 5,
    title: "Premium Residential Plot",
    location: "Kudasan, Gandhinagar",
    city: "gandhinagar",
    type: "plot",
    bhk: 0,
    price: 11000000,
    area: 2000,
    furnishing: "unfurnished",
    postedBy: "owner",
    postedDate: "2025-07-01",
    image: "/img/buy-properties/5.jpg",
    amenities: [],
  },
  {
    id: 6,
    title: "3 BHK Penthouse",
    location: "SG Highway, Ahmedabad",
    city: "ahmedabad",
    type: "apartment",
    bhk: 3,
    price: 14500000,
    area: 2100,
    furnishing: "furnished",
    postedBy: "builder",
    postedDate: "2025-06-28",
    image: "/img/buy-properties/6.jpg",
    amenities: ["Parking", "Gym", "Swimming Pool", "Club House"],
  },
  {
    id: 7,
    title: "1 BHK Starter Home",
    location: "Pal, Surat",
    city: "surat",
    type: "apartment",
    bhk: 1,
    price: 2800000,
    area: 550,
    furnishing: "semi-furnished",
    postedBy: "owner",
    postedDate: "2025-07-14",
    image: "/img/buy-properties/7.jpg",
    amenities: ["Parking"],
  },
  {
    id: 8,
    title: "Commercial Shop Space",
    location: "CG Road, Ahmedabad",
    city: "ahmedabad",
    type: "commercial",
    bhk: 0,
    price: 9500000,
    area: 600,
    furnishing: "unfurnished",
    postedBy: "agent",
    postedDate: "2025-07-09",
    image: "/img/buy-properties/8.jpg",
    amenities: ["Parking", "Lift"],
  },
  {
    id: 9,
    title: "4 BHK Independent House",
    location: "Manjalpur, Vadodara",
    city: "vadodara",
    type: "villa",
    bhk: 4,
    price: 12000000,
    area: 2400,
    furnishing: "semi-furnished",
    postedBy: "owner",
    postedDate: "2025-07-03",
    image: "/img/buy-properties/9.jpg",
    amenities: ["Parking", "Garden"],
  },
  {
    id: 10,
    title: "3 BHK Smart Home",
    location: "Adajan, Surat",
    city: "surat",
    type: "apartment",
    bhk: 3,
    price: 7200000,
    area: 1350,
    furnishing: "furnished",
    postedBy: "builder",
    postedDate: "2025-07-11",
    image: "/img/buy-properties/10.jpg",
    amenities: ["Parking", "Gym", "Garden"],
  },
  {
    id: 11,
    title: "Luxury Villa with Pool",
    location: "Bopal, Ahmedabad",
    city: "ahmedabad",
    type: "villa",
    bhk: 5,
    price: 32000000,
    area: 4500,
    furnishing: "furnished",
    postedBy: "builder",
    postedDate: "2025-06-25",
    image: "/img/buy-properties/1.jpg",
    amenities: ["Parking", "Swimming Pool", "Garden", "Club House", "Gym"],
  },
  {
    id: 12,
    title: "2 BHK Budget Flat",
    location: "Naroda, Ahmedabad",
    city: "ahmedabad",
    type: "apartment",
    bhk: 2,
    price: 3200000,
    area: 780,
    furnishing: "unfurnished",
    postedBy: "agent",
    postedDate: "2025-07-15",
    image: "/img/buy-properties/2.jpg",
    amenities: ["Parking"],
  },
];

const ITEMS_PER_PAGE = 6;

export default function BuyPage() {
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    bhk: "",
    budgetMin: "",
    budgetMax: "",
    areaMin: "",
    areaMax: "",
    furnishing: "",
    postedBy: "",
  });

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties = useMemo(() => {
    let results = [...allProperties];

    if (filters.city) {
      results = results.filter((p) => p.city === filters.city);
    }
    if (filters.type) {
      results = results.filter((p) => p.type === filters.type);
    }
    if (filters.bhk) {
      const bhkVal = parseInt(filters.bhk);
      if (bhkVal === 5) {
        results = results.filter((p) => p.bhk >= 5);
      } else {
        results = results.filter((p) => p.bhk === bhkVal);
      }
    }
    if (filters.budgetMin) {
      results = results.filter((p) => p.price >= parseInt(filters.budgetMin));
    }
    if (filters.budgetMax) {
      results = results.filter((p) => p.price <= parseInt(filters.budgetMax));
    }
    if (filters.areaMin) {
      results = results.filter((p) => p.area >= parseInt(filters.areaMin));
    }
    if (filters.areaMax) {
      results = results.filter((p) => p.area <= parseInt(filters.areaMax));
    }
    if (filters.furnishing) {
      results = results.filter((p) => p.furnishing === filters.furnishing);
    }
    if (filters.postedBy) {
      results = results.filter((p) => p.postedBy === filters.postedBy);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case "area":
        results.sort((a, b) => b.area - a.area);
        break;
      default:
        break;
    }

    return results;
  }, [filters, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      city: "",
      type: "",
      bhk: "",
      budgetMin: "",
      budgetMax: "",
      areaMin: "",
      areaMax: "",
      furnishing: "",
      postedBy: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className={styles.buyPage}>
      <Header />

      <main className={styles.mainContent}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumb}>
            <a href="/" className={styles.breadcrumbLink}>Home</a>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Buy Properties</span>
          </div>
          <div className={styles.pageHeaderInner}>
            <div>
              <h1 className={styles.pageTitle}>Buy Properties</h1>
              <p className={styles.pageSubtitle}>
                Discover {filteredProperties.length} verified properties for sale across top cities
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentLayout}>
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredProperties.length}
          />

          <PropertyGrid
            properties={paginatedProperties}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalResults={filteredProperties.length}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
