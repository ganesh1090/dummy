import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import OPAC from "./pages/OPAC/OPAC";

import Dashboard from "./pages/Dashboard";

import Books from "./pages/Books";
import AddBook from "./pages/AddBook";
import BookDetail from "./pages/BookDetail";
import EditBook from "./pages/EditBook";

import Members from "./pages/Members";
import AddMember from "./pages/AddMember";
import MemberDetail from "./pages/MemberDetail";
import EditMember from "./pages/EditMember";

import Branches from "./pages/Branches";

import Circulation from "./pages/Circulation";
import IssueBook from "./pages/IssueBook";

import Inventory from "./pages/Inventory";

import Fines from "./pages/Fines";

import Reports from "./pages/Reports";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC
            ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* =================================================
            OPAC - PUBLIC LIBRARY CATALOGUE
            No login required
            ================================================= */}

        <Route
          path="/opac"
          element={<OPAC />}
        />


        {/* =================================================
            PROTECTED APPLICATION
            ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            {/* Dashboard */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* =================================================
                BOOKS
                ================================================= */}

            <Route
              path="/books"
              element={<Books />}
            />

            <Route
              path="/books/add"
              element={<AddBook />}
            />

            <Route
              path="/books/:bookId"
              element={<BookDetail />}
            />

            <Route
              path="/books/:bookId/edit"
              element={<EditBook />}
            />


            {/* =================================================
                MEMBERS
                ================================================= */}

            <Route
              path="/members"
              element={<Members />}
            />

            <Route
              path="/members/add"
              element={<AddMember />}
            />

            <Route
              path="/members/:memberId"
              element={<MemberDetail />}
            />

            <Route
              path="/members/:memberId/edit"
              element={<EditMember />}
            />


            {/* =================================================
                BRANCHES
                ================================================= */}

            <Route
              path="/branches"
              element={<Branches />}
            />


            {/* =================================================
                CIRCULATION
                ================================================= */}

            <Route
              path="/circulation"
              element={<Circulation />}
            />

            <Route
              path="/circulation/issue"
              element={<IssueBook />}
            />


            {/* =================================================
                INVENTORY
                ================================================= */}

            <Route
              path="/inventory"
              element={<Inventory />}
            />


            {/* =================================================
                FINES
                ================================================= */}

            <Route
              path="/fines"
              element={<Fines />}
            />


            {/* =================================================
                REPORTS
                ================================================= */}

            <Route
              path="/reports"
              element={<Reports />}
            />

          </Route>

        </Route>


        {/* =================================================
            FALLBACK
            ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;