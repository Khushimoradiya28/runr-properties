/**
 * ═══════════════════════════════════════════════════════════════
 * RUNR PROPERTIES - API SERVICE LAYER
 * ═══════════════════════════════════════════════════════════════
 * 
 * This file is the SINGLE source of truth for all API calls.
 * UI components should NEVER call fetch() directly or access localStorage.
 * They should only use AuthContext methods which internally call these functions.
 * 
 * WHEN BACKEND IS READY:
 * - Replace each function body with real fetch() calls
 * - Keep function signatures (params + return types) exactly the same
 * - The rest of the frontend will work without modification
 * 
 * BASE URL: Set NEXT_PUBLIC_API_URL in .env.local
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Token Management (only place localStorage is used) ─────
function saveToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("runr_token", token);
  }
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("runr_token");
}

function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("runr_token");
  }
}

function getHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ═══════════════════════════════════════════════════════════════
// AUTH APIs
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/auth/signup
 * @param {{ name: string, email: string, mobile: string, password: string, role: 'buyer'|'owner' }}
 * @returns {{ success: boolean, message: string, user?: object, token?: string }}
 */
export async function signupUser({ name, email, mobile, password, role }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/auth/signup`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ name, email, mobile, password, role }),
  // });
  // const data = await res.json();
  // if (data.success) saveToken(data.token);
  // return data;

  // MOCK Implementation
  const users = JSON.parse(localStorage.getItem("runr_users") || "[]");
  if (users.find((u) => u.email === email)) {
    return { success: false, message: "Email already registered" };
  }

  const newUser = { id: Date.now().toString(), name, email, mobile, role, createdAt: new Date().toISOString() };
  users.push({ ...newUser, password });
  localStorage.setItem("runr_users", JSON.stringify(users));

  const token = btoa(JSON.stringify({ id: newUser.id, email, role }));
  saveToken(token);
  return { success: true, message: "Account created successfully", user: newUser, token };
}

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }}
 * @returns {{ success: boolean, message: string, user?: object, token?: string }}
 */
export async function loginUser({ email, password }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email, password }),
  // });
  // const data = await res.json();
  // if (data.success) saveToken(data.token);
  // return data;

  // MOCK
  const users = JSON.parse(localStorage.getItem("runr_users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return { success: false, message: "Invalid email or password" };

  const { password: _, ...userData } = user;
  const token = btoa(JSON.stringify({ id: userData.id, email: userData.email, role: userData.role }));
  saveToken(token);
  return { success: true, message: "Login successful", user: userData, token };
}

/**
 * Logout - clear token
 */
export function logoutUser() {
  removeToken();
}

/**
 * GET /api/auth/me
 * Uses stored token to fetch current user
 * @returns {{ success: boolean, user?: object }}
 */
export async function getCurrentUser() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
  // if (!res.ok) return { success: false, user: null };
  // const data = await res.json();
  // return data;

  // MOCK
  const token = getToken();
  if (!token) return { success: false, user: null };

  try {
    const decoded = JSON.parse(atob(token));
    const users = JSON.parse(localStorage.getItem("runr_users") || "[]");
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return { success: false, user: null };
    const { password: _, ...userData } = user;
    return { success: true, user: userData };
  } catch {
    return { success: false, user: null };
  }
}

/**
 * PUT /api/auth/profile
 * @param {{ name: string, mobile: string }}
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function updateProfile({ name, mobile }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/auth/profile`, {
  //   method: "PUT",
  //   headers: getHeaders(),
  //   body: JSON.stringify({ name, mobile }),
  // });
  // return await res.json();

  // MOCK
  const token = getToken();
  if (!token) return { success: false, message: "Not authenticated" };

  const decoded = JSON.parse(atob(token));
  const users = JSON.parse(localStorage.getItem("runr_users") || "[]");
  const idx = users.findIndex((u) => u.id === decoded.id);
  if (idx === -1) return { success: false, message: "User not found" };

  users[idx] = { ...users[idx], name, mobile };
  localStorage.setItem("runr_users", JSON.stringify(users));
  const { password: _, ...userData } = users[idx];
  return { success: true, message: "Profile updated", user: userData };
}

/**
 * PUT /api/auth/change-password
 * @param {{ currentPassword: string, newPassword: string }}
 * @returns {{ success: boolean, message: string }}
 */
export async function changePassword({ currentPassword, newPassword }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/auth/change-password`, {
  //   method: "PUT",
  //   headers: getHeaders(),
  //   body: JSON.stringify({ currentPassword, newPassword }),
  // });
  // return await res.json();

  // MOCK
  const token = getToken();
  if (!token) return { success: false, message: "Not authenticated" };

  const decoded = JSON.parse(atob(token));
  const users = JSON.parse(localStorage.getItem("runr_users") || "[]");
  const idx = users.findIndex((u) => u.id === decoded.id);
  if (idx === -1) return { success: false, message: "User not found" };
  if (users[idx].password !== currentPassword) return { success: false, message: "Current password is incorrect" };

  users[idx].password = newPassword;
  localStorage.setItem("runr_users", JSON.stringify(users));
  return { success: true, message: "Password changed successfully" };
}

/**
 * POST /api/auth/forgot-password
 * Sends reset link to email
 * @param {{ email: string }}
 * @returns {{ success: boolean, message: string }}
 */
export async function forgotPassword({ email }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/auth/forgot-password`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email }),
  // });
  // return await res.json();

  // MOCK
  const users = JSON.parse(localStorage.getItem("runr_users") || "[]");
  if (!users.find((u) => u.email === email)) {
    return { success: false, message: "No account found with this email" };
  }
  return { success: true, message: "Password reset link sent to your email" };
}

