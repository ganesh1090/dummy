import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";


function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    setLoading(true);


    try {
      const data = await registerUser(
        formData.username.trim(),
        formData.email.trim(),
        formData.password
      );

      setSuccess(
        data.message ||
        "Account created successfully. Please verify your email before logging in."
      );

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      const data =
        error.response?.data;


      if (
        data &&
        typeof data === "object"
      ) {
        setError(
          Object.entries(data)
            .map(
              ([field, message]) =>
                `${field}: ${
                  Array.isArray(message)
                    ? message.join(", ")
                    : message
                }`
            )
            .join(" | ")
        );
      } else {
        setError(
          "Failed to create account."
        );
      }

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
            Join
            <br />
            <span>LibraryOS</span>
          </h1>


          <p className="showcase-description">
            Create your library account and manage
            books, members, and library activities with ease.
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
                  Your account is protected.
                </p>
              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon orange">
                ✉
              </div>

              <div>
                <h3>
                  Email Verification
                </h3>

                <p>
                  Verify your email before signing in.
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
            Create Account
          </h2>


          <p className="login-subtitle">
            Create your LibraryOS account
          </p>


          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {success && (
            <div className="register-success">
              {success}
            </div>
          )}


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-field">

              <label htmlFor="register-username">
                Username
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="register-username"
                  type="text"
                  name="username"
                  value={
                    formData.username
                  }
                  onChange={handleChange}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />

              </div>

            </div>


            <div className="login-field">

              <label htmlFor="register-email">
                Email
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={handleChange}
                  placeholder="Enter email address"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            <div className="login-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={handleChange}
                  placeholder="Create password"
                  autoComplete="new-password"
                  required
                />

              </div>

            </div>


            <div className="login-field">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  required
                />

              </div>

            </div>


            <button
              type="submit"
              className="signin-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          <p className="create-account">

            Already have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign In
            </button>

          </p>

        </div>

      </section>

    </div>
  );
}


export default Register;