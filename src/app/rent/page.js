"use client";

import { useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RentFilters from "./components/RentFilters";
import RentGrid from "./components/RentGrid";
import styles from "./rent.module.css";

const allRentals = [
  {
    id: 201,
    title: "3 BHK Furnished Apartment",
    location: "Satellite, Ahmedabad",
    city: "ahmedabad",
    type: "apartment",
    bhk: 3,
    rent: 35000,
    deposit: 100000,
    area: 1450,
    furnishing: "furnished",
    postedBy: "owner",
    postedDate: "2025-07-12",
    availableFrom: "2025-08-01",
    image: "/img/rent/1.jpg",
    amenities: ["Parking", "Gym", "Swimming Pool", "AC"],
  },
  {
    id: 202,
    title: "2 BHK Semi-Furnished Flat",
    location: "Vesu, Surat",
    city: "surat",
    type: "apartment",
    bhk: 2,
    rent: 18000,
    deposit: 50000,
    area: 950,
    furnishing: "semi-furnished",
    postedBy: "agent",
    postedDate: "2025-07-10",
    availableFrom: "2025-07-20",
    image: "/img/rent/2.jpg",
    amenities: ["Parking", "Lift"],
  },
  {
    id: 203,
    title: "4 BHK Luxury Villa",
    location: "Gotri, Vadodara",
    city: "vadodara",
    type: "villa",
    bhk: 4,
    rent: 65000,
    deposit: 200000,
    area: 2800,
    furnishing: "furnished",
    postedBy: "owner",
    postedDate: "2025-07-08",
    availableFrom: "2025-08-15",
    image: "/img/rent/3.jpg",
    amenities: ["Parking", "Garden", "Swimming Pool", "Gym"],
  },
  {
    id: 204,
    title: "1 BHK Studio Apartment",
    location: "Kalawad Road, Rajkot",
    city: "rajkot",
    type: "apartment",
    bhk: 1,
    rent: 9000,
    deposit: 25000,
    area: 500,
    furnishing: "furnished",
    postedBy: "owner",
    postedDate: "2025-07-14",
    availableFrom: "2025-07-25",
    image: "/img/rent/4.jpg",
    amenities: ["Parking", "AC"],
  },
  {
    id: 205,
    title: "3 BHK Apartment Near Metro",
    location: "SG Highway, Ahmedabad",
    city: "ahmedabad",
    type: "apartment",
    bhk: 3,
    rent: 28000,
    deposit: 80000,
    area: 1350,
    furnishing: "semi-furnished",
    postedBy: "builder",
    postedDate: "2025-07-05",
    availableFrom: "2025-08-01",
    image: "/img/rent/5.jpg",
    amenities: ["Parking", "Gym", "Club House"],
  },
  {
    id: 206,
    title: "2 BHK Independent House",
    location: "Manjalpur, Vadodara",
    city: "vadodara",
    type: "villa",
    bhk: 2,
    rent: 15000,
    deposit: 40000,
    area: 1100,
    furnishing: "unfurnished",
    postedBy: "owner",
    postedDate: "2025-07-11",
    availableFrom: "2025-07-30",
    image: "/img/rent/6.jpg",
    amenities: ["Parking", "Garden"],
  },
  {
    id: 207,
    title: "Commercial Office Space",
    location: "CG Road, Ahmedabad",
    city: "ahmedabad",
    type: "commercial",
    bhk: 0,
    rent: 45000,
    deposit: 150000,
    area: 800,
    furnishing: "unfurnished",
    postedBy: "agent",
    postedDate: "2025-07-09",
    availableFrom: "2025-08-10",
    image: "/img/rent/7.jpg",
    amenities: ["Parking", "Lift", "AC"],
  },
  {
    id: 208,
    title: "3 BHK Premium Penthouse",
    location: "Adajan, Surat",
    city: "surat",
    type: "apartment",
    bhk: 3,
    rent: 42000,
    deposit: 120000,
    area: 1800,
    furnishing: "furnished",
    postedBy: "builder",
    postedDate: "2025-07-06",
    availableFrom: "2025-08-05",
    image: "/img/rent/8.jpg",
    amenities: ["Parking", "Gym", "Swimming Pool", "Garden"],
  },
  {
    id: 209,
    title: "1 BHK Budget Flat",
    location: "Naroda, Ahmedabad",
    city: "ahmedabad",
    type: "apartment",
    bhk: 1,
    rent: 7500,
    deposit: 20000,
    area: 450,
    furnishing: "unfurnished",
    postedBy: "agent",
    postedDate: "2025-07-15",
    availableFrom: "2025-07-20",
    image: "/img/rent/9.jpg",
    amenities: ["Parking"],
  },
  {
    id: 210,
    title: "4 BHK Bungalow with Garden",
    location: "Kudasan, Gandhinagar",
    city: "gandhinagar",
    type: "villa",
    bhk: 4,
    rent: 55000,
    deposit: 180000,
    area: 3200,
    furnishing: "semi-furnished",
    postedBy: "owner",
    postedDate: "2025-07-03",
    availableFrom: "2025-08-01",
    image: "/img/rent/10.jpg",
    amenities: ["Parking", "Garden", "Gym"],
  },
];

const ITEMS_PER_PAGE = 6;

export default function RentPage() {
  const [filters, setFilters] = useState({
    city: [],
    type: [],
    bhk: [],
    rentMin: "",
    rentMax: "",
    furnishing: [],
    postedBy: "",
    availableFrom: "",
  });

  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties = useMemo(() => {
    let results = [...allRentals];

    if (filters.city.length > 0) {
      results = results.filter((p) => filters.city.includes(p.city));
    }
    if (filters.type.length > 0) {
      results = results.filter((p) => filters.type.includes(p.type));
    }
    if (filters.bhk.length > 0) {
      results = results.filter((p) => filters.bhk.includes(String(p.bhk)));
    }
    if (filters.rentMin) {
      results = results.filter((p) => p.rent >= parseInt(filters.rentMin));
    }
    if (filters.rentMax) {
      results = results.filter((p) => p.rent <= parseInt(filters.rentMax));
    }
    if (filters.furnishing.length > 0) {
      results = results.filter((p) => filters.furnishing.includes(p.furnishing));
    }
    if (filters.postedBy) {
      results = results.filter((p) => p.postedBy === filters.postedBy);
    }
    if (filters.availableFrom) {
      results = results.filter((p) => p.availableFrom <= filters.availableFrom);
    }

    switch (sortBy) {
      case "rent-low":
        results.sort((a, b) => a.rent - b.rent);
        break;
      case "rent-high":
        results.sort((a, b) => b.rent - a.rent);
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
      city: [],
      type: [],
      bhk: [],
      rentMin: "",
      rentMax: "",
      furnishing: [],
      postedBy: "",
      availableFrom: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className={styles.rentPage}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumb}>
            <a href="/" className={styles.breadcrumbLink}>Home</a>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Rent Properties</span>
          </div>
          <div className={styles.pageHeaderInner}>
            <div>
              <h1 className={styles.pageTitle}>Rent Properties</h1>
              <p className={styles.pageSubtitle}>
                Explore {filteredProperties.length} verified rental properties across top cities
              </p>
            </div>
          </div>
        </div>

        <div className={styles.contentLayout}>
          <RentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredProperties.length}
          />

          <RentGrid
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
