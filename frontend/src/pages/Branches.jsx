import { useEffect, useState } from "react";

import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../services/branchService";


function Branches() {
  const [branches, setBranches] = useState([]);

  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [branchName, setBranchName] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editingName, setEditingName] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");


  const loadBranches = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBranches();

      setBranches(
        Array.isArray(data)
          ? data
          : data.results || []
      );

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load branches."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadBranches();
  }, []);


  const filteredBranches = branches.filter(
    (branch) => {
      const term = search
        .trim()
        .toLowerCase();

      if (!term) {
        return true;
      }

      return (
        String(branch.id || "")
          .toLowerCase()
          .includes(term) ||

        String(branch.name || "")
          .toLowerCase()
          .includes(term)
      );
    }
  );


  const handleCreate = async (event) => {
    event.preventDefault();

    if (!branchName.trim()) {
      setError("Branch name is required.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");

    try {
      await createBranch({
        name: branchName.trim(),
      });

      setBranchName("");
      setShowAddForm(false);

      setMessage(
        "Branch created successfully."
      );

      await loadBranches();

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to create branch."
      );
    }
  };


  const handleUpdate = async (branchId) => {
    if (!editingName.trim()) {
      setError("Branch name is required.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");

    try {
      await updateBranch(
        branchId,
        {
          name: editingName.trim(),
        }
      );

      setEditingId(null);
      setEditingName("");

      setMessage(
        "Branch updated successfully."
      );

      await loadBranches();

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to update branch."
      );
    }
  };


  const handleDelete = async (branchId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this branch?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteBranch(branchId);

      setMessage(
        "Branch deleted successfully."
      );

      await loadBranches();

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to delete branch."
      );
    }
  };


  const handleSearch = (event) => {
    event.preventDefault();
  };


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
            Branch Management
          </h2>

          <p>
            Manage library branches.
          </p>

        </div>


        <button
          className="primary-action-button"
          onClick={() => {
            setShowAddForm(
              !showAddForm
            );

            setError("");
            setMessage("");
          }}
        >
          {showAddForm
            ? "Cancel"
            : "+ Add Branch"}
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
            placeholder="Search by branch ID or name..."
          />

          <button type="submit">
            Search
          </button>

        </form>

      </div>


      {/* =================================================
          ADD BRANCH FORM
          ================================================= */}

      {showAddForm && (

        <div className="data-card branch-form-card">

          <form onSubmit={handleCreate}>

            <div className="form-group">

              <label htmlFor="branch-name">
                Branch Name
              </label>

              <input
                id="branch-name"
                type="text"
                value={branchName}
                onChange={(event) =>
                  setBranchName(
                    event.target.value
                  )
                }
                placeholder="Enter branch name..."
                autoFocus
              />

            </div>


            <div className="branch-form-actions">

              <button
                type="submit"
                className="primary-action-button"
              >
                Create Branch
              </button>

              <button
                type="button"
                className="secondary-action-button"
                onClick={() => {
                  setShowAddForm(false);
                  setBranchName("");
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =================================================
          MESSAGES
          ================================================= */}

      {message && (

        <div className="success-message">
          {message}
        </div>

      )}


      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* =================================================
          LOADING
          ================================================= */}

      {loading && (

        <div className="management-loading">
          Loading branches...
        </div>

      )}


      {/* =================================================
          EMPTY STATE
          ================================================= */}

      {!loading &&
        !error &&
        filteredBranches.length === 0 && (

        <div className="empty-state">

          <div className="empty-state-icon">
            Branch
          </div>

          <h3>
            No branches found
          </h3>

          <p>
            {search.trim()
              ? "Try another search."
              : "Add your first library branch."}
          </p>

        </div>

      )}


      {/* =================================================
          BRANCH TABLE
          ================================================= */}

      {!loading &&
        filteredBranches.length > 0 && (

        <div className="data-card">

          <div className="table-scroll">

            <table className="management-table">

              <thead>

                <tr>

                  <th>
                    Branch
                  </th>

                  <th>
                    Branch Name
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Created At
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredBranches.map(
                  (branch) => (

                  <tr key={branch.id}>

                    {/* Branch ID */}

                    <td>

                      <div className="book-table-info">

                        <div className="member-table-avatar">
                          🏢
                        </div>

                        <div>

                          <strong>
                            {branch.id}
                          </strong>

                          <span>
                            Library Branch
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* Branch Name */}

                    <td>

                      {editingId === branch.id ? (

                        <input
                          type="text"
                          value={editingName}
                          onChange={(event) =>
                            setEditingName(
                              event.target.value
                            )
                          }
                          autoFocus
                        />

                      ) : (

                        <strong>
                          {branch.name}
                        </strong>

                      )}

                    </td>


                    {/* Status */}

                    <td>

                      <span
                        className={
                          branch.is_active
                            ? "status-badge active"
                            : "status-badge inactive"
                        }
                      >
                        {branch.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>


                    {/* Created At */}

                    <td>

                      <span className="member-address">
                        {branch.created_at
                          ? new Date(
                              branch.created_at
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>

                    </td>


                    {/* Actions */}

                    <td>

                      <div className="table-actions">

                        {editingId === branch.id ? (

                          <>

                            <button
                              className="icon-action edit-icon"
                              onClick={() =>
                                handleUpdate(
                                  branch.id
                                )
                              }
                              title="Save branch"
                              aria-label="Save branch"
                            >
                              Save
                            </button>

                            <button
                              className="icon-action"
                              onClick={() => {
                                setEditingId(null);
                                setEditingName("");
                              }}
                              title="Cancel"
                              aria-label="Cancel"
                            >
                              Cancel
                            </button>

                          </>

                        ) : (

                          <>

                            <button
  className="icon-action edit-icon"
  onClick={() => {
    setEditingId(branch.id);
    setEditingName(branch.name);
    setError("");
    setMessage("");
  }}
  title="Edit branch"
  aria-label="Edit branch"
>
  ✎
</button>

                            <button
  className="icon-action delete-icon"
  onClick={() =>
    handleDelete(branch.id)
  }
  title="Delete branch"
  aria-label="Delete branch"
>
  🗑
</button>

                          </>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* =================================================
              TABLE FOOTER
              ================================================= */}

          <div className="table-footer">

            <span>
              Showing {filteredBranches.length}{" "}
              {filteredBranches.length === 1
                ? "branch"
                : "branches"}
            </span>

          </div>

        </div>

      )}

    </div>
  );
}


export default Branches;