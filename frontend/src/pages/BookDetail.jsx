import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getBook } from "../services/bookService";


function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadBook = async () => {
      try {
        const data = await getBook(bookId);
        setBook(data);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
          "Failed to load book."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId]);


  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-circle" />

        <p>
          Loading book details...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }


  if (!book) {
    return (
      <div className="empty-state">

        <div className="empty-state-icon">
          📖
        </div>

        <h3>
          Book not found
        </h3>

        <p>
          The requested book could not be found.
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
            Book Details
          </h2>

          <p>
            View complete information about this physical book.
          </p>

        </div>


        <div className="detail-actions">

          <button
            className="detail-button back"
            onClick={() =>
              navigate("/books")
            }
          >
            ← Back to Books
          </button>


          <button
            className="detail-button edit"
            onClick={() =>
              navigate(`/books/${book.id}/edit`)
            }
          >
            Edit Book
          </button>

        </div>

      </div>


      {/* Detail Card */}

      <div className="detail-card">

        {/* Book Header */}

        <div className="book-detail-top">

          <div className="book-detail-icon">
            📖
          </div>

          <div className="book-detail-title">

            <h1>
              {book.title_name || "Untitled Book"}
            </h1>

            <p>
              Book #{book.id}
            </p>

          </div>

        </div>


        {/* Information Grid */}

        <div className="detail-info-grid">

          <div className="detail-info-item">

            <span>
              Barcode
            </span>

            <strong>
              {book.barcode || "—"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Branch
            </span>

            <strong>
              {book.branch_name || "—"}
            </strong>

            {book.branch_id && (
              <span
                style={{
                  display: "block",
                  marginTop: "5px",
                  color: "#9aa1b0",
                  fontSize: "11px",
                }}
              >
                {book.branch_id}
              </span>
            )}

          </div>


          <div className="detail-info-item">

            <span>
              Condition
            </span>

            <strong>
              {book.condition || "—"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Copy Status
            </span>

            <strong>
              {book.status || "—"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Total Quantity
            </span>

            <strong>
              {book.quantity ?? 0}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Available Quantity
            </span>

            <strong>
              {book.available_quantity ?? 0}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Author
            </span>

            <strong>
              {book.author || "—"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              ISBN
            </span>

            <strong>
              {book.isbn || "—"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Publisher
            </span>

            <strong>
              {book.publisher || "—"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Publication Year
            </span>

            <strong>
              {book.publication_year || "—"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Record Status
            </span>

            <strong
              className={
                book.is_active
                  ? "detail-status active"
                  : "detail-status inactive"
              }
            >
              {book.is_active
                ? "Active"
                : "Inactive"}
            </strong>

          </div>

        </div>


        {/* Description */}

        <div className="detail-description">

          <div className="detail-description-heading">
            Description
          </div>

          <p>
            {book.description ||
              "No description available."}
          </p>

        </div>

      </div>

    </div>
  );
}


export default BookDetail;