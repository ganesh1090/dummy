import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import api from "../api/axios";


function Dashboard() {
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get(
          "/reports/dashboard/"
        );

        setSummary(response.data);

      } catch (error) {
        setError(
          error.response?.data?.detail ||
          "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);


  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader-circle" />
        <p>Loading dashboard...</p>
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


  const stats = [
    {
      title: "Total Books",
      value: summary?.total_books ?? 0,
      icon: "📚",
      className: "purple",
    },
    {
      title: "Total Members",
      value: summary?.total_members ?? 0,
      icon: "👥",
      className: "blue",
    },
    {
      title: "Issued Books",
      value: summary?.issued_books ?? 0,
      icon: "📖",
      className: "orange",
    },
    {
      title: "Overdue Books",
      value: summary?.overdue_books ?? 0,
      icon: "⏰",
      className: "red",
    },
    {
      title: "Pending Fines",
      value: summary?.pending_fines ?? 0,
      icon: "💰",
      className: "green",
    },
    {
      title: "Paid Fines",
      value: summary?.paid_fines ?? 0,
      icon: "✓",
      className: "teal",
    },
  ];


  return (
    <div className="dashboard-page">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <span className="dashboard-eyebrow">
            Overview
          </span>

          <h2>
            Dashboard
          </h2>

          <p>
            Here's what's happening in your library today.
          </p>
        </div>

      </div>


      {/* Statistics */}

      <div className="dashboard-stats">

        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.title}
          >

            <div
              className={`stat-icon ${stat.className}`}
            >
              {stat.icon}
            </div>

            <div className="stat-content">

              <span className="stat-title">
                {stat.title}
              </span>

              <strong className="stat-value">
                {stat.value}
              </strong>

            </div>

          </div>
        ))}

      </div>


      {/* Quick Actions */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>
            <h3>
              Quick Actions
            </h3>

            <p>
              Jump directly to common library tasks.
            </p>
          </div>

        </div>


        <div className="quick-actions">

          <NavLink
            to="/books/add"
            className="quick-action-card"
          >

            <div className="quick-action-icon purple-bg">
              📚
            </div>

            <div>
              <strong>
                Add Book
              </strong>

              <span>
                Add a new book to the library
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </NavLink>


          <NavLink
            to="/members/add"
            className="quick-action-card"
          >

            <div className="quick-action-icon blue-bg">
              👤
            </div>

            <div>
              <strong>
                Add Member
              </strong>

              <span>
                Register a new library member
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </NavLink>


          <NavLink
            to="/circulation/issue"
            className="quick-action-card"
          >

            <div className="quick-action-icon orange-bg">
              📖
            </div>

            <div>
              <strong>
                Issue Book
              </strong>

              <span>
                Issue a book to a member
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </NavLink>


          <NavLink
            to="/circulation"
            className="quick-action-card"
          >

            <div className="quick-action-icon green-bg">
              🔄
            </div>

            <div>
              <strong>
                View Circulation
              </strong>

              <span>
                Track active and returned books
              </span>
            </div>

            <span className="quick-arrow">
              →
            </span>

          </NavLink>

        </div>

      </section>


      {/* Overview panel */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>
            <h3>
              Library Overview
            </h3>

            <p>
              A quick summary of your current library activity.
            </p>
          </div>

        </div>


        <div className="overview-grid">

          <div className="overview-item">
            <span>
              Books available
            </span>

            <strong>
              {Math.max(
                (summary?.total_books ?? 0) -
                (summary?.issued_books ?? 0),
                0
              )}
            </strong>
          </div>


          <div className="overview-item">
            <span>
              Active circulation
            </span>

            <strong>
              {summary?.issued_books ?? 0}
            </strong>
          </div>


          <div className="overview-item">
            <span>
              Overdue attention
            </span>

            <strong>
              {summary?.overdue_books ?? 0}
            </strong>
          </div>


          <div className="overview-item">
            <span>
              Outstanding fines
            </span>

            <strong>
              {summary?.pending_fines ?? 0}
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}


export default Dashboard;