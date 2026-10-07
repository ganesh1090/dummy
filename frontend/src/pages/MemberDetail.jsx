import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getMember,
  deleteMember,
} from "../services/memberService";


function MemberDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");


  useEffect(() => {
    const loadMember = async () => {
      try {
        const data = await getMember(
          memberId
        );

        setMember(data);

      } catch (error) {
        setError(
          error.response?.data?.detail ||
          "Failed to load member."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [memberId]);


  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this member?"
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteMember(memberId);

      navigate("/members");

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to delete member."
      );

      setDeleting(false);
    }
  };


  if (loading) {
    return (
      <div className="dashboard-loader">

        <div className="loader-circle" />

        <p>
          Loading member details...
        </p>

      </div>
    );
  }


  if (error && !member) {
    return (
      <div className="error-message">
        {error}
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
            Member Details
          </h2>

          <p>
            View complete information about this member.
          </p>

        </div>


        <div className="detail-actions">

          <button
            className="detail-button back"
            onClick={() =>
              navigate("/members")
            }
          >
            ← Back to Members
          </button>


          <button
            className="detail-button edit"
            onClick={() =>
              navigate(
                `/members/${member.id}/edit`
              )
            }
          >
            Edit Member
          </button>


          <button
            className="detail-button delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete Member"}
          </button>

        </div>

      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* Member Detail Card */}

      <div className="detail-card">

        <div className="member-detail-top">

          <div className="member-detail-avatar">
            {String(
              member.member_id || "M"
            )
              .charAt(0)
              .toUpperCase()}
          </div>


          <div className="member-detail-title">

            <h1>
              {member.member_id}
            </h1>

            <p>
              Member #{member.id}
            </p>

          </div>

        </div>


        <div className="detail-info-grid">

          <div className="detail-info-item">

            <span>
              User
            </span>

            <strong>
              {member.user || "N/A"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Phone
            </span>

            <strong>
              {member.phone || "N/A"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Address
            </span>

            <strong>
              {member.address || "N/A"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Date of Birth
            </span>

            <strong>
              {member.date_of_birth ||
                "N/A"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Membership Date
            </span>

            <strong>
              {member.membership_date ||
                "N/A"}
            </strong>

          </div>


          <div className="detail-info-item">

            <span>
              Status
            </span>

            <strong>

              <span
                className={
                  member.is_active
                    ? "detail-status active"
                    : "detail-status inactive"
                }
              >
                {member.is_active
                  ? "Active"
                  : "Inactive"}
              </span>

            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}


export default MemberDetail;