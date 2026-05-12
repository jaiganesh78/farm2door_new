import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "BUYER",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useUIStore((state) => state.addToast);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { user, token } = await authService.register(formData);
      setAuth(user, token);
      addToast("Registration successful!", "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-500 text-sm mt-1">Join the Farm2Door marketplace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          id="name"
          name="name"
          type="text"
          required
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          required
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          label="Phone"
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+1 555 0100"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            {["BUYER", "FARMER"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ ...formData, role })}
                className={`py-2 px-4 text-sm font-medium rounded-md border transition-all ${
                  formData.role === role
                    ? "bg-green-50 border-green-600 text-green-700 ring-1 ring-green-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
