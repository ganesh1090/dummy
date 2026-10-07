import { useEffect, useState } from "react";

import {
  getInventory,
  updateInventory,
} from "../services/inventoryService";


function Inventory() {
  const [items, setItems] = useState([]);

  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);


  const loadInventory = async (
    pageNumber = 1
  ) => {
    setLoading(true);
    setError("");

    try {
      const data = await getInventory(
        pageNumber,
        10
      );

      setItems(data.results || []);

      setPage(pageNumber);
      setNextPage(data.next);
      setPreviousPage(data.previous);

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadInventory(1);
  }, []);


  const handleChange = (
    itemId,
    field,
    value
  ) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };


  const handleSave = async (item) => {
    setSavingId(item.id);
    setError("");

    try {
      const updated =
        await updateInventory(
          item.id,
          {
            total_quantity: Number(
              item.total_quantity
            ),
            available_quantity: Number(
              item.available_quantity
            ),
            issued_quantity: Number(
              item.issued_quantity
            ),
            damaged_quantity: Number(
              item.damaged_quantity
            ),
            lost_quantity: Number(
              item.lost_quantity
            ),
          }
        );

      setItems((previous) =>
        previous.map((current) =>
          current.id === item.id
            ? updated
            : current
        )
      );

      setEditingId(null);

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
          "Failed to update inventory."
        );
      }

    } finally {
      setSavingId(null);
    }
  };


  return (
    <div className="management-page">

      <div className="management-header">

        <div>

          <span className="management-eyebrow">
            Library
          </span>

          <h2>
            Inventory Management
          </h2>

          <p>
            Monitor stock levels and inventory quantities.
          </p>

        </div>

      </div>


      {loading && (
        <div className="management-loading">
          Loading inventory...
        </div>
      )}


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {!loading &&
        !error &&
        items.length === 0 && (
          <div className="empty-state">

            <div className="empty-state-icon">
              📦
            </div>

            <h3>
              No inventory records
            </h3>

            <p>
              Inventory records will appear here.
            </p>

          </div>
        )}


      {!loading &&
        items.length > 0 && (

        <div className="data-card">

          <div className="table-scroll">

            <table className="management-table">

              <thead>

                <tr>
                  <th>Book</th>
                  <th>Total</th>
                  <th>Available</th>
                  <th>Issued</th>
                  <th>Damaged</th>
                  <th>Lost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {items.map((item) => {

                  const available =
                    Number(
                      item.available_quantity
                    ) || 0;

                  const total =
                    Number(
                      item.total_quantity
                    ) || 0;

                  const lowStock =
                    total > 0 &&
                    available <=
                      Math.ceil(
                        total * 0.2
                      );

                  const isEditing =
                    editingId === item.id;

                  return (
                    <tr key={item.id}>

                      <td>

                        <div className="book-table-info">

                          <div className="book-table-icon">
                            📦
                          </div>

                          <div>

                            <strong>
                              {item.book}
                            </strong>

                            <span>
                              Inventory #{item.id}
                            </span>

                          </div>

                        </div>

                      </td>


                      <td>
                        <span className="number-badge">
                          {item.total_quantity}
                        </span>
                      </td>


                      <td>
                        <span
                          className={
                            lowStock
                              ? "number-badge low-stock"
                              : "number-badge available"
                          }
                        >
                          {item.available_quantity}
                        </span>
                      </td>


                      <td>
                        <span className="number-badge">
                          {item.issued_quantity}
                        </span>
                      </td>


                      <td>
                        <span className="number-badge warning">
                          {item.damaged_quantity}
                        </span>
                      </td>


                      <td>
                        <span className="number-badge unavailable">
                          {item.lost_quantity}
                        </span>
                      </td>


                      <td>

                        <span
                          className={
                            lowStock
                              ? "status-badge overdue"
                              : "status-badge active"
                          }
                        >
                          {lowStock
                            ? "Low Stock"
                            : "Healthy"}
                        </span>

                      </td>


                      <td>

                        {!isEditing ? (

                          <button
                            className="table-action edit"
                            onClick={() =>
                              setEditingId(
                                item.id
                              )
                            }
                          >
                            Edit
                          </button>

                        ) : (

                          <div className="inventory-edit-actions">

                            <button
                              className="table-action save"
                              onClick={() =>
                                handleSave(item)
                              }
                              disabled={
                                savingId ===
                                item.id
                              }
                            >
                              {savingId ===
                              item.id
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              className="table-action cancel"
                              onClick={() =>
                                setEditingId(null)
                              }
                              disabled={
                                savingId ===
                                item.id
                              }
                            >
                              Cancel
                            </button>

                          </div>

                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>


          {editingId !== null && (
            <div className="inventory-edit-panel">

              <p>
                Editing inventory values for the
                selected record.
              </p>

              {items
                .filter(
                  (item) =>
                    item.id === editingId
                )
                .map((item) => (

                  <div
                    className="inventory-inline-form"
                    key={item.id}
                  >

                    <div>
                      <label>
                        Total
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          item.total_quantity
                        }
                        onChange={(event) =>
                          handleChange(
                            item.id,
                            "total_quantity",
                            event.target.value
                          )
                        }
                      />
                    </div>


                    <div>
                      <label>
                        Available
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          item.available_quantity
                        }
                        onChange={(event) =>
                          handleChange(
                            item.id,
                            "available_quantity",
                            event.target.value
                          )
                        }
                      />
                    </div>


                    <div>
                      <label>
                        Issued
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          item.issued_quantity
                        }
                        onChange={(event) =>
                          handleChange(
                            item.id,
                            "issued_quantity",
                            event.target.value
                          )
                        }
                      />
                    </div>


                    <div>
                      <label>
                        Damaged
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          item.damaged_quantity
                        }
                        onChange={(event) =>
                          handleChange(
                            item.id,
                            "damaged_quantity",
                            event.target.value
                          )
                        }
                      />
                    </div>


                    <div>
                      <label>
                        Lost
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          item.lost_quantity
                        }
                        onChange={(event) =>
                          handleChange(
                            item.id,
                            "lost_quantity",
                            event.target.value
                          )
                        }
                      />
                    </div>

                  </div>

                ))}

            </div>
          )}


          <div className="table-footer">

            <span>
              Page {page}
            </span>


            <div className="pagination">

              <button
                onClick={() =>
                  loadInventory(
                    page - 1
                  )
                }
                disabled={
                  !previousPage
                }
              >
                ← Previous
              </button>


              <button
                onClick={() =>
                  loadInventory(
                    page + 1
                  )
                }
                disabled={
                  !nextPage
                }
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


export default Inventory;