/**
 * POST /api/auth/reset-password
 * Resets password using token from email link
 * @param {{ token: string, newPassword: string }}
 * @returns {{ success: boolean, message: string }}
 */
export async function resetPassword({ token, newPassword }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/auth/reset-password`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ token, newPassword }),
  // });
  // return await res.json();

  // MOCK - In real app, token would be validated by backend
  return { success: true, message: "Password reset successful. You can now login with your new password." };
}

// ═══════════════════════════════════════════════════════════════
// WISHLIST APIs
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/wishlist
 * @returns {{ success: boolean, wishlist: array }}
 */
export async function getWishlist() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/wishlist`, { headers: getHeaders() });
  // return await res.json();

  // MOCK
  const data = localStorage.getItem("runr_wishlist");
  return { success: true, wishlist: data ? JSON.parse(data) : [] };
}

/**
 * POST /api/wishlist
 * @param {{ property: object }}
 * @returns {{ success: boolean, message: string }}
 */
export async function addToWishlistAPI(property) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/wishlist`, {
  //   method: "POST",
  //   headers: getHeaders(),
  //   body: JSON.stringify({ propertyId: property.id }),
  // });
  // return await res.json();

  // MOCK
  const wishlist = JSON.parse(localStorage.getItem("runr_wishlist") || "[]");
  if (!wishlist.find((p) => p.id === property.id)) {
    wishlist.push(property);
    localStorage.setItem("runr_wishlist", JSON.stringify(wishlist));
  }
  return { success: true, message: "Added to wishlist" };
}

/**
 * DELETE /api/wishlist/:propertyId
 * @param {string} propertyId
 * @returns {{ success: boolean, message: string }}
 */
export async function removeFromWishlistAPI(propertyId) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/wishlist/${propertyId}`, {
  //   method: "DELETE",
  //   headers: getHeaders(),
  // });
  // return await res.json();

  // MOCK
  const wishlist = JSON.parse(localStorage.getItem("runr_wishlist") || "[]");
  const filtered = wishlist.filter((p) => p.id !== propertyId);
  localStorage.setItem("runr_wishlist", JSON.stringify(filtered));
  return { success: true, message: "Removed from wishlist" };
}

/**
 * DELETE /api/wishlist (clear all)
 * @returns {{ success: boolean, message: string }}
 */
export async function clearWishlistAPI() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/wishlist`, {
  //   method: "DELETE",
  //   headers: getHeaders(),
  // });
  // return await res.json();

  // MOCK
  localStorage.setItem("runr_wishlist", "[]");
  return { success: true, message: "Wishlist cleared" };
}

// ═══════════════════════════════════════════════════════════════
// PROPERTY APIs (for Owner)
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/properties/my
 * Get owner's own properties
 * @returns {{ success: boolean, properties: array }}
 */
export async function getMyProperties() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/properties/my`, { headers: getHeaders() });
  // return await res.json();

  // MOCK
  const token = getToken();
  if (!token) return { success: false, properties: [] };
  const decoded = JSON.parse(atob(token));
  const allProps = JSON.parse(localStorage.getItem("runr_my_properties") || "[]");
  return { success: true, properties: allProps.filter((p) => p.ownerId === decoded.id) };
}

/**
 * POST /api/properties
 * Owner adds a new property
 * @param {object} propertyData
 * @returns {{ success: boolean, message: string, property?: object }}
 */
export async function addProperty(propertyData) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/properties`, {
  //   method: "POST",
  //   headers: getHeaders(),
  //   body: JSON.stringify(propertyData),
  // });
  // return await res.json();

  // MOCK
  const token = getToken();
  if (!token) return { success: false, message: "Not authenticated" };
  const decoded = JSON.parse(atob(token));
  if (decoded.role !== "owner") return { success: false, message: "Only owners can add properties" };

  const newProp = { ...propertyData, id: Date.now().toString(), ownerId: decoded.id, createdAt: new Date().toISOString() };
  const allProps = JSON.parse(localStorage.getItem("runr_my_properties") || "[]");
  allProps.push(newProp);
  localStorage.setItem("runr_my_properties", JSON.stringify(allProps));
  return { success: true, message: "Property added successfully", property: newProp };
}

/**
 * PUT /api/properties/:id
 * Owner edits own property
 * @param {string} propertyId
 * @param {object} updates
 * @returns {{ success: boolean, message: string, property?: object }}
 */
export async function updateProperty(propertyId, updates) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/properties/${propertyId}`, {
  //   method: "PUT",
  //   headers: getHeaders(),
  //   body: JSON.stringify(updates),
  // });
  // return await res.json();

  // MOCK
  const allProps = JSON.parse(localStorage.getItem("runr_my_properties") || "[]");
  const idx = allProps.findIndex((p) => p.id === propertyId);
  if (idx === -1) return { success: false, message: "Property not found" };
  allProps[idx] = { ...allProps[idx], ...updates };
  localStorage.setItem("runr_my_properties", JSON.stringify(allProps));
  return { success: true, message: "Property updated", property: allProps[idx] };
}

