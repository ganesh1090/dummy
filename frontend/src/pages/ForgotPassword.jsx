import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  requestPasswordReset,
} from "../services/authService";


function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data =
        await requestPasswordReset(
          email.trim()
        );

      setSuccess(
        data.message ||
        "If the account exists, a password reset email has been sent."
      );

      setEmail("");

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
          "Unable to request password reset."
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
            Reset your
            <br />
            <span>Password</span>
          </h1>


          <p className="showcase-description">
            Don't worry. We'll help you get back
            into your LibraryOS account.
          </p>


          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon blue">
                🔒
              </div>

              <div>
                <h3>
                  Secure Reset
                </h3>

                <p>
                  Your password reset is handled securely.
                </p>
              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon green">
                ✉
              </div>

              <div>
                <h3>
                  Email Verification
                </h3>

                <p>
                  We'll send instructions to your email.
                </p>
              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon orange">
                ✓
              </div>

              <div>
                <h3>
                  Quick Recovery
                </h3>

                <p>
                  Get back to managing your library quickly.
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
            Forgot Password?
          </h2>


          <p className="login-subtitle">
            Enter your email and we'll send you
            instructions to reset your password.
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

              <label htmlFor="reset-email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
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
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>


          <p className="create-account">

            Remember your password?

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Back to Sign In
            </button>

          </p>

        </div>

      </section>

    </div>
  );
}


export default ForgotPassword;