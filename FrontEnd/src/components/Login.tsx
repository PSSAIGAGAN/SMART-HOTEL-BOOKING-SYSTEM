import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const validateCredentials = (): boolean => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateCredentials()) return;

    try {
      const response = await axios.post("http://localhost:9999/user-api/users/login", {
        username: email,
        password,
      });

      const token = response.data;
      console.log(token);



      if (typeof token !== "string" || token.trim() === "") {
        setError("Login failed: Token not received.");
        return;
      }

      // Decode token payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;
      localStorage.setItem("userId", userId);

      //  Extract roles
      const roles: string[] = Array.isArray(payload.roles)
        ? payload.roles.map((r: string) => r.toUpperCase())
        : [];
      const userRole: string = roles[0] || "GUEST";

      //  Check token expiry
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        setError("Session expired. Please log in again.");
        localStorage.clear();
        return;
      }

      //  Store token for protected routes
      localStorage.setItem("accessToken", token); //  Used by Axios headers
      localStorage.setItem("token", token);       // Already used by your flow
      localStorage.setItem("userType", userRole);
      localStorage.setItem("loggedIn", "true");

      //  Redirect based on role
      switch (userRole) {
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "HOTEL_MANAGER":
          navigate("/managerooms");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div id="login-page">
      <div id="login-wrapper">
        <div id="loginform" className="fade-in">
          <h1>Welcome Back</h1>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-danger">{error}</p>}
            <div className="input-group">
              <input
                type="email"
                name="email"
                id="emailInput"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                id="passwordInput"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <input type="submit" id="submitButton" value="Log In" />
            <p className="register-link">
              Don't have an account?
              <span
                onClick={() => navigate("/register")}
                style={{ cursor: "pointer", color: "blue", marginLeft: "4px" }}
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
