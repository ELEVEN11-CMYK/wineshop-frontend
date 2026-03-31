import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "../api/axios";

const THEMES = [
  { color: "#e04472", icon: "🍷" },
  { color: "#00aaff", icon: "🥂" },
  { color: "#aa00ff", icon: "🥃" },
  { color: "#ffcc00", icon: "🍺" },
  { color: "#00ffcc", icon: "🫗" },
  { color: "#ff6600", icon: "🍹" },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const result = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/categories");
      setCategories(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editCategory) {
        await axios.put(`/categories/${editCategory.id}`, form);
      } else {
        await axios.post("/categories", form);
      }

      setShowModal(false);
      setEditCategory(null);
      setForm({ name: "", description: "" });

      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`/categories/${id}/toggle-status`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0010" }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#0a0010",
          transition: "margin-left 0.3s",
          marginLeft: "0px",
        }}
      >
        {/* Navbar with Hamburger */}
        <Navbar title="Categories" onMenuClick={() => setSidebarOpen(true)} />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                color: "white",
                fontSize: "clamp(18px,2.5vw,22px)",
                fontWeight: "600",
              }}
            >
              📂 Categories
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>
              {categories.length} categories in your inventory
            </p>
          </div>

          <button
            onClick={() => {
              setForm({ name: "", description: "" });
              setEditCategory(null);
              setShowModal(true);
            }}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg,#e04472,#aa00ff)",
              color: "white",
              cursor: "pointer",
            }}
          >
            + Add Category
          </button>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: "24px", position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "9px",
              color: "#9ca3af",
            }}
          >
            🔍
          </span>
          <input
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 10px 10px 36px",
              borderRadius: "12px",
              border: "1px solid #2d0039",
              background: "#120018",
              color: "white",
              outline: "none",
            }}
          />
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatCard title="Total" value={categories.length} />
          <StatCard
            title="Active"
            value={categories.filter((c) => c.isActive).length}
          />
          <StatCard
            title="Inactive"
            value={categories.filter((c) => !c.isActive).length}
          />
        </div>

        {/* LIST */}
        {loading ? (
          <div style={{ color: "white" }}>Loading...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filtered.map((cat, i) => {
              const theme = THEMES[i % THEMES.length];

              return (
                <div
                  key={cat.id}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    background: "#120018",
                    border: "1px solid #1f2937",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#7b2cff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#1f2937";
                  }}
                >
                  <div style={{ fontSize: "22px", color: theme.color }}>{theme.icon}</div>

                  <div style={{ flex: "1 1 220px", color: "white" }}>
                    <h3 style={{ fontSize: "14px", marginBottom: "2px", fontWeight: "500" }}>
                      {cat.name}
                      <span
                        style={{
                          marginLeft: "8px",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "500",
                          background: cat.isActive
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(239,68,68,0.15)",
                          color: cat.isActive ? "#34d399" : "#f87171",
                          border: cat.isActive
                            ? "1px solid rgba(16,185,129,0.3)"
                            : "1px solid rgba(239,68,68,0.3)",
                        }}
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </h3>

                    <p style={{ color: "#9ca3af", fontSize: "clamp(12px,2vw,14px)" }}>
                      {cat.description || "No description available"}
                    </p>
                  </div>

                  <div style={{ color: "#9ca3af" }}>#{cat.id}</div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(cat)}
                      style={{
                        background: "#1e3a8a",
                        border: "none",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "13px",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggle(cat.id)}
                      style={{
                        background: "#92400e",
                        border: "none",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "13px",
                      }}
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      style={{
                        background: "#7f1d1d",
                        border: "none",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "13px",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 999,
            }}
          >
            <div
              style={{
                background: "#120018",
                padding: "26px",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "420px",
                border: "1px solid #2d0039",
                boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              }}
            >
              <h3
                style={{
                  color: "white",
                  marginBottom: "20px",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {editCategory ? "✏️ Edit Category" : "➕ Add Category"}
              </h3>

              <form onSubmit={handleSubmit}>
                <label style={{ color: "#9ca3af", fontSize: "13px", display: "block", marginBottom: "5px" }}>
                  Category Name
                </label>
                <input
                  placeholder="Enter category name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                    border: "1px solid #2d0039",
                    background: "#0a0010",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />

                <label style={{ color: "#9ca3af", fontSize: "13px", display: "block", marginBottom: "5px" }}>
                  Description
                </label>
                <textarea
                  placeholder="Optional description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    marginBottom: "18px",
                    borderRadius: "8px",
                    border: "1px solid #2d0039",
                    background: "#0a0010",
                    color: "white",
                    fontSize: "13px",
                    outline: "none",
                    minHeight: "70px",
                  }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg,#e04472,#aa00ff)",
                      color: "white",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #2d0039",
                      background: "transparent",
                      color: "#9ca3af",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div style={{ background: "#140021", padding: "16px", borderRadius: "12px", color: "white" }}>
    <h3 style={{ fontSize: "22px" }}>{value}</h3>
    <p style={{ fontSize: "13px", color: "#9ca3af" }}>{title}</p>
  </div>
);

export default Categories;