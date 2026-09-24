
import { Link } from "react-router-dom";
import useRegisterForm from "../hooks/useRegisterForm";
import FormField from "../components/FormField";

const RegisterPage = () => {
  const { formData, errors, isLoading, handleChange, handleSubmit } = useRegisterForm();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">✨</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join ShopStack and start managing products</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <FormField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
            autoComplete="name"
            required
          />

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
            placeholder="Min 6 chars, include a number"
            error={errors.password}
            autoComplete="new-password"
            required
          />

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            id="register-submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="btn-spinner" /> Creating account...</>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>
    </div>
  );
};

export default RegisterPage;