/**
 * DELETE /api/properties/:id
 * Owner deletes own property
 * @param {string} propertyId
 * @returns {{ success: boolean, message: string }}
 */
export async function deleteProperty(propertyId) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/properties/${propertyId}`, {
  //   method: "DELETE",
  //   headers: getHeaders(),
  // });
  // return await res.json();

  // MOCK
  const allProps = JSON.parse(localStorage.getItem("runr_my_properties") || "[]");
  const filtered = allProps.filter((p) => p.id !== propertyId);
  localStorage.setItem("runr_my_properties", JSON.stringify(filtered));
  return { success: true, message: "Property deleted" };
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC PROPERTY APIs (for listing pages)
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/properties?type=buy&city=...&bhk=...
 * Public property search
 * @param {object} filters
 * @returns {{ success: boolean, properties: array, total: number }}
 */
export async function searchProperties(filters = {}) {
  // TODO: Replace with real API call
  // const params = new URLSearchParams(filters);
  // const res = await fetch(`${API_BASE}/properties?${params}`);
  // return await res.json();

  // MOCK - returns empty (actual data is hardcoded in page.js for now)
  return { success: true, properties: [], total: 0 };
}

/**
 * GET /api/properties/:id
 * Single property detail
 * @param {string} propertyId
 * @returns {{ success: boolean, property?: object }}
 */
export async function getPropertyById(propertyId) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/properties/${propertyId}`);
  // return await res.json();

  // MOCK
  return { success: false, property: null };
}


// ═══════════════════════════════════════════════════════════════
// HOME PAGE / PUBLIC DATA APIs
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/home
 * Fetches home page data (banner, featured, cities, blogs)
 * @returns {{ success: boolean, banner: object, featured: array, cities: array, blogs: array }}
 */
export async function getHomeData() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/home`);
  // return await res.json();

  // MOCK
  return { success: true, banner: null, featured: [], cities: [], blogs: [] };
}

/**
 * GET /api/properties/featured
 * @returns {{ success: boolean, properties: array }}
 */
export async function getFeaturedProperties() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/properties/featured`);
  // return await res.json();

  // MOCK
  return { success: true, properties: [] };
}

/**
 * GET /api/cities
 * @returns {{ success: boolean, cities: array }}
 */
export async function getCities() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/cities`);
  // return await res.json();

  // MOCK
  return { success: true, cities: [] };
}

/**
 * GET /api/filters
 * Returns available filter options (cities, types, bhk options, etc.)
 * @returns {{ success: boolean, cities: array, types: array, bhkOptions: array, furnishingOptions: array }}
 */
export async function getFilterOptions() {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/filters`);
  // return await res.json();

  // MOCK
  return {
    success: true,
    cities: [],
    types: [],
    bhkOptions: [],
    furnishingOptions: [],
  };
}

// ═══════════════════════════════════════════════════════════════
// CONTACT / INQUIRY APIs
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/contact/owner
 * Send inquiry to property owner
 * @param {{ propertyId: string, name: string, email: string, phone: string, message: string }}
 * @returns {{ success: boolean, message: string }}
 */
export async function contactOwner({ propertyId, name, email, phone, message }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/contact/owner`, {
  //   method: "POST",
  //   headers: getHeaders(),
  //   body: JSON.stringify({ propertyId, name, email, phone, message }),
  // });
  // return await res.json();

  // MOCK
  return { success: true, message: "Your inquiry has been sent to the property owner" };
}

// ═══════════════════════════════════════════════════════════════
// REVIEWS APIs
// ═══════════════════════════════════════════════════════════════

/**
 * GET /api/reviews?propertyId=...
 * @param {string} propertyId
 * @returns {{ success: boolean, reviews: array }}
 */
export async function getReviews(propertyId) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/reviews?propertyId=${propertyId}`);
  // return await res.json();

  // MOCK
  return { success: true, reviews: [] };
}

/**
 * POST /api/reviews
 * @param {{ propertyId: string, rating: number, comment: string }}
 * @returns {{ success: boolean, message: string, review?: object }}
 */
export async function addReview({ propertyId, rating, comment }) {
  // TODO: Replace with real API call
  // const res = await fetch(`${API_BASE}/reviews`, {
  //   method: "POST",
  //   headers: getHeaders(),
  //   body: JSON.stringify({ propertyId, rating, comment }),
  // });
  // return await res.json();

  // MOCK
  return { success: true, message: "Review submitted successfully", review: { propertyId, rating, comment, createdAt: new Date().toISOString() } };
}
