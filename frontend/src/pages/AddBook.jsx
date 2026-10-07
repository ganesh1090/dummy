import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createBook } from "../services/bookService";
import { getTitles,createTitle, } from "../services/titleService";
import { getBranches } from "../services/branchService";


function AddBook() {

  const navigate = useNavigate();

  const [titles, setTitles] = useState([]);
  const [branches, setBranches] = useState([]);

  const [titleMode, setTitleMode] = useState(
    "existing"
  );

  const [loadingData, setLoadingData] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({

    // Existing title
    title_record: "",

    // New title information
    title: "",
    author: "",
    isbn: "",
    media_type: "book",
    category_id: "",
    tags: "",
    description: "",
    publisher: "",
    publication_year: "",

    // Physical copy
    branch: "",
    barcode: "",
    condition: "NEW",
    status: "AVAILABLE",
    quantity: 1,
  });


  useEffect(() => {

    const loadFormData = async () => {

      setLoadingData(true);
      setError("");

      try {

        const [
          titlesData,
          branchesData,
        ] = await Promise.all([
          getTitles(),
          getBranches(),
        ]);

        setTitles(
          Array.isArray(titlesData)
            ? titlesData
            : titlesData.results || []
        );

        setBranches(
          Array.isArray(branchesData)
            ? branchesData
            : branchesData.results || []
        );

      } catch (error) {

        setError(
          error.response?.data?.detail ||
          "Failed to load titles and branches."
        );

      } finally {

        setLoadingData(false);

      }
    };

    loadFormData();

  }, []);


  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  const handleTitleModeChange = (mode) => {

    setTitleMode(mode);

    setError("");

    setFormData((previous) => ({
      ...previous,

      title_record:
        mode === "existing"
          ? previous.title_record
          : "",
    }));

  };


  const selectedTitle = titles.find(
    (title) =>
      String(title.id) ===
      String(formData.title_record)
  );


  const handleSubmit = async (event) => {

    event.preventDefault();

    setLoading(true);
    setError("");

    try {

      /*
       * Existing Title
       */
      if (titleMode === "existing") {

        if (!formData.title_record) {

          setError(
            "Please select an existing title."
          );

          setLoading(false);

          return;
        }

        await createBook({

          title_record:
            formData.title_record,

          branch:
            formData.branch,

          barcode:
            formData.barcode.trim(),

          condition:
            formData.condition,

          status:
            formData.status,

          quantity:
            Number(formData.quantity),

        });

      }

      /*
       * New Title
       *
       * We first create the catalog Title.
       * Then we create the physical Book
       * pointing to that Title.
       */
      else {

        if (!formData.title.trim()) {

          setError(
            "Title is required."
          );

          setLoading(false);

          return;
        }

        if (!formData.author.trim()) {

          setError(
            "Author is required."
          );

          setLoading(false);

          return;
        }

        if (!formData.isbn.trim()) {

          setError(
            "ISBN is required."
          );

          setLoading(false);

          return;
        }

        /*
         * Create Title using the existing
         * Title API directly.
         */
        const titleResponse =
          await createTitle({

            title:
              formData.title.trim(),

            author:
              formData.author.trim(),

            media_type:
              formData.media_type,

            identifiers: {
              isbn:
                formData.isbn.trim(),
            },

            category_id:
              formData.category_id.trim(),

            tags:
              formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),

            description:
              formData.description.trim(),

            publisher:
              formData.publisher.trim(),

            publication_year:
              formData.publication_year
                ? Number(
                    formData.publication_year
                  )
                : null,

            is_active: true,

          });


        /*
         * Title API may return the object
         * directly or inside data.
         */
        const createdTitle =
          titleResponse?.data ||
          titleResponse;


        if (!createdTitle?.id) {

          throw new Error(
            "Title was created but no Title ID was returned."
          );

        }


        /*
         * Now create the physical Book
         * linked to the newly created Title.
         */
        await createBook({

          title_record:
            createdTitle.id,

          branch:
            formData.branch,

          barcode:
            formData.barcode.trim(),

          condition:
            formData.condition,

          status:
            formData.status,

          quantity:
            Number(formData.quantity),

        });

      }


      navigate("/books");

    } catch (error) {

      const data =
        error.response?.data;

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
          error.message ||
          "Failed to create book."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  if (loadingData) {

    return (
      <div className="detail-page">

        <div className="detail-header">

          <div className="detail-header-left">

            <span className="detail-eyebrow">
              Library
            </span>

            <h2>
              Add Physical Book
            </h2>

            <p>
              Add a physical book to your
              library.
            </p>

          </div>

        </div>

        <div className="management-loading">
          Loading titles and branches...
        </div>

      </div>
    );

  }


  return (

    <div className="detail-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="detail-header">

        <div className="detail-header-left">

          <span className="detail-eyebrow">
            Library
          </span>

          <h2>
            Add Book
          </h2>

          <p>
            Add a physical book to your
            library.
          </p>

        </div>


        <div className="detail-actions">

          <button
            type="button"
            className="detail-button back"
            onClick={() =>
              navigate("/books")
            }
            disabled={loading}
          >
            ← Back
          </button>

        </div>

      </div>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* =================================================
          FORM
          ================================================= */}

      <form
        className="detail-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            TITLE SECTION
            ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <h3>
              Title
            </h3>

            <p>
              Select an existing catalog title
              or create a new one.
            </p>

          </div>


          <div className="form-grid">


            {/* TITLE MODE */}

            <div className="form-group full-width">

              <label>
                Title Option
              </label>


              <div className="title-option-buttons">

                <button
                  type="button"
                  className={
                    titleMode === "existing"
                      ? "detail-button primary"
                      : "detail-button back"
                  }
                  onClick={() =>
                    handleTitleModeChange(
                      "existing"
                    )
                  }
                  disabled={loading}
                >
                  Select Existing Title
                </button>


                <button
                  type="button"
                  className={
                    titleMode === "new"
                      ? "detail-button primary"
                      : "detail-button back"
                  }
                  onClick={() =>
                    handleTitleModeChange(
                      "new"
                    )
                  }
                  disabled={loading}
                >
                  Create New Title
                </button>

              </div>

            </div>


            {/* =================================================
                EXISTING TITLE
                ================================================= */}

            {titleMode === "existing" && (

              <>

                <div className="form-group full-width">

                  <label htmlFor="title_record">
                    Existing Title
                  </label>


                  <select
                    id="title_record"
                    name="title_record"
                    value={
                      formData.title_record
                    }
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >

                    <option value="">
                      Select a title
                    </option>


                    {titles
                      .filter(
                        (title) =>
                          title.is_active !== false
                      )
                      .map((title) => (

                        <option
                          key={title.id}
                          value={title.id}
                        >
                          {title.id} —{" "}
                          {title.title}
                        </option>

                      ))}

                  </select>

                </div>


                {selectedTitle && (

                  <div
                    className="form-info-box full-width"
                  >

                    <strong>
                      {selectedTitle.title}
                    </strong>

                    <span>
                      Author:{" "}
                      {selectedTitle.author ||
                        "N/A"}
                    </span>

                    <span>
                      ISBN:{" "}
                      {selectedTitle
                        .identifiers?.isbn ||
                        "N/A"}
                    </span>

                    <span>
                      Media Type:{" "}
                      {selectedTitle.media_type ||
                        "book"}
                    </span>

                  </div>

                )}

              </>

            )}


            {/* =================================================
                CREATE NEW TITLE
                ================================================= */}

            {titleMode === "new" && (

              <>

                {/* Title */}

                <div className="form-group full-width">

                  <label htmlFor="title">
                    Title *
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Harry Potter and the Philosopher's Stone"
                    required
                    disabled={loading}
                  />

                </div>


                {/* Author */}

                <div className="form-group">

                  <label htmlFor="author">
                    Author *
                  </label>

                  <input
                    id="author"
                    name="author"
                    type="text"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="e.g. J. K. Rowling"
                    required
                    disabled={loading}
                  />

                </div>


                {/* ISBN */}

                <div className="form-group">

                  <label htmlFor="isbn">
                    ISBN *
                  </label>

                  <input
                    id="isbn"
                    name="isbn"
                    type="text"
                    value={formData.isbn}
                    onChange={handleChange}
                    placeholder="e.g. 9780747532699"
                    required
                    disabled={loading}
                  />

                </div>


                {/* Media Type */}

                <div className="form-group">

                  <label htmlFor="media_type">
                    Media Type
                  </label>

                  <select
                    id="media_type"
                    name="media_type"
                    value={
                      formData.media_type
                    }
                    onChange={handleChange}
                    disabled={loading}
                  >

                    <option value="book">
                      Book
                    </option>

                    <option value="ebook">
                      E-Book
                    </option>

                    <option value="audiobook">
                      Audiobook
                    </option>

                    <option value="magazine">
                      Magazine
                    </option>

                  </select>

                </div>


                {/* Category */}

                <div className="form-group">

                  <label htmlFor="category_id">
                    Category
                  </label>

                  <input
                    id="category_id"
                    name="category_id"
                    type="text"
                    value={
                      formData.category_id
                    }
                    onChange={handleChange}
                    placeholder="e.g. Fiction / Young Adult"
                    disabled={loading}
                  />

                </div>


                {/* Publisher */}

                <div className="form-group">

                  <label htmlFor="publisher">
                    Publisher
                  </label>

                  <input
                    id="publisher"
                    name="publisher"
                    type="text"
                    value={
                      formData.publisher
                    }
                    onChange={handleChange}
                    placeholder="e.g. Bloomsbury"
                    disabled={loading}
                  />

                </div>


                {/* Publication Year */}

                <div className="form-group">

                  <label htmlFor="publication_year">
                    Publication Year
                  </label>

                  <input
                    id="publication_year"
                    name="publication_year"
                    type="number"
                    min="0"
                    value={
                      formData.publication_year
                    }
                    onChange={handleChange}
                    placeholder="e.g. 1997"
                    disabled={loading}
                  />

                </div>


                {/* Tags */}

                <div className="form-group full-width">

                  <label htmlFor="tags">
                    Tags
                  </label>

                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. fantasy, magic, young adult"
                    disabled={loading}
                  />

                  <small>
                    Separate multiple tags
                    with commas.
                  </small>

                </div>


                {/* Description */}

                <div className="form-group full-width">

                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    placeholder="Enter a short description..."
                    rows="4"
                    disabled={loading}
                  />

                </div>

              </>

            )}

          </div>

        </div>


        {/* =================================================
            PHYSICAL COPY SECTION
            ================================================= */}

        <div className="form-card">

          <div className="form-card-header">

            <h3>
              Physical Copy Details
            </h3>

            <p>
              Add the physical copy to a
              library branch.
            </p>

          </div>


          <div className="form-grid">


            {/* Branch */}

            <div className="form-group">

              <label htmlFor="branch">
                Branch *
              </label>


              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                disabled={loading}
              >

                <option value="">
                  Select a branch
                </option>


                {branches
                  .filter(
                    (branch) =>
                      branch.is_active
                  )
                  .map((branch) => (

                    <option
                      key={branch.id}
                      value={branch.id}
                    >
                      {branch.id} —{" "}
                      {branch.name}
                    </option>

                  ))}

              </select>

            </div>


            {/* Barcode */}

            <div className="form-group">

              <label htmlFor="barcode">
                Barcode *
              </label>

              <input
                id="barcode"
                name="barcode"
                type="text"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="e.g. LIB000235"
                required
                disabled={loading}
              />

            </div>


            {/* Condition */}

            <div className="form-group">

              <label htmlFor="condition">
                Condition
              </label>


              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                disabled={loading}
              >

                <option value="NEW">
                  New
                </option>

                <option value="GOOD">
                  Good
                </option>

                <option value="FAIR">
                  Fair
                </option>

                <option value="POOR">
                  Poor
                </option>

                <option value="DAMAGED">
                  Damaged
                </option>

              </select>

            </div>


            {/* Status */}

            <div className="form-group">

              <label htmlFor="status">
                Status
              </label>


              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >

                <option value="AVAILABLE">
                  Available
                </option>

                <option value="ISSUED">
                  Issued
                </option>

                <option value="RESERVED">
                  Reserved
                </option>

              </select>

            </div>


            {/* Quantity */}

            <div className="form-group">

              <label htmlFor="quantity">
                Quantity
              </label>


              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                disabled={loading}
              />


              <small>
                Each Book row represents
                one physical copy.
              </small>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTIONS
            ================================================= */}

        <div className="detail-form-actions">

          <button
            type="button"
            className="detail-button back"
            onClick={() =>
              navigate("/books")
            }
            disabled={loading}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="detail-button primary"
            disabled={
              loading ||
              !formData.branch ||
              !formData.barcode ||
              (
                titleMode === "existing" &&
                !formData.title_record
              ) ||
              (
                titleMode === "new" &&
                (
                  !formData.title.trim() ||
                  !formData.author.trim() ||
                  !formData.isbn.trim()
                )
              )
            }
          >

            {loading
              ? "Creating..."
              : "Create Book"}

          </button>

        </div>

      </form>

    </div>

  );

}


export default AddBook;