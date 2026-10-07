import { useEffect, useState } from "react";

import {
  getFines,
  payFine,
} from "../services/fineService";


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


const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const formatAmount = (amount) => {
  const value = Number(amount || 0);

  return `₹${value.toFixed(2)}`;
};


const getStatusClass = (status) => {
  if (status === "PAID") {
    return "status-badge active";
  }

  if (status === "WAIVED") {
    return "status-badge returned";
  }

  return "status-badge overdue";
};


const getStatusLabel = (status) => {
  if (status === "PAID") {
    return "Paid";
  }

  if (status === "WAIVED") {
    return "Waived";
  }

  return "Pending";
};


function Fines() {
  const [fines, setFines] = useState([]);

  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [payingId, setPayingId] = useState(null);


  const loadFines = async (
    pageNumber = 1
  ) => {
    setLoading(true);
    setError("");

    try {
      const data = await getFines(
        pageNumber,
        10
      );

      setFines(data.results || []);

      setTotalCount(
        data.count || 0
      );

      setPage(pageNumber);

      setNextPage(data.next);
      setPreviousPage(data.previous);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load fines."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadFines(1);
  }, []);


  const handlePay = async (fineId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this fine as paid?"
    );

    if (!confirmed) {
      return;
    }

    setPayingId(fineId);
    setError("");

    try {
      await payFine(fineId);

      await loadFines(page);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to pay fine."
      );
    } finally {
      setPayingId(null);
    }
  };


  const pendingCount = fines.filter(
    (fine) => fine.status === "PENDING"
  ).length;

  const paidCount = fines.filter(
    (fine) => fine.status === "PAID"
  ).length;

  const waivedCount = fines.filter(
    (fine) => fine.status === "WAIVED"
  ).length;

  const pendingAmount = fines
    .filter(
      (fine) => fine.status === "PENDING"
    )
    .reduce(
      (total, fine) =>
        total + Number(fine.amount || 0),
      0
    );


  return (
    <div className="management-page">

      {/* Header */}

      <div className="management-header">

        <div>

          <span className="management-eyebrow">
            Finance
          </span>

          <h2>
            Fines Management
          </h2>

          <p>
            Track outstanding and paid library fines.
          </p>

        </div>

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
                Total Fines
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
                All fine records
              </p>

            </div>
          </div>


          <div className="data-card">
            <div style={{ padding: "20px" }}>

              <span className="management-eyebrow">
                Pending
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {pendingCount}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Current page
              </p>

            </div>
          </div>


          <div className="data-card">
            <div style={{ padding: "20px" }}>

              <span className="management-eyebrow">
                Outstanding
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {formatAmount(pendingAmount)}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Current page
              </p>

            </div>
          </div>


          <div className="data-card">
            <div style={{ padding: "20px" }}>

              <span className="management-eyebrow">
                Paid
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {paidCount}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Current page
              </p>

            </div>
          </div>


          <div className="data-card">
            <div style={{ padding: "20px" }}>

              <span className="management-eyebrow">
                Waived
              </span>

              <h3
                style={{
                  margin: "8px 0 0",
                  fontSize: "28px",
                }}
              >
                {waivedCount}
              </h3>

              <p style={{ margin: "4px 0 0" }}>
                Current page
              </p>

            </div>
          </div>

        </div>
      )}


      {/* Loading */}

      {loading && (
        <div className="management-loading">
          Loading fines...
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
        fines.length === 0 && (

          <div className="empty-state">

            <div className="empty-state-icon">
              💰
            </div>

            <h3>
              No fines found
            </h3>

            <p>
              There are currently no fine records.
            </p>

          </div>
        )}


      {/* Fines Table */}

      {!loading &&
        fines.length > 0 && (

          <div className="data-card">

            <div className="table-scroll">

              <table className="management-table">

                <thead>

                  <tr>
                    <th>Fine</th>
                    <th>Issue</th>
                    <th>Amount</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Paid At</th>
                    <th>Action</th>
                  </tr>

                </thead>


                <tbody>

                  {fines.map((fine) => (

                    <tr key={fine.id}>

                      {/* Fine */}

                      <td>

                        <div className="book-table-info">

                          <div className="fine-table-icon">
                            💰
                          </div>

                          <div>

                            <strong>
                              Fine #{fine.id}
                            </strong>

                            <span>
                              Library fine
                            </span>

                            <span>
                              Created{" "}
                              {formatDate(
                                fine.created_at
                              )}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* Issue */}

                      <td>

                        <span className="number-badge">
                          Issue #{fine.issue}
                        </span>

                      </td>


                      {/* Amount */}

                      <td>

                        <strong className="fine-amount">
                          {formatAmount(
                            fine.amount
                          )}
                        </strong>

                      </td>


                      {/* Reason */}

                      <td>
                        {fine.reason || "—"}
                      </td>


                      {/* Status */}

                      <td>

                        <span
                          className={getStatusClass(
                            fine.status
                          )}
                        >
                          {getStatusLabel(
                            fine.status
                          )}
                        </span>

                      </td>


                      {/* Paid At */}

                      <td>
                        {formatDateTime(
                          fine.paid_at
                        )}
                      </td>


                      {/* Action */}

                      <td>

                        {fine.status === "PENDING" ? (

                          <button
                            className="table-action pay"
                            onClick={() =>
                              handlePay(
                                fine.id
                              )
                            }
                            disabled={
                              payingId ===
                              fine.id
                            }
                          >
                            {payingId === fine.id
                              ? "Paying..."
                              : "Mark Paid"}
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
                    loadFines(page - 1)
                  }
                  disabled={!previousPage}
                >
                  ← Previous
                </button>


                <button
                  onClick={() =>
                    loadFines(page + 1)
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


export default Fines;