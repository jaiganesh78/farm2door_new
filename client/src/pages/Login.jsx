import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const { user, token } = await authService.login(formData);
      setAuth(user, token);
      addToast(`Welcome back, ${user.name}!`, "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 text-sm mt-1">Log in to your Farm2Door account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Forgot password?
            </a>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
