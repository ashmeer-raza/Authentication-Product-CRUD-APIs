import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../store/AuthContext";

const useLoginForm = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Local form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes — updates the specific field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Client-side validation before sending to server
  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await loginUser(formData); // Calls AuthContext.loginUser → service → API
      toast.success("Welcome back!");
      navigate("/products"); // Redirect on success
    } catch (err) {
      // The server may return field-level errors or a generic message
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
      } else {
        const msg = err.response?.data?.message || "Login failed";
        toast.error(msg);
        setErrors({ general: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, isLoading, handleChange, handleSubmit };
};

export default useLoginForm;
