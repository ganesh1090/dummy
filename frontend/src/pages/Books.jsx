import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getBooks } from "../services/bookService";


function Books() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // LOAD BOOKS
  // =====================================================

  const loadBooks = async (
    pageNumber = 1,
    searchTerm = search
  ) => {
    setLoading(true);
    setError("");

    try {
      const data = await getBooks(
        pageNumber,
        10,
        searchTerm
      );

      setBooks(data.results || []);

      setPage(pageNumber);
      setNextPage(data.next);
      setPreviousPage(data.previous);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load books."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadBooks(1, "");
  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (event) => {
    event.preventDefault();

    loadBooks(1, search);
  };


  // =====================================================
  // GROUP PHYSICAL COPIES BY TITLE
  // =====================================================

  const groupedTitles = useMemo(() => {
    const groups = {};

    books.forEach((book) => {
      const titleId =
        book.title_id ||
        book.title_record ||
        `book-${book.id}`;

      if (!groups[titleId]) {
        groups[titleId] = {
          titleId,
          titleName:
            book.title_name ||
            "Untitled",

          author:
            book.author ||
            "Unknown Author",

          isbn:
            book.isbn ||
            "N/A",

          publisher:
            book.publisher ||
            "N/A",

          publicationYear:
            book.publication_year ||
            "N/A",

          copies: [],
        };
      }

      groups[titleId].copies.push(book);
    });

    return Object.values(groups);
  }, [books]);


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "status-badge active";

      case "ISSUED":
        return "status-badge issued";

      case "RESERVED":
        return "status-badge reserved";

      default:
        return "status-badge inactive";
    }
  };


  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Available";

      case "ISSUED":
        return "Issued";

      case "RESERVED":
        return "Reserved";

      default:
        return status || "Unknown";
    }
  };


  // =====================================================
  // CONDITION LABEL
  // =====================================================

  const getConditionLabel = (condition) => {
    if (!condition) {
      return "N/A";
    }

    return (
      condition.charAt(0) +
      condition.slice(1).toLowerCase()
    );
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="management-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="management-header">

        <div>

          <span className="management-eyebrow">
            Library
          </span>

          <h2>
            Books Management
          </h2>

          <p>
            Manage physical copies of library titles.
          </p>

        </div>


        <button
          className="primary-action-button"
          onClick={() =>
            navigate("/books/add")
          }
        >
          + Add Book
        </button>

      </div>


      {/* =================================================
          SEARCH
          ================================================= */}

      <div className="management-toolbar">

        <form
          className="search-form"
          onSubmit={handleSearch}
        >

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by title, author or ISBN..."
          />

          <button type="submit">
            Search
          </button>

        </form>

      </div>


      {/* =================================================
          LOADING
          ================================================= */}

      {loading && (
        <div className="management-loading">
          Loading books...
        </div>
      )}


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* =================================================
          EMPTY
          ================================================= */}

      {!loading &&
        !error &&
        books.length === 0 && (

          <div className="empty-state">

            <div className="empty-state-icon">
              📚
            </div>

            <h3>
              No books found
            </h3>

            <p>
              Try a different search or add a new book.
            </p>

          </div>
        )}


      {/* =================================================
          TITLES + PHYSICAL COPIES
          ================================================= */}

      {!loading &&
        !error &&
        groupedTitles.length > 0 && (

          <div className="data-card">

            {groupedTitles.map((title) => (

              <div
                key={title.titleId}
                className="book-title-group"
                style={{
                  borderBottom:
                    "1px solid #e8eaf0",
                }}
              >

                {/* =========================================
                    TITLE HEADER
                    ========================================= */}

                <div
                  style={{
                    padding: "22px 24px",
                    background: "#fafbfe",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                      }}
                    >

                      <div
                        className="book-table-icon"
                        style={{
                          width: "46px",
                          height: "46px",
                          minWidth: "46px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          background: "#eeebff",
                          fontSize: "22px",
                        }}
                      >
                        📖
                      </div>


                      <div>

                        <h3
                          style={{
                            margin: "0 0 6px",
                            fontSize: "17px",
                            color: "#293149",
                          }}
                        >
                          {title.titleName}
                        </h3>


                        <div
                          style={{
                            display: "flex",
                            gap: "14px",
                            flexWrap: "wrap",
                            fontSize: "12px",
                            color: "#687086",
                          }}
                        >

                          <span>
                            <strong>
                              Title ID:
                            </strong>{" "}
                            {title.titleId}
                          </span>

                          <span>
                            <strong>
                              Author:
                            </strong>{" "}
                            {title.author}
                          </span>

                          <span>
                            <strong>
                              ISBN:
                            </strong>{" "}
                            {title.isbn}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* COPY COUNT */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "#eeebff",
                        color: "#6255e8",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      📚{" "}
                      {title.copies.length}{" "}
                      {title.copies.length === 1
                        ? "Physical Copy"
                        : "Physical Copies"}
                    </div>

                  </div>

                </div>


                {/* =========================================
                    PHYSICAL COPIES TABLE
                    ========================================= */}

                <div className="table-scroll">

                  <table className="management-table">

                    <thead>

                      <tr>

                        <th>
                          Book ID
                        </th>

                        <th>
                          Barcode
                        </th>

                        <th>
                          Branch
                        </th>

                        <th>
                          Condition
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Actions
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {title.copies.map((book) => (

                        <tr key={book.id}>

                          {/* BOOK ID */}

                          <td>

                            <span className="number-badge">
                              B-{String(book.id).padStart(3, "0")}
                            </span>

                          </td>


                          {/* BARCODE */}

                          <td>

                            <span className="number-badge">
                              {book.barcode || "N/A"}
                            </span>

                          </td>


                          {/* BRANCH */}

                          <td>

                            <div className="book-table-info">

                              <div className="branch-table-avatar">
                                🏢
                              </div>

                              <div>

                                <strong>
                                  {book.branch_name ||
                                    "No Branch"}
                                </strong>

                                <span>
                                  {book.branch_id ||
                                    "N/A"}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* CONDITION */}

                          <td>

                            <span className="number-badge">
                              {getConditionLabel(
                                book.condition
                              )}
                            </span>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={getStatusClass(
                                book.status
                              )}
                            >
                              {getStatusLabel(
                                book.status
                              )}
                            </span>

                          </td>


                          {/* ACTIONS */}

                          <td>

                            <div className="table-actions">

                              <button
                                className="icon-action view-icon"
                                onClick={() =>
                                  navigate(
                                    `/books/${book.id}`
                                  )
                                }
                                title="View physical copy"
                                aria-label="View physical copy"
                              >
                                👁
                              </button>


                              <button
                                className="icon-action edit-icon"
                                onClick={() =>
                                  navigate(
                                    `/books/${book.id}/edit`
                                  )
                                }
                                title="Edit physical copy"
                                aria-label="Edit physical copy"
                              >
                                ✎
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            ))}


            {/* =================================================
                PAGINATION
                ================================================= */}

            <div className="table-footer">

              <span>
                Page {page}
              </span>


              <div className="pagination">

                <button
                  onClick={() =>
                    loadBooks(
                      page - 1,
                      search
                    )
                  }
                  disabled={!previousPage}
                >
                  ← Previous
                </button>


                <button
                  onClick={() =>
                    loadBooks(
                      page + 1,
                      search
                    )
                  }
                  disabled={!nextPage}
                >
                  Next →
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}


export default Books;