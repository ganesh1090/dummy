import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getBook,
  updateBook,
} from "../services/bookService";

import { getTitles } from "../services/titleService";
import { getBranches } from "../services/branchService";


function EditBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [titles, setTitles] = useState([]);
  const [branches, setBranches] = useState([]);

  const [formData, setFormData] = useState({
    title_record: "",
    branch: "",
    barcode: "",
    condition: "NEW",
    status: "AVAILABLE",
    quantity: 1,
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadData = async () => {
      try {
        const [book, titleData, branchData] =
          await Promise.all([
            getBook(bookId),
            getTitles(),
            getBranches(),
          ]);

        setTitles(
          titleData.results || titleData
        );

        setBranches(
          branchData.results || branchData
        );

        setFormData({
          title_record:
            book.title_record || "",

          branch:
            book.branch || "",

          barcode:
            book.barcode || "",

          condition:
            book.condition || "NEW",

          status:
            book.status || "AVAILABLE",

          quantity:
            book.quantity || 1,

          is_active:
            book.is_active ?? true,
        });

      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.detail ||
          "Failed to load book information."
        );

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookId]);


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

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

    setSaving(true);
    setError("");

    try {
      await updateBook(
        bookId,
        {
          title_record:
            formData.title_record,

          branch:
            formData.branch,

          barcode:
            formData.barcode,

          condition:
            formData.condition,

          status:
            formData.status,

          quantity:
            Number(formData.quantity),

          is_active:
            formData.is_active,
        }
      );

      navigate(`/books/${bookId}`);

    } catch (error) {
      console.error(error);

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
          "Failed to update book."
        );
      }

    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-circle" />

        <p>
          Loading book...
        </p>
      </div>
    );
  }


  return (
    <div className="detail-page">

      {/* Header */}

      <div className="detail-header">

        <div className="detail-header-left">

          <span className="detail-eyebrow">
            Library
          </span>

          <h2>
            Edit Book
          </h2>

          <p>
            Update the information for this physical book.
          </p>

        </div>


        <div className="detail-actions">

          <button
            type="button"
            className="detail-button back"
            onClick={() =>
              navigate(`/books/${bookId}`)
            }
            disabled={saving}
          >
            ← Back to Book
          </button>

        </div>

      </div>


      {/* Error */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* Form */}

      <div className="detail-card">

        <form
          className="edit-form"
          onSubmit={handleSubmit}
        >

          <div className="edit-form-grid">

            {/* Title */}

            <div className="form-group">

              <label>
                Book Title
              </label>

              <select
                name="title_record"
                value={formData.title_record}
                onChange={handleChange}
                required
                disabled={saving}
              >

                <option value="">
                  Select a title
                </option>

                {titles.map((title) => (
                  <option
                    key={title.id}
                    value={title.id}
                  >
                    {title.title}
                  </option>
                ))}

              </select>

            </div>


            {/* Branch */}

            <div className="form-group">

              <label>
                Branch
              </label>

              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                disabled={saving}
              >

                <option value="">
                  Select a branch
                </option>

                {branches.map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name} ({branch.id})
                  </option>
                ))}

              </select>

            </div>


            {/* Barcode */}

            <div className="form-group">

              <label>
                Barcode
              </label>

              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Example: LIB000235"
                required
                disabled={saving}
              />

            </div>


            {/* Condition */}

            <div className="form-group">

              <label>
                Condition
              </label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                disabled={saving}
              >

                <option value="NEW">
                  New
                </option>

                <option value="GOOD">
                  Good
                </option>

                <option value="FAIR">
                  Fair
                </option>

                <option value="POOR">
                  Poor
                </option>

                <option value="DAMAGED">
                  Damaged
                </option>

              </select>

            </div>


            {/* Status */}

            <div className="form-group">

              <label>
                Copy Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={saving}
              >

                <option value="AVAILABLE">
                  Available
                </option>

                <option value="ISSUED">
                  Issued
                </option>

                <option value="RESERVED">
                  Reserved
                </option>

              </select>

            </div>


            {/* Quantity */}

            <div className="form-group">

              <label>
                Total Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                disabled={saving}
              />

            </div>


            {/* Active */}

            <div className="form-group">

              <label>
                Book Status
              </label>

              <label className="checkbox-field">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  disabled={saving}
                />

                <span>
                  Active
                </span>

              </label>

            </div>

          </div>


          {/* Buttons */}

          <div className="edit-form-actions">

            <button
              type="button"
              className="detail-button back"
              onClick={() =>
                navigate(`/books/${bookId}`)
              }
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="detail-button edit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


export default EditBook;