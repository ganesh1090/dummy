import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMembers } from "../services/memberService";


function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadMembers = async (
    pageNumber = 1
  ) => {
    setLoading(true);
    setError("");

    try {
      const data = await getMembers(
        pageNumber,
        10
      );

      let results = data.results || [];

      if (search.trim()) {
        const term = search.toLowerCase();

        results = results.filter(
          (member) =>
            String(member.member_id || "")
              .toLowerCase()
              .includes(term) ||

            String(member.user || "")
              .toLowerCase()
              .includes(term) ||

            String(member.phone || "")
              .toLowerCase()
              .includes(term)
        );
      }

      setMembers(results);

      setPage(pageNumber);

      setNextPage(data.next);
      setPreviousPage(data.previous);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load members."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadMembers(1);
  }, []);


  const handleSearch = (event) => {
    event.preventDefault();

    loadMembers(1);
  };


  return (
    <div className="management-page">

      <div className="management-header">

        <div>

          <span className="management-eyebrow">
            Library
          </span>

          <h2>
            Members Management
          </h2>

          <p>
            Manage registered library members.
          </p>

        </div>


        <button
          className="primary-action-button"
          onClick={() =>
            navigate("/members/add")
          }
        >
          + Add Member
        </button>

      </div>


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
            placeholder="Search by member ID, user or phone..."
          />

          <button type="submit">
            Search
          </button>

        </form>

      </div>


      {loading && (
        <div className="management-loading">
          Loading members...
        </div>
      )}


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {!loading &&
        !error &&
        members.length === 0 && (
          <div className="empty-state">

            <div className="empty-state-icon">
              👥
            </div>

            <h3>
              No members found
            </h3>

            <p>
              Try another search or add a new member.
            </p>

          </div>
        )}


      {!loading &&
        members.length > 0 && (

        <div className="data-card">

          <div className="table-scroll">

            <table className="management-table">

              <thead>

                <tr>
                  <th>Member</th>
                  <th>User ID</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {members.map((member) => (

                  <tr key={member.id}>

                    <td>

                      <div className="book-table-info">

                        <div className="member-table-avatar">
                          {String(
                            member.member_id || "M"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {member.member_id}
                          </strong>

                          <span>
                            Member #{member.id}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      <span className="number-badge">
                        {member.user}
                      </span>

                    </td>


                    <td>
                      {member.phone || "N/A"}
                    </td>


                    <td>

                      <span className="member-address">
                        {member.address || "N/A"}
                      </span>

                    </td>


                    <td>

                      <span
                        className={
                          member.is_active
                            ? "status-badge active"
                            : "status-badge inactive"
                        }
                      >
                        {member.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>


                    <td>

                      <div className="table-actions">

                        <button
                          className="icon-action view-icon"
                          onClick={() =>
                            navigate(
                              `/members/${member.id}`
                            )
                          }
                          title="View member"
                          aria-label="View member"
                        >
                          👁
                        </button>


                        <button
                          className="icon-action edit-icon"
                          onClick={() =>
                            navigate(
                              `/members/${member.id}/edit`
                            )
                          }
                          title="Edit member"
                          aria-label="Edit member"
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


          <div className="table-footer">

            <span>
              Page {page}
            </span>


            <div className="pagination">

              <button
                onClick={() =>
                  loadMembers(
                    page - 1
                  )
                }
                disabled={!previousPage}
              >
                ← Previous
              </button>


              <button
                onClick={() =>
                  loadMembers(
                    page + 1
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


export default Members;