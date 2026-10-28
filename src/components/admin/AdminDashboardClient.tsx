"use client";

import { CATEGORIES } from "@/lib/constants";
import { Modal } from "@/components/Modal";
import type { BriteSubcategory, CategoryId, CategoryItem, Product, Review, SellUnit } from "@/lib/types";
import {
  ArrowLeft,
  Check,
  CornerDownRight,
  Edit2,
  FolderPlus,
  Image as ImageIcon,
  Loader2,
  LogOut,
  MessageSquare,
  Package,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TAG_PRESETS = [
  { label: "None", value: "" },
  { label: "Special Offer (Top #1)", value: "Special Offer", color: "bg-amber-500 text-white" },
  { label: "Promoted (Top #2)", value: "Promoted", color: "bg-maroon text-white" },
  { label: "Best Seller", value: "Best Seller", color: "bg-emerald-600 text-white" },
  { label: "New Arrival", value: "New Arrival", color: "bg-sky-600 text-white" },
];

const UNIT_PRESETS = [
  { label: "per Box", value: "box" },
  { label: "per Dozen", value: "dozen" },
  { label: "per Piece / Unit", value: "piece" },
  { label: "per Pair", value: "pair" },
  { label: "per Set", value: "set" },
  { label: "per Packet", value: "packet" },
  { label: "Custom Unit...", value: "custom" },
];

export function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Categories state
  const [categories, setCategories] = useState<CategoryItem[]>(
    CATEGORIES as unknown as CategoryItem[]
  );
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatShort, setNewCatShort] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catError, setCatError] = useState("");
  const [catSuccess, setCatSuccess] = useState("");
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewSearch, setReviewSearch] = useState("");
  const [promotingReviewId, setPromotingReviewId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [submittingReply, setSubmittingReply] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("jewellery");
  const [subcategory, setSubcategory] = useState<BriteSubcategory>("kids");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<SellUnit>("box");
  const [customUnit, setCustomUnit] = useState("");
  const [unitsPerBox, setUnitsPerBox] = useState("");
  const [moq, setMoq] = useState("1");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("Special Offer");
  const [customTag, setCustomTag] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState<{
    name: string;
    category: CategoryId;
    subcategory: string;
    price: string;
    unit: SellUnit;
    customUnit: string;
    unitsPerBox: string;
    moq: string;
    badge: string;
    description: string;
  }>({
    name: "",
    category: "jewellery",
    subcategory: "kids",
    price: "",
    unit: "box",
    customUnit: "",
    unitsPerBox: "",
    moq: "1",
    badge: "",
    description: "",
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      window.location.reload();
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/admin/products?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch {
      setErrorMsg("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch {
      // Error fetching reviews
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch {}
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatSubmitting(true);
    setCatError("");
    setCatSuccess("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          short: newCatShort.trim() || undefined,
          description: newCatDesc.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }
      await fetchCategories();
      setCategory(data.category.id);
      setCatSuccess(`Created category: "${data.category.label}"`);
      setNewCatName("");
      setNewCatShort("");
      setNewCatDesc("");
    } catch (err: unknown) {
      setCatError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Are you sure you want to delete this custom category?")) return;
    setDeletingCatId(catId);
    try {
      const res = await fetch(`/api/categories/${catId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchCategories();
        if (category === catId) {
          setCategory("jewellery");
        }
      }
    } catch {} finally {
      setDeletingCatId(null);
    }
  };

  const handleToggleReviewPromote = async (review: Review) => {
    const nextPromoted = !review.promoted;
    setPromotingReviewId(review.id);
    try {
      // Optimistic update
      setReviews((prev) => {
        const updated = prev.map((r) =>
          r.id === review.id ? { ...r, promoted: nextPromoted } : r
        );
        return updated.sort((a, b) => {
          if (a.promoted && !b.promoted) return -1;
          if (!a.promoted && b.promoted) return 1;
          return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
        });
      });

      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoted: nextPromoted }),
      });
      if (!res.ok) {
        fetchReviews();
      }
    } catch {
      fetchReviews();
    } finally {
      setPromotingReviewId(null);
    }
  };

  useEffect(() => {
    let ignore = false;

    fetch(`/api/admin/products?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        if (!ignore) setErrorMsg("Failed to load products");
      })
      .finally(() => {
        if (!ignore) setLoadingProducts(false);
      });

    fetch(`/api/categories?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});

    fetch(`/api/reviews?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoadingReviews(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProductBadge = async (product: Product, newBadge: string | undefined) => {
    try {
      const promoted = newBadge === "Promoted" || newBadge === "Special Offer";
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badge: newBadge || undefined, promoted }),
      });
      if (res.status === 401) {
        alert("Your session has expired. Please sign in again.");
        window.location.reload();
        return;
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, badge: newBadge || undefined, promoted } : p
        )
      );
    } catch {
      alert("Failed to update badge");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? It will be permanently removed from the store."
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        alert("Your session has expired. Please sign in again.");
        window.location.reload();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete product on server");
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      await fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
      await fetchProducts();
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        alert("Your session has expired. Please sign in again.");
        window.location.reload();
        return;
      }
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      await fetchReviews();
    } catch {
      alert("Failed to delete review");
      await fetchReviews();
    }
  };

  const handleSaveReply = async (reviewId: string) => {
    const replyText = (replyTextMap[reviewId] ?? "").trim();
    try {
      setSubmittingReply(reviewId);
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminReply: replyText }),
      });
      if (res.status === 401) {
        alert("Your session has expired. Please sign in again.");
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error("Failed to post reply");
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                adminReply: replyText || undefined,
                adminReplyDate: replyText ? new Date().toISOString() : undefined,
              }
            : r
        )
      );
      setReplyingId(null);
    } catch {
      alert("Failed to save reply");
    } finally {
      setSubmittingReply(null);
    }
  };

  const handleStartEdit = (item: Product) => {
    setEditError("");
    setEditingProduct(item);
    const isStandardUnit = ["box", "dozen", "piece", "pair", "set", "packet"].includes(item.unit);
    setEditForm({
      name: item.name,
      category: item.category,
      subcategory: (item.subcategory as string) || "kids",
      price: item.price != null ? String(item.price) : "",
      unit: isStandardUnit ? item.unit : "custom",
      customUnit: isStandardUnit ? "" : item.unit,
      unitsPerBox: item.unitsPerBox != null ? String(item.unitsPerBox) : "",
      moq: String(item.moq || 1),
      badge: item.badge || "",
      description: item.description || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditError("");

    if (!editForm.name.trim()) {
      setEditError("Product title cannot be empty.");
      return;
    }

    if (editForm.category === "brite-store" && !editForm.subcategory) {
      setEditError("Please select a subcategory (Kids, Ladies, or Gents) for BRITE STORE.");
      return;
    }

    const finalUnit =
      editForm.unit === "custom"
        ? editForm.customUnit.trim() || "unit"
        : editForm.unit;

    try {
      setEditSubmitting(true);
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          category: editForm.category,
          subcategory: editForm.category === "brite-store" ? editForm.subcategory : undefined,
          price: editForm.price ? Number(editForm.price) : null,
          unit: finalUnit,
          unitsPerBox: editForm.unitsPerBox ? Number(editForm.unitsPerBox) : undefined,
          moq: editForm.moq ? Number(editForm.moq) : 1,
          badge: editForm.badge || undefined,
          promoted: editForm.badge === "Promoted" || editForm.badge === "Special Offer",
          description: editForm.description.trim() || undefined,
        }),
      });

      if (res.status === 401) {
        alert("Your session has expired. Please sign in again.");
        window.location.reload();
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update product");
      }

      setEditingProduct(null);
      await fetchProducts();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Error saving edits");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim()) {
      setErrorMsg("Product title is required.");
      return;
    }

    if (category === "brite-store" && !subcategory) {
      setErrorMsg("Please select a valid subcategory for BRITE STORE (Kids, Ladies, or Gents).");
      return;
    }

    const finalBadge = selectedTag === "custom" ? customTag.trim() : selectedTag;
    const finalUnit = unit === "custom" ? customUnit.trim() || "unit" : unit;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("category", category);
      if (category === "brite-store") {
        formData.append("subcategory", subcategory);
      }
      formData.append("price", price);
      formData.append("unit", finalUnit);
      formData.append("unitsPerBox", unitsPerBox.trim());
      formData.append("moq", moq);
      formData.append("description", description.trim());
      formData.append("badge", finalBadge);
      formData.append(
        "promoted",
        String(finalBadge === "Promoted" || finalBadge === "Special Offer")
      );
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        alert("Your session has expired. Please sign in again.");
        window.location.reload();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setSuccessMsg("Product published to catalog successfully!");
      // Reset form
      setName("");
      setPrice("");
      setUnitsPerBox("");
      setMoq("1");
      setDescription("");
      setSelectedTag("Special Offer");
      setCustomTag("");
      setSubcategory("kids");
      setImageFile(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving product");
    } finally {
      setSubmitting(false);
    }
  };

  const selectableCategories = (categories && categories.length > 0 ? categories : CATEGORIES).filter(
    (c) => c.id !== "all"
  );

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const term = productSearch.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(term)) ||
      (p.badge && p.badge.toLowerCase().includes(term)) ||
      (p.priceLabel && p.priceLabel.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  });

  const filteredReviews = reviews.filter((r) => {
    if (!reviewSearch.trim()) return true;
    const term = reviewSearch.toLowerCase().trim();
    return (
      r.reviewerName.toLowerCase().includes(term) ||
      (r.shopName && r.shopName.toLowerCase().includes(term)) ||
      (r.city && r.city.toLowerCase().includes(term)) ||
      (r.productName && r.productName.toLowerCase().includes(term)) ||
      (r.category && r.category.toLowerCase().includes(term)) ||
      (r.comment && r.comment.toLowerCase().includes(term)) ||
      (r.adminReply && r.adminReply.toLowerCase().includes(term))
    );
  });

  // Calculated preview price label
  const effectiveUnit = unit === "custom" ? customUnit.trim() || "unit" : unit;
  const numPrice = Number(price);
  const numUnitsPerBox = Number(unitsPerBox);
  const perUnitPrice =
    numPrice > 0 && numUnitsPerBox > 1
      ? Math.round((numPrice / numUnitsPerBox) * 100) / 100
      : null;

  return (
    <div className="min-h-screen bg-[#fcfaf7] pb-24 text-ink">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 px-4 py-4 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-semibold text-maroon hover:border-gold transition"
            >
              <ArrowLeft className="h-4 w-4" /> View Store
            </Link>
            <h1 className="font-serif text-xl font-bold text-maroon-deep md:text-2xl">
              Store Manager
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Manage Categories Button */}
            <button
              type="button"
              onClick={() => {
                setCatError("");
                setCatSuccess("");
                setCategoryModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gold/60 bg-gold/15 px-3 py-1.5 text-xs font-bold text-maroon hover:bg-gold/25 transition shadow-sm"
            >
              <FolderPlus className="h-3.5 w-3.5 text-maroon" /> + Category
            </button>

            {/* Navigation Tabs */}
            <div className="flex rounded-xl border border-line bg-cream p-1">
              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  activeTab === "products"
                    ? "bg-maroon text-white shadow"
                    : "text-muted hover:text-ink"
                }`}
              >
                <Package className="h-3.5 w-3.5" /> Products ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  activeTab === "reviews"
                    ? "bg-maroon text-white shadow"
                    : "text-muted hover:text-ink"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> Reviews ({reviews.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out of Admin"
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-cream px-3 py-1.5 text-xs font-semibold text-muted hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-8">
        {activeTab === "products" ? (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Product Creation Form */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-line bg-paper p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h2 className="font-serif text-2xl text-maroon-deep">Add New Product</h2>
                    <p className="text-xs text-muted">Upload photo, set price per box/unit, and add priority badges</p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cream text-maroon">
                    <Upload className="h-5 w-5" />
                  </div>
                </div>

                {successMsg && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                    <Check className="h-4 w-4" /> {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-800">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Photo Upload Box */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Product Photo
                    </label>
                    <div className="mt-2 flex items-center gap-4">
                      <label className="group relative flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-cream hover:border-gold overflow-hidden transition">
                        {imagePreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center p-2 text-center">
                            <ImageIcon className="h-6 w-6 text-muted group-hover:text-gold" />
                            <span className="mt-1 text-[11px] font-medium text-muted">Upload</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <div className="text-xs text-muted leading-relaxed">
                        <p className="font-semibold text-ink">Select from device</p>
                        <p>JPG, PNG, or WebP.</p>
                        <p className="text-[11px] text-muted">
                          Supports local storage &amp; automatic Vercel Blob cloud hosting.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kundan Choker Necklace Set"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  {/* Category & Selling Unit */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                          Category
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setCatError("");
                            setCatSuccess("");
                            setCategoryModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-maroon hover:underline inline-flex items-center gap-0.5"
                        >
                          <Plus className="h-3 w-3" /> New
                        </button>
                      </div>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as CategoryId)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                      >
                        {selectableCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.short}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Selling Unit
                      </label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as SellUnit)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                      >
                        {UNIT_PRESETS.map((u) => (
                          <option key={u.value} value={u.value}>
                            {u.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* BRITE STORE Subcategory Selection */}
                  {category === "brite-store" && (
                    <div className="rounded-2xl border border-gold/30 bg-gold/5 p-3.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-maroon">
                          BRITE STORE Department *
                        </label>
                        <span className="text-[10px] font-semibold text-gold-bright bg-maroon px-2 py-0.5 rounded-full">
                          Clothing
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        Select whether this ready-made garment is for Kids, Ladies, or Gents:
                      </p>
                      <div className="mt-2.5 grid grid-cols-3 gap-2">
                        {[
                          { id: "kids", label: "👶 Kids", desc: "Children wear" },
                          { id: "ladies", label: "👗 Ladies", desc: "Women garments" },
                          { id: "gents", label: "👔 Gents", desc: "Men clothing" },
                        ].map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setSubcategory(sub.id as BriteSubcategory)}
                            className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                              subcategory === sub.id
                                ? "border-maroon bg-maroon text-white font-semibold shadow-sm"
                                : "border-line bg-paper text-ink hover:border-gold"
                            }`}
                          >
                            <div className="font-bold">{sub.label}</div>
                            <div className="text-[10px] opacity-80">{sub.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Unit write-in if custom is chosen */}
                  {unit === "custom" && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Custom Unit Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. meter, roll, bundle, pack..."
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Price, Units per Box, and MOQ */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Wholesale Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 480 (or leave blank)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Units per {effectiveUnit} (Optional)
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 24 pieces in box"
                        value={unitsPerBox}
                        onChange={(e) => setUnitsPerBox(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* MOQ */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Minimum Order (MOQ in {effectiveUnit}s)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Live Price Preview Helper */}
                  {numPrice > 0 ? (
                    <div className="rounded-xl border border-gold/40 bg-gold/10 p-2.5 text-xs text-maroon-deep">
                      <span className="font-semibold">Store Rate Display:</span> ₹
                      {numPrice.toLocaleString("en-IN")} / {effectiveUnit}
                      {perUnitPrice ? (
                        <span className="ml-1 text-muted font-medium">
                          ({numUnitsPerBox} pcs · ₹{perUnitPrice}/pc)
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Priority Tag / Badge Selection */}
                  <div className="rounded-2xl border border-line bg-cream/70 p-3.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Product Tag &amp; Priority (Comes to Top)
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {TAG_PRESETS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setSelectedTag(t.value)}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                            selectedTag === t.value
                              ? "bg-maroon text-white shadow-sm ring-2 ring-gold"
                              : "border border-line bg-paper text-ink hover:border-gold"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSelectedTag("custom")}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                          selectedTag === "custom"
                            ? "bg-maroon text-white shadow-sm ring-2 ring-gold"
                            : "border border-line bg-paper text-ink hover:border-gold"
                        }`}
                      >
                        Custom Tag...
                      </button>
                    </div>

                    {selectedTag === "custom" && (
                      <input
                        type="text"
                        placeholder="e.g. Counter Hot Lot, Festive 2026..."
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        className="mt-2.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink focus:border-gold focus:outline-none"
                      />
                    )}

                    <p className="mt-2 text-[11px] text-muted">
                      ★ <strong>Special Offer</strong> and <strong>Promoted</strong> items automatically stay at the top of your catalog grid!
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Description / Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short description, color variations, packaging info..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3.5 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-maroon py-3 text-sm font-semibold text-white shadow-md hover:bg-maroon-deep disabled:opacity-50 transition"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving Product...
                      </>
                    ) : (
                      "Publish Product to Catalog"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Current Products Preview & Management */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-line bg-paper p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h2 className="font-serif text-2xl text-maroon-deep">Live Catalog</h2>
                    <p className="text-xs text-muted">
                      {productSearch
                        ? `Showing ${filteredProducts.length} of ${products.length} products`
                        : `${products.length} products total · Sorted by priority tags on store`}
                    </p>
                  </div>
                </div>

                {/* Product Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by name, category, badge..."
                    className="w-full rounded-xl border border-line bg-cream pl-9 pr-8 py-2 text-xs text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
                  />
                  {productSearch ? (
                    <button
                      type="button"
                      onClick={() => setProductSearch("")}
                      className="absolute right-2.5 top-2.5 text-xs text-muted hover:text-ink font-bold"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>

                {loadingProducts ? (
                  <div className="flex items-center justify-center py-12 text-muted">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line bg-cream/30 p-8 text-center text-xs text-muted">
                    {productSearch
                      ? `No products found matching "${productSearch}"`
                      : "No products added yet. Use the form on the left to add your first product."}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                    {filteredProducts.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-cream/40 p-3 transition hover:border-gold/60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-paper">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-xs font-serif font-bold text-maroon">
                                {item.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="font-serif font-semibold text-maroon-deep text-sm line-clamp-1">
                                {item.name}
                              </h4>
                              {item.badge && (
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    item.badge.toLowerCase().includes("special")
                                      ? "bg-amber-500 text-white"
                                      : item.badge.toLowerCase().includes("promot")
                                      ? "bg-maroon text-white"
                                      : "bg-paper border border-line text-maroon"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="rounded-full bg-cream border border-line px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-muted">
                                {item.category === "brite-store"
                                  ? `BRITE STORE${item.subcategory ? ` · ${item.subcategory}` : ""}`
                                  : item.category}
                              </span>
                              <span className="text-xs text-muted">
                                {item.priceLabel} · MOQ: {item.moq} {item.unit}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controls: Tag Switcher, Edit & Delete */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Quick Tag Selector */}
                          <select
                            value={item.badge || ""}
                            onChange={(e) => handleUpdateProductBadge(item, e.target.value)}
                            className="rounded-xl border border-line bg-paper px-2 py-1 text-[11px] font-semibold text-ink focus:border-gold focus:outline-none"
                            title="Change Product Badge / Tag"
                          >
                            <option value="">No Badge</option>
                            <option value="Special Offer">★ Special Offer</option>
                            <option value="Promoted">⚡ Promoted</option>
                            <option value="Best Seller">Best Seller</option>
                            <option value="New Arrival">New Arrival</option>
                          </select>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            title="Edit product details"
                            className="rounded-lg p-1.5 text-muted hover:bg-gold/20 hover:text-maroon transition"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(item.id)}
                            title="Delete product from store"
                            className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Customer Reviews Management Tab with Owner Reply support */
          <div className="rounded-3xl border border-line bg-paper p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl text-maroon-deep">Customer Reviews &amp; Replies</h2>
                <p className="text-xs text-muted">
                  {reviewSearch
                    ? `Showing ${filteredReviews.length} of ${reviews.length} reviews`
                    : "View customer feedback, promote reviews to top of store, reply as owner, and manage reviews."}
                </p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cream text-maroon">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>

            {/* Reviews Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
              <input
                type="text"
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                placeholder="Search reviews by reviewer name, shop, city, comment, product..."
                className="w-full rounded-2xl border border-line bg-cream pl-10 pr-9 py-2.5 text-xs text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
              />
              {reviewSearch ? (
                <button
                  type="button"
                  onClick={() => setReviewSearch("")}
                  className="absolute right-3.5 top-2.5 text-xs text-muted hover:text-ink font-bold"
                  title="Clear search"
                >
                  ✕
                </button>
              ) : null}
            </div>

            {loadingReviews ? (
              <div className="flex items-center justify-center py-12 text-muted">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredReviews.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted">
                {reviewSearch ? `No reviews matching "${reviewSearch}".` : "No reviews found."}
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredReviews.map((r) => {
                  const isReplying = replyingId === r.id;
                  const currentReplyValue =
                    replyTextMap[r.id] !== undefined ? replyTextMap[r.id] : r.adminReply || "";

                  return (
                    <div
                      key={r.id}
                      className={`flex flex-col justify-between rounded-2xl border bg-cream/40 p-4 transition ${
                        r.promoted
                          ? "border-gold/80 ring-1 ring-gold/50 bg-gradient-to-br from-cream/60 to-gold/10"
                          : "border-line hover:border-gold/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-semibold text-sm text-maroon-deep">
                                {r.reviewerName}
                                {r.shopName ? ` – ${r.shopName}` : ""}
                                {r.city ? `, ${r.city}` : ""}
                              </p>
                              {r.promoted ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gold/25 border border-gold/50 px-2 py-0.5 text-[9px] font-bold text-[#8a5b00]">
                                  ★ Featured Top
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {r.productName ? (
                                <span className="rounded bg-paper px-1.5 py-0.5 text-[10px] font-medium text-maroon border border-line">
                                  {r.productName}
                                </span>
                              ) : null}
                              {r.category ? (
                                <span className="rounded bg-paper px-1.5 py-0.5 text-[10px] text-muted border border-line">
                                  {r.category}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <div className="flex items-center gap-0.5 text-gold shrink-0">
                              <Star className="h-3.5 w-3.5 fill-gold" />
                              <span className="text-xs font-bold text-ink">{r.rating}</span>
                            </div>

                            {/* Promote / Pin to Top Switch Button */}
                            <button
                              type="button"
                              disabled={promotingReviewId === r.id}
                              onClick={() => handleToggleReviewPromote(r)}
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition shadow-xs ${
                                r.promoted
                                  ? "bg-amber-500 text-white hover:bg-amber-600"
                                  : "border border-line bg-paper text-muted hover:border-gold hover:text-maroon"
                              }`}
                              title={
                                r.promoted
                                  ? "Promoted to Top on Homepage. Click to turn off."
                                  : "Click to Promote / Pin this review to the top on Homepage"
                              }
                            >
                              {promotingReviewId === r.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <span
                                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                                    r.promoted ? "bg-white" : "bg-muted/40"
                                  }`}
                                />
                              )}
                              {r.promoted ? "★ Pinned Top" : "Promote"}
                            </button>
                          </div>
                        </div>

                        {r.comment && r.comment.trim() ? (
                          <p className="mt-2.5 text-xs leading-relaxed text-ink/80 italic">
                            &ldquo;{r.comment}&rdquo;
                          </p>
                        ) : null}

                        {/* Owner Reply Display */}
                        {r.adminReply && !isReplying ? (
                          <div className="mt-3 rounded-xl border border-gold/40 bg-gold/10 p-2.5 text-xs">
                            <div className="flex items-center justify-between text-[11px] font-bold text-maroon-deep">
                              <span className="flex items-center gap-1">
                                <CornerDownRight className="h-3 w-3 text-gold" /> Owner Reply:
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyTextMap((prev) => ({ ...prev, [r.id]: r.adminReply || "" }));
                                  setReplyingId(r.id);
                                }}
                                className="inline-flex items-center gap-1 text-[10px] text-maroon hover:underline"
                              >
                                <Edit2 className="h-3 w-3" /> Edit
                              </button>
                            </div>
                            <p className="mt-1 text-ink/85">{r.adminReply}</p>
                          </div>
                        ) : null}

                        {/* Inline Reply Box */}
                        {isReplying ? (
                          <div className="mt-3 rounded-xl border border-line bg-paper p-3">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                              Reply as Jammu Wholesale Hub
                            </label>
                            <textarea
                              rows={2}
                              value={currentReplyValue}
                              placeholder="Type your response to this review..."
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({ ...prev, [r.id]: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-line bg-cream p-2 text-xs text-ink focus:border-gold focus:outline-none"
                            />
                            <div className="mt-2 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setReplyingId(null)}
                                className="rounded-lg px-2.5 py-1 text-xs text-muted hover:text-ink"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={submittingReply === r.id}
                                onClick={() => handleSaveReply(r.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-maroon px-3 py-1 text-xs font-semibold text-white hover:bg-maroon-deep disabled:opacity-50"
                              >
                                {submittingReply === r.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Send className="h-3 w-3" />
                                )}
                                Post Reply
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-line/60 pt-2.5">
                        <span className="text-[10px] text-muted">
                          {new Date(r.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>

                        <div className="flex items-center gap-3">
                          {!isReplying && !r.adminReply ? (
                            <button
                              type="button"
                              onClick={() => {
                                setReplyTextMap((prev) => ({ ...prev, [r.id]: "" }));
                                setReplyingId(r.id);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-maroon hover:text-maroon-deep transition"
                            >
                              <CornerDownRight className="h-3.5 w-3.5 text-gold" /> Reply
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(r.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-800 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          open={true}
          title={`Edit Product: ${editingProduct.name}`}
          onClose={() => setEditingProduct(null)}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {editError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {editError}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3.5 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
              />
            </div>

            {/* Category & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value as CategoryId,
                      subcategory:
                        e.target.value === "brite-store"
                          ? prev.subcategory || "kids"
                          : "",
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                >
                  {selectableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.short}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Selling Unit
                </label>
                <select
                  value={editForm.unit}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, unit: e.target.value as SellUnit }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none"
                >
                  {UNIT_PRESETS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BRITE STORE Subcategory if category is brite-store */}
            {editForm.category === "brite-store" && (
              <div className="rounded-2xl border border-gold/30 bg-gold/5 p-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-maroon">
                  BRITE STORE Department *
                </label>
                <p className="mt-0.5 text-xs text-muted">
                  Preserved unless intentionally changed:
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "kids", label: "👶 Kids" },
                    { id: "ladies", label: "👗 Ladies" },
                    { id: "gents", label: "👔 Gents" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setEditForm((prev) => ({ ...prev, subcategory: sub.id }))}
                      className={`rounded-xl border p-2 text-center text-xs font-medium transition ${
                        editForm.subcategory === sub.id
                          ? "border-maroon bg-maroon text-white font-semibold shadow-sm"
                          : "border-line bg-paper text-ink hover:border-gold"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Unit name if custom */}
            {editForm.unit === "custom" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Custom Unit Name
                </label>
                <input
                  type="text"
                  value={editForm.customUnit}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, customUnit: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>
            )}

            {/* Price, Units per Box, and MOQ */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-line bg-cream px-2.5 py-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Units/Box
                </label>
                <input
                  type="number"
                  value={editForm.unitsPerBox}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, unitsPerBox: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-line bg-cream px-2.5 py-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  MOQ
                </label>
                <input
                  type="number"
                  min="1"
                  value={editForm.moq}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, moq: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-line bg-cream px-2.5 py-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Tag / Badge */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Priority Tag / Badge
              </label>
              <select
                value={editForm.badge}
                onChange={(e) => setEditForm((prev) => ({ ...prev, badge: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
              >
                <option value="">No Badge</option>
                <option value="Special Offer">★ Special Offer (Top priority)</option>
                <option value="Promoted">⚡ Promoted</option>
                <option value="Best Seller">Best Seller</option>
                <option value="New Arrival">New Arrival</option>
                <option value="Hot Seller">Hot Seller</option>
                <option value="Trending">Trending</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                Description
              </label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-cream transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSubmitting}
                className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-5 py-2 text-xs font-semibold text-white hover:bg-maroon-deep transition disabled:opacity-50"
              >
                {editSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Category Management Modal */}
      {categoryModalOpen && (
        <Modal
          open={true}
          title="Product Categories Manager"
          onClose={() => setCategoryModalOpen(false)}
        >
          <div className="space-y-6">
            {/* Create New Category Form */}
            <form onSubmit={handleAddCategory} className="space-y-3 rounded-2xl border border-line bg-cream/40 p-4">
              <h3 className="font-serif text-base font-bold text-maroon-deep flex items-center gap-2">
                <FolderPlus className="h-4 w-4 text-gold" /> Add New Category
              </h3>

              {catSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800">
                  <Check className="h-4 w-4" /> {catSuccess}
                </div>
              )}

              {catError && (
                <div className="rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">
                  {catError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Footwear & Mojari, Home Furnishing, Perfumes..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Short Label (Navbar / Chip)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Footwear"
                    value={newCatShort}
                    onChange={(e) => setNewCatShort(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wholesale mojari & slip-ons"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={catSubmitting || !newCatName.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-maroon py-2 text-xs font-semibold text-white hover:bg-maroon-deep disabled:opacity-50 transition"
              >
                {catSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Save Category
                  </>
                )}
              </button>
            </form>

            {/* Existing Categories List */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Existing Categories ({categories.length})
              </p>
              <div className="divide-y divide-line/60 rounded-2xl border border-line bg-paper max-h-60 overflow-y-auto">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink">{c.label}</span>
                        {c.isCustom ? (
                          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-maroon">
                            Custom
                          </span>
                        ) : (
                          <span className="rounded-full bg-cream border border-line px-2 py-0.5 text-[10px] text-muted">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted font-mono mt-0.5">id: {c.id}</p>
                    </div>

                    {c.isCustom ? (
                      <button
                        type="button"
                        disabled={deletingCatId === c.id}
                        onClick={() => handleDeleteCategory(c.id)}
                        className="rounded-lg p-1.5 text-muted hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete custom category"
                      >
                        {deletingCatId === c.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
