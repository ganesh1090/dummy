import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createBranch } from "../services/branchService";


function AddBranch() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await createBranch({
        id: formData.id.trim(),
        name: formData.name.trim(),
        is_active: formData.is_active,
      });

      navigate("/branches");

    } catch (error) {
      const data = error.response?.data;

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
          "Failed to create branch."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="management-page">

      <div className="management-header">

        <div>

          <span className="management-eyebrow">
            Library
          </span>

          <h2>
            Add Branch
          </h2>

          <p>
            Create a new library branch.
          </p>

        </div>


        <button
          type="button"
          className="secondary-action-button"
          onClick={() =>
            navigate("/branches")
          }
          disabled={loading}
        >
          ← Back to Branches
        </button>

      </div>


      <div className="form-card">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="modern-form"
        >

          <div className="form-row">

            <div className="form-group">

              <label>
                Branch ID
              </label>

              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g. B-001"
                required
                disabled={loading}
              />

              <span className="field-help">
                Example: B-001
              </span>

            </div>


            <div className="form-group">

              <label>
                Branch Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Main"
                required
                disabled={loading}
              />

              <span className="field-help">
                Enter a unique branch name.
              </span>

            </div>

          </div>


          <div className="form-group">

            <label>
              Status
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                disabled={loading}
              />

              <span>
                Active branch
              </span>

            </label>

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="secondary-action-button"
              onClick={() =>
                navigate("/branches")
              }
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="primary-action-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Branch"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


export default AddBranch;