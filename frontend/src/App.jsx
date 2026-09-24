import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./store/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductFormPage from "./pages/ProductFormPage";

const MainLayout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="main-content">{children}</main>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      {/* AuthProvider must wrap everything so AuthContext is available everywhere */}
      <AuthProvider>
        {/* react-hot-toast container */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e1e2e",
              color: "#cdd6f4",
              border: "1px solid #313244",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#a6e3a1", secondary: "#1e1e2e" } },
            error: { iconTheme: { primary: "#f38ba8", secondary: "#1e1e2e" } },
          }}
        />

        <Routes>
          {/* ── Root redirect ── */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          {/* ── Public Auth Pages (no navbar) ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Public Pages (with navbar) ── */}
          <Route
            path="/products"
            element={
              <MainLayout>
                <ProductsPage />
              </MainLayout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <MainLayout>
                <ProductDetailPage />
              </MainLayout>
            }
          />

          {/* ── Protected Pages (with navbar, require auth) ── */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/products/new"
              element={
                <MainLayout>
                  <ProductFormPage />
                </MainLayout>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <MainLayout>
                  <ProductFormPage />
                </MainLayout>
              }
            />
          </Route>

          {/* ── 404 fallback ── */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
