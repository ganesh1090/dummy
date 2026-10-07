import { useEffect, useState } from "react";

import { getDashboardSummary } from "../services/reportService";


function Reports() {
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadReports = async () => {
      try {
        const data =
          await getDashboardSummary();

        setSummary(data);

      } catch (error) {
        setError(
          error.response?.data?.detail ||
          "Failed to load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);


  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-circle" />

        <p>
          Loading reports...
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


  const totalBooks =
    summary?.total_books ?? 0;

  const totalMembers =
    summary?.total_members ?? 0;

  const issuedBooks =
    summary?.issued_books ?? 0;

  const overdueBooks =
    summary?.overdue_books ?? 0;

  const pendingFines =
    summary?.pending_fines ?? 0;

  const paidFines =
    summary?.paid_fines ?? 0;


  return (
    <div className="management-page">

      <div className="management-header">

        <div>

          <span className="management-eyebrow">
            Analytics
          </span>

          <h2>
            Reports &amp; Analytics
          </h2>

          <p>
            Get a quick overview of your library performance.
          </p>

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="report-kpi-grid">

        <div className="report-kpi-card purple">
          <div className="report-kpi-icon">
            📚
          </div>

          <div>
            <span>
              Total Books
            </span>

            <strong>
              {totalBooks}
            </strong>
          </div>
        </div>


        <div className="report-kpi-card blue">
          <div className="report-kpi-icon">
            👥
          </div>

          <div>
            <span>
              Total Members
            </span>

            <strong>
              {totalMembers}
            </strong>
          </div>
        </div>


        <div className="report-kpi-card orange">
          <div className="report-kpi-icon">
            📖
          </div>

          <div>
            <span>
              Issued Books
            </span>

            <strong>
              {issuedBooks}
            </strong>
          </div>
        </div>


        <div className="report-kpi-card red">
          <div className="report-kpi-icon">
            ⏰
          </div>

          <div>
            <span>
              Overdue Books
            </span>

            <strong>
              {overdueBooks}
            </strong>
          </div>
        </div>

      </div>


      {/* ACTIVITY OVERVIEW */}

      <div className="reports-main-grid">

        <section className="report-panel">

          <div className="report-panel-header">

            <div>
              <h3>
                Circulation Overview
              </h3>

              <p>
                Current book circulation status.
              </p>
            </div>

          </div>


          <div className="circulation-report">

            <div className="report-progress-row">

              <div className="report-progress-label">
                <span>
                  Available Books
                </span>

                <strong>
                  {Math.max(
                    totalBooks -
                      issuedBooks,
                    0
                  )}
                </strong>
              </div>

              <div className="report-progress-track">

                <div
                  className="report-progress-fill available-fill"
                  style={{
                    width:
                      totalBooks > 0
                        ? `${Math.min(
                            Math.max(
                              ((totalBooks -
                                issuedBooks) /
                                totalBooks) *
                                100,
                              0
                            ),
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>


            <div className="report-progress-row">

              <div className="report-progress-label">
                <span>
                  Issued Books
                </span>

                <strong>
                  {issuedBooks}
                </strong>
              </div>

              <div className="report-progress-track">

                <div
                  className="report-progress-fill issued-fill"
                  style={{
                    width:
                      totalBooks > 0
                        ? `${Math.min(
                            Math.max(
                              (issuedBooks /
                                totalBooks) *
                                100,
                              0
                            ),
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>


            <div className="report-progress-row">

              <div className="report-progress-label">
                <span>
                  Overdue
                </span>

                <strong>
                  {overdueBooks}
                </strong>
              </div>

              <div className="report-progress-track">

                <div
                  className="report-progress-fill overdue-fill"
                  style={{
                    width:
                      totalBooks > 0
                        ? `${Math.min(
                            Math.max(
                              (overdueBooks /
                                totalBooks) *
                                100,
                              0
                            ),
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </section>


        {/* FINES */}

        <section className="report-panel">

          <div className="report-panel-header">

            <div>
              <h3>
                Fines Summary
              </h3>

              <p>
                Current fine payment status.
              </p>
            </div>

          </div>


          <div className="fine-summary-grid">

            <div className="fine-summary pending">

              <span>
                Pending
              </span>

              <strong>
                {pendingFines}
              </strong>

            </div>


            <div className="fine-summary paid">

              <span>
                Paid
              </span>

              <strong>
                {paidFines}
              </strong>

            </div>

          </div>


          <div className="report-note">
            Keep pending fines under review to maintain
            healthy circulation and member accounts.
          </div>

        </section>

      </div>

    </div>
  );
}


export default Reports;