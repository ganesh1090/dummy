import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { logoutUser } from "../services/authService";


function MainLayout() {
  const navigate = useNavigate();

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;


  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    }
  };


  const getNavClass = ({ isActive }) =>
    isActive
      ? "app-nav-link active"
      : "app-nav-link";


  return (
    <div className="modern-app-layout">

      <aside className="modern-sidebar">

        <div className="modern-brand">

          <div className="modern-brand-logo">
            📚
          </div>

          <div>
            <h2>LibraryOS</h2>
            <p>Management System</p>
          </div>

        </div>


        <nav className="modern-sidebar-nav">

          <div className="nav-section-title">
            MAIN
          </div>


          <NavLink
            to="/dashboard"
            className={getNavClass}
          >
            <span className="nav-icon">
              ▦
            </span>

            <span>
              Dashboard
            </span>
          </NavLink>


          <NavLink
            to="/books"
            className={getNavClass}
          >
            <span className="nav-icon">
              📚
            </span>

            <span>
              Books
            </span>
          </NavLink>


          <NavLink
            to="/members"
            className={getNavClass}
          >
            <span className="nav-icon">
              👥
            </span>

            <span>
              Members
            </span>
          </NavLink>


          {/* =================================================
              BRANCHES
              ================================================= */}

          <NavLink
            to="/branches"
            className={getNavClass}
          >
            <span className="nav-icon">
              🏢
            </span>

            <span>
              Branches
            </span>
          </NavLink>


          <NavLink
            to="/circulation"
            className={getNavClass}
          >
            <span className="nav-icon">
              🔄
            </span>

            <span>
              Circulation
            </span>
          </NavLink>


          <NavLink
            to="/inventory"
            className={getNavClass}
          >
            <span className="nav-icon">
              📦
            </span>

            <span>
              Inventory
            </span>
          </NavLink>


          <div className="nav-section-title nav-section-spacing">
            MANAGEMENT
          </div>


          <NavLink
            to="/fines"
            className={getNavClass}
          >
            <span className="nav-icon">
              💰
            </span>

            <span>
              Fines
            </span>
          </NavLink>


          <NavLink
            to="/reports"
            className={getNavClass}
          >
            <span className="nav-icon">
              📊
            </span>

            <span>
              Reports
            </span>
          </NavLink>

        </nav>


        <div className="modern-sidebar-bottom">

          <div className="modern-user-mini">

            <div className="modern-avatar">
              {(user?.username || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="modern-user-mini-info">

              <strong>
                {user?.username || "User"}
              </strong>

              <span>
                {user?.email || "Library User"}
              </span>

            </div>

          </div>


          <button
            className="modern-logout-button"
            onClick={handleLogout}
          >
            <span>
              ↪
            </span>

            Logout
          </button>

        </div>

      </aside>


      <main className="modern-main">

        <header className="modern-topbar">

          <div className="modern-page-heading">

            <span>
              Library Management
            </span>

            <h1>
              Welcome back,{" "}
              {user?.username || "User"} 👋
            </h1>

          </div>


          <div className="modern-topbar-actions">

            <button
              className="topbar-icon-button"
              type="button"
              title="Search"
            >
              🔍
            </button>

            <button
              className="topbar-icon-button"
              type="button"
              title="Notifications"
            >
              🔔
            </button>


            <div className="topbar-divider" />


            <div className="topbar-profile">

              <div className="topbar-avatar">
                {(user?.username || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="topbar-profile-info">

                <strong>
                  {user?.username || "User"}
                </strong>

                <span>
                  {user?.is_staff
                    ? "Staff"
                    : "Library User"}
                </span>

              </div>

            </div>

          </div>

        </header>


        <section className="modern-page-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}


export default MainLayout;