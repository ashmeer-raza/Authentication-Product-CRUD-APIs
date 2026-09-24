import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../store/AuthContext";

const useRegisterForm = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors]       = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!/\d/.test(formData.password)) newErrors.password = "Password must contain at least one number";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

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
      await registerUser(formData);
      toast.success("Account created! Please log in.");
      navigate("/login"); // After register, go to login (per spec: no token on register)
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
      } else {
        const msg = err.response?.data?.message || "Registration failed";
        toast.error(msg);
        setErrors({ general: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, isLoading, handleChange, handleSubmit };
};

export default useRegisterForm;
