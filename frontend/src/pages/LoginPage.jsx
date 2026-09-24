
import { Link } from "react-router-dom";
import useLoginForm from "../hooks/useLoginForm";
import FormField from "../components/FormField";

const LoginPage = () => {
  const { formData, errors, isLoading, handleChange, handleSubmit } = useLoginForm();

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-header">
          <div className="auth-logo">🛍️</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your ShopStack account</p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            id="login-submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="btn-spinner" /> Signing in...</>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="auth-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>
    </div>
  );
};

export default LoginPage;
