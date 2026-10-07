import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCirculationRecords,
  returnBook,
} from "../services/circulationService";


const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const getStatusClass = (status) => {
  if (status === "RETURNED") {
    return "status-badge returned";
  }

  if (status === "OVERDUE") {
    return "status-badge overdue";
  }

  return "status-badge issued";
};


const getStatusLabel = (status) => {
  if (status === "RETURNED") {
    return "Returned";
  }

  if (status === "OVERDUE") {
    return "Overdue";
  }

  return "Issued";
};


function Circulation() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [page, setPage] = useState(1);

  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [returningId, setReturningId] = useState(null);


  const loadRecords = async (pageNumber = 1) => {
    setLoading(true);
    setError("");

    try {
      const data = await getCirculationRecords(
        pageNumber,
        10
      );

      setRecords(data.results || []);
      setTotalCount(data.totalCount || 0);

      setPage(pageNumber);

      setNextPage(data.next);
      setPreviousPage(data.previous);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load circulation records."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadRecords(1);
  }, []);


  const handleReturn = async (issueId) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmed) {
      return;
    }

    setReturningId(issueId);
    setError("");

    try {
      await returnBook(issueId);

      await loadRecords(page);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to return book."
      );
    } finally {
      setReturningId(null);
    }
  };


  const issuedCount = records.filter(
    (record) => record.status === "ISSUED"
  ).length;

  const overdueCount = records.filter(
    (record) => record.status === "OVERDUE"
  ).length;

  const returnedCount = records.filter(
    (record) => record.status === "RETURNED"
  ).length;


  return (
    <div className="management-page">

      {/* Header */}

      <div className="management-header">

        <div>

          <span className="management-eyebrow">
            Circulation
          </span>

          <h2>
            Issued Books
          </h2>

          <p>
            Track issued, overdue, and returned books.
          </p>

        </div>


        <button
          className="primary-action-button"
          onClick={() =>
            navigate("/circulation/issue")
          }
        >
          + Issue Book
        </button>

      </div>


      {/* Summary Cards */}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >

          <div className="data-card">
            <div style={{ padding: "20px" }}>
              <span className="management-eyebrow">
                Records
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {totalCount}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Total circulation records
              </p>
            </div>
          </div>


          <div className="data-card">
            <div style={{ padding: "20px" }}>
              <span className="management-eyebrow">
                Issued
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {issuedCount}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Currently issued
              </p>
            </div>
          </div>


          <div className="data-card">
            <div style={{ padding: "20px" }}>
              <span className="management-eyebrow">
                Overdue
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {overdueCount}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Requires attention
              </p>
            </div>
          </div>


          <div className="data-card">
            <div style={{ padding: "20px" }}>
              <span className="management-eyebrow">
                Returned
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {returnedCount}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Completed returns
              </p>
            </div>
          </div>

        </div>
      )}


      {/* Loading */}

      {loading && (
        <div className="management-loading">
          Loading circulation records...
        </div>
      )}


      {/* Error */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* Empty State */}

      {!loading &&
        !error &&
        records.length === 0 && (

          <div className="empty-state">

            <div className="empty-state-icon">
              📖
            </div>

            <h3>
              No circulation records
            </h3>

            <p>
              No books have been issued yet.
            </p>

            <button
              className="primary-action-button"
              onClick={() =>
                navigate("/circulation/issue")
              }
              style={{
                marginTop: "16px",
              }}
            >
              + Issue First Book
            </button>

          </div>
        )}


      {/* Records Table */}

      {!loading &&
        records.length > 0 && (

          <div className="data-card">

            <div className="table-scroll">

              <table className="management-table">

                <thead>

                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>


                <tbody>

                  {records.map((record) => (

                    <tr key={record.id}>

                      {/* Book */}

                      <td>

                        <div className="book-table-info">

                          <div className="book-table-icon">
                            📖
                          </div>

                          <div>

                            <strong>
                              {record.book_title ||
                                `Book #${record.book}`}
                            </strong>

                            <span>
                              {record.barcode ||
                                `Book ID: ${record.book}`}
                            </span>

                            <span>
                              Issue #{record.id}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* Member */}

                      <td>

                        <span className="number-badge">
                          Member #{record.member}
                        </span>

                      </td>


                      {/* Issue Date */}

                      <td>
                        {formatDate(
                          record.issue_date
                        )}
                      </td>


                      {/* Due Date */}

                      <td>
                        {formatDate(
                          record.due_date
                        )}
                      </td>


                      {/* Return Date */}

                      <td>
                        {formatDate(
                          record.return_date
                        )}
                      </td>


                      {/* Status */}

                      <td>

                        <span
                          className={getStatusClass(
                            record.status
                          )}
                        >
                          {getStatusLabel(
                            record.status
                          )}
                        </span>

                      </td>


                      {/* Actions */}

                      <td>

                        {record.status !== "RETURNED" ? (

                          <button
                            className="table-action return"
                            onClick={() =>
                              handleReturn(
                                record.id
                              )
                            }
                            disabled={
                              returningId ===
                              record.id
                            }
                          >
                            {returningId ===
                            record.id
                              ? "Returning..."
                              : "Return"}
                          </button>

                        ) : (

                          <span className="completed-label">
                            Completed
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* Footer */}

            <div className="table-footer">

              <span>
                Page {page}
              </span>


              <div className="pagination">

                <button
                  onClick={() =>
                    loadRecords(page - 1)
                  }
                  disabled={!previousPage}
                >
                  ← Previous
                </button>


                <button
                  onClick={() =>
                    loadRecords(page + 1)
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


export default Circulation;