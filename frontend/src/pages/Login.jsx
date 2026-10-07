import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";


function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(
        username.trim(),
        password
      );

      localStorage.setItem(
        "authToken",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "rememberMe",
        rememberMe.toString()
      );

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "DATA:",
        error.response?.data
      );

      console.error(
        "MESSAGE:",
        error.message
      );

      setError(
        error.response?.data?.detail ||
        error.message ||
        "Login failed."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-shell">

      {/* LEFT SIDE */}

      <section className="login-showcase">

        <div className="showcase-inner">

          <div className="showcase-logo">
            <span>▣</span>
          </div>


          <h1>
            Welcome to
            <br />
            <span>LibraryOS</span>
          </h1>


          <p className="showcase-description">
            Manage books, members, and every library
            activity with ease.
          </p>


          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon blue">
                ▣
              </div>

              <div>
                <h3>
                  Smart &amp; Simple
                </h3>

                <p>
                  Everything you need in one place.
                </p>
              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon green">
                👥
              </div>

              <div>
                <h3>
                  Secure &amp; Reliable
                </h3>

                <p>
                  Your data is safe with us.
                </p>
              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon orange">
                ▥
              </div>

              <div>
                <h3>
                  Insights &amp; Reports
                </h3>

                <p>
                  Track and grow your library.
                </p>
              </div>

            </div>

          </div>


          <div className="login-quote">

            <div className="quote-mark">
              “
            </div>

            <p>
              A library is not a luxury but one of
              the necessities of life.
            </p>

            <strong>
              — Henry Ward Beecher
            </strong>

          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}

      <section className="login-panel">

        <div className="login-box">

          <div className="login-brand-icon">
            ▣
          </div>


          <h2>
            LibraryOS
          </h2>


          <p className="login-subtitle">
            Library Management System
          </p>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Username */}

            <div className="login-field">

              <label htmlFor="username">
                Username
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* Options */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span>
                  Remember me
                </span>

              </label>


              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  navigate(
                    "/forgot-password"
                  )
                }
              >
                Forgot password?
              </button>

            </div>


            {/* Login */}

            <button
              type="submit"
              className="signin-button"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "➜ Sign In"}
            </button>

          </form>


          {/* Social Login - Later */}

          <div className="login-divider">

            <span>
              or continue with
            </span>

          </div>


          <div className="social-login">

            <button
              type="button"
              className="social-button"
              onClick={() =>
                alert(
                  "Google login will be added later."
                )
              }
            >
              <span>
                G
              </span>

              Google
            </button>


            <button
              type="button"
              className="social-button"
              onClick={() =>
                alert(
                  "Microsoft login will be added later."
                )
              }
            >
              <span>
                ▦
              </span>

              Microsoft
            </button>

          </div>


          {/* Registration */}

          <p className="create-account">

            Don't have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create Your Library Account
            </button>

          </p>

        </div>

      </section>

    </div>
  );
}


export default Login;