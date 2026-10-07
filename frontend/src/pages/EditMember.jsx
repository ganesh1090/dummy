import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getMember,
  updateMember,
} from "../services/memberService";


function EditMember() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: "",
    member_id: "",
    phone: "",
    address: "",
    date_of_birth: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadMember = async () => {
      try {
        const member = await getMember(memberId);

        setFormData({
          user: member.user || "",
          member_id: member.member_id || "",
          phone: member.phone || "",
          address: member.address || "",
          date_of_birth:
            member.date_of_birth || "",
          is_active: member.is_active,
        });

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


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await updateMember(
        memberId,
        {
          ...formData,
          user: Number(formData.user),
        }
      );

      navigate(`/members/${memberId}`);

    } catch (error) {
      const data = error.response?.data;

      if (
        data &&
        typeof data === "object"
      ) {
        setError(
          Object.entries(data)
            .map(
              ([field, message]) =>
                `${field}: ${
                  Array.isArray(message)
                    ? message.join(", ")
                    : message
                }`
            )
            .join(" | ")
        );
      } else {
        setError(
          "Failed to update member."
        );
      }

    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="dashboard-loader">

        <div className="loader-circle" />

        <p>
          Loading member...
        </p>

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
            Edit Member
          </h2>

          <p>
            Update the information for this member.
          </p>

        </div>


        <div className="detail-actions">

          <button
            type="button"
            className="detail-button back"
            onClick={() =>
              navigate(
                `/members/${memberId}`
              )
            }
          >
            ← Back to Member
          </button>

        </div>

      </div>


      {/* Form Card */}

      <div className="detail-card">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="edit-form"
        >

          <div className="edit-form-grid">

            {/* User ID */}

            <div className="edit-field">

              <label htmlFor="user">
                User ID
              </label>

              <input
                id="user"
                type="number"
                name="user"
                value={formData.user}
                onChange={handleChange}
                placeholder="Enter user ID"
                required
              />

            </div>


            {/* Member ID */}

            <div className="edit-field">

              <label htmlFor="member_id">
                Member ID
              </label>

              <input
                id="member_id"
                name="member_id"
                value={
                  formData.member_id
                }
                onChange={handleChange}
                placeholder="Enter member ID"
                required
              />

            </div>


            {/* Phone */}

            <div className="edit-field">

              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

            </div>


            {/* Date of Birth */}

            <div className="edit-field">

              <label htmlFor="date_of_birth">
                Date of Birth
              </label>

              <input
                id="date_of_birth"
                type="date"
                name="date_of_birth"
                value={
                  formData.date_of_birth
                }
                onChange={handleChange}
              />

            </div>


            {/* Address */}

            <div className="edit-field full-width">

              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={
                  formData.address
                }
                onChange={handleChange}
                placeholder="Enter member address..."
                rows="5"
              />

            </div>


            {/* Status */}

            <div className="edit-field">

              <label>
                Member Status
              </label>

              <label className="active-toggle">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    formData.is_active
                  }
                  onChange={handleChange}
                />

                <span>
                  Active
                </span>

              </label>

            </div>

          </div>


          {/* Actions */}

          <div className="edit-form-actions">

            <button
              type="button"
              className="detail-button back"
              onClick={() =>
                navigate(
                  `/members/${memberId}`
                )
              }
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="detail-button edit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


export default EditMember;