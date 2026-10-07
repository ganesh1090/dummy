import { useEffect, useState } from "react";

import { getAvailableBooks } from "../services/bookService";

import { getActiveMembers } from "../services/memberService";

import { issueBook } from "../services/circulationService";


const IssueBook = () => {
  // =====================================================
  // DATA
  // =====================================================

  const [allBooks, setAllBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);


  // =====================================================
  // FORM STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");

  const [loanDays, setLoanDays] = useState(14);
  const [notes, setNotes] = useState("");


  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [searchingBooks, setSearchingBooks] = useState(false);
  const [issuing, setIssuing] = useState(false);


  // =====================================================
  // MESSAGE STATE
  // =====================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);


  // =====================================================
  // LOAD BOOKS + MEMBERS
  // =====================================================

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [booksData, membersData] = await Promise.all([
        getAvailableBooks(),
        getActiveMembers(),
      ]);

      const availableBooks = Array.isArray(booksData)
        ? booksData
        : booksData?.results || [];

      const activeMembers = Array.isArray(membersData)
        ? membersData
        : membersData?.results || [];

      // Keep the complete available-copy list.
      setAllBooks(availableBooks);

      // Initially show every available physical copy.
      setBooks(availableBooks);

      setMembers(activeMembers);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to load books and members."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // SEARCH AVAILABLE PHYSICAL COPIES
  // =====================================================

  const searchAvailableBooks = (value) => {
    setSearch(value);

    setSelectedBook(null);
    setError("");
    setSuccess("");

    const query = value.trim().toLowerCase();

    // Empty search = show all available copies.
    if (!query) {
      setBooks(allBooks);
      setSearchingBooks(false);
      return;
    }

    setSearchingBooks(true);

    /*
     * Search across:
     *
     * - Book title
     * - Author
     * - ISBN
     * - Barcode
     * - Branch name
     * - Branch ID
     * - Title ID
     */

    const filteredBooks = allBooks.filter((book) => {
      const title = (
        book.title_name ||
        book.title ||
        ""
      ).toString().toLowerCase();

      const author = (
        book.author ||
        ""
      ).toString().toLowerCase();

      const isbn = (
        book.isbn ||
        ""
      ).toString().toLowerCase();

      const barcode = (
        book.barcode ||
        ""
      ).toString().toLowerCase();

      const branchName = (
        book.branch_name ||
        ""
      ).toString().toLowerCase();

      const branchId = (
        book.branch_id ||
        book.branch ||
        ""
      ).toString().toLowerCase();

      const titleId = (
        book.title_id ||
        book.title_record ||
        ""
      ).toString().toLowerCase();

      return (
        title.includes(query) ||
        author.includes(query) ||
        isbn.includes(query) ||
        barcode.includes(query) ||
        branchName.includes(query) ||
        branchId.includes(query) ||
        titleId.includes(query)
      );
    });

    setBooks(filteredBooks);

    setSearchingBooks(false);
  };


  // =====================================================
  // SELECT PHYSICAL COPY
  // =====================================================

  const handleSelectBook = (book) => {
    setSelectedBook(book);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // ISSUE BOOK
  // =====================================================

  const handleIssue = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    // ---------------------------------------------------
    // Validate physical copy
    // ---------------------------------------------------

    if (!selectedBook) {
      setError(
        "Please select a physical book copy."
      );

      return;
    }


    // ---------------------------------------------------
    // Validate member
    // ---------------------------------------------------

    if (!selectedMember) {
      setError(
        "Please select a member."
      );

      return;
    }


    // ---------------------------------------------------
    // Validate loan period
    // ---------------------------------------------------

    const days = Number(loanDays);

    if (
      !Number.isInteger(days) ||
      days < 1
    ) {
      setError(
        "Loan days must be at least 1."
      );

      return;
    }


    // ---------------------------------------------------
    // Issue exact physical copy
    // ---------------------------------------------------

    try {
      setIssuing(true);

      await issueBook(
        selectedBook.id,
        selectedMember,
        days,
        notes
      );


      // -------------------------------------------------
      // Success
      // -------------------------------------------------

      setSuccess(
        "Book issued successfully."
      );


      // -------------------------------------------------
      // Reset form
      // -------------------------------------------------

      setSelectedBook(null);
      setSelectedMember("");
      setLoanDays(14);
      setNotes("");


      // -------------------------------------------------
      // Remove issued physical copy from available list
      // -------------------------------------------------

      const updatedBooks = allBooks.filter(
        (book) => book.id !== selectedBook.id
      );

      setAllBooks(updatedBooks);


      // Re-apply current search
      const query = search.trim().toLowerCase();

      if (!query) {
        setBooks(updatedBooks);
      } else {
        const filteredBooks = updatedBooks.filter(
          (book) => {
            const title = (
              book.title_name ||
              book.title ||
              ""
            ).toString().toLowerCase();

            const author = (
              book.author ||
              ""
            ).toString().toLowerCase();

            const isbn = (
              book.isbn ||
              ""
            ).toString().toLowerCase();

            const barcode = (
              book.barcode ||
              ""
            ).toString().toLowerCase();

            const branchName = (
              book.branch_name ||
              ""
            ).toString().toLowerCase();

            const branchId = (
              book.branch_id ||
              book.branch ||
              ""
            ).toString().toLowerCase();

            const titleId = (
              book.title_id ||
              book.title_record ||
              ""
            ).toString().toLowerCase();

            return (
              title.includes(query) ||
              author.includes(query) ||
              isbn.includes(query) ||
              barcode.includes(query) ||
              branchName.includes(query) ||
              branchId.includes(query) ||
              titleId.includes(query)
            );
          }
        );

        setBooks(filteredBooks);
      }

    } catch (err) {
      console.error(err);

      const responseData =
        err?.response?.data;

      setError(
        responseData?.detail ||
          responseData?.message ||
          "Unable to issue the book."
      );
    } finally {
      setIssuing(false);
    }
  };


  // =====================================================
  // CLEAR FORM
  // =====================================================

  const handleClear = () => {
    setSelectedBook(null);
    setSelectedMember("");

    setLoanDays(14);
    setNotes("");

    setSearch("");

    setError("");
    setSuccess("");

    // Restore all available physical copies.
    setBooks(allBooks);
  };


  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="page-container">

        <div className="page-header">
          <div>

            <h1>
              Issue Book
            </h1>

            <p>
              Issue an available physical book
              copy to a member.
            </p>

          </div>
        </div>


        <div className="form-card">

          <p>
            Loading...
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="page-container">


      {/* ===============================================
          PAGE HEADER
      =============================================== */}

      <div className="page-header">

        <div>

          <h1>
            Issue Book
          </h1>

          <p>
            Search for a book and select an
            available physical copy to issue.
          </p>

        </div>

      </div>


      {/* ===============================================
          SUCCESS
      =============================================== */}

      {success && (
        <div
          className="success-message"
          role="alert"
        >
          {success}
        </div>
      )}


      {/* ===============================================
          ERROR
      =============================================== */}

      {error && (
        <div
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}


      {/* ===============================================
          MAIN LAYOUT
      =============================================== */}

      <div className="issue-layout">


        {/* =============================================
            INFORMATION CARD
        ============================================= */}

        <div className="issue-info-card">

          <div className="issue-info-icon">
            📚
          </div>


          <h3>
            Issue a Book
          </h3>


          <p>
            Search by book name, ISBN, barcode,
            author or branch and select an
            available physical copy.
          </p>


          <div className="issue-info-list">

            <div>

              <span>
                Available copies
              </span>

              <strong>
                {books.length}
              </strong>

            </div>


            <div>

              <span>
                Active members
              </span>

              <strong>
                {members.length}
              </strong>

            </div>


            <div>

              <span>
                Default loan
              </span>

              <strong>
                14 days
              </strong>

            </div>

          </div>

        </div>


        {/* =============================================
            FORM CARD
        ============================================= */}

        <div className="form-card">

          <form onSubmit={handleIssue}>


            {/* =========================================
                SEARCH
            ========================================= */}

            <div className="form-group">

              <label htmlFor="book-search">
                Search Available Books
              </label>


              <input
                id="book-search"
                type="text"
                value={search}
                onChange={(event) =>
                  searchAvailableBooks(
                    event.target.value
                  )
                }
                placeholder="Search by book name, ISBN, barcode, author or branch..."
              />


              <span className="field-help">

                {searchingBooks
                  ? "Searching available copies..."
                  : "Only available physical copies are shown."}

              </span>

            </div>


            {/* =========================================
                AVAILABLE PHYSICAL COPIES
            ========================================= */}

            <div className="form-group">

              <label>
                Available Physical Copies
              </label>


              {books.length === 0 ? (

                <div className="empty-state">

                  {search.trim()
                    ? "No available physical copies match your search."
                    : "No available physical copies found."}

                </div>

              ) : (

                <div className="book-copy-list">

                  {books.map((book) => {

                    const isSelected =
                      selectedBook?.id === book.id;


                    const title =
                      book.title_name ||
                      book.title ||
                      "Untitled";


                    return (

                      <div
                        key={book.id}
                        onClick={() =>
                          handleSelectBook(book)
                        }
                        className={`book-copy-card ${
                          isSelected
                            ? "selected"
                            : ""
                        }`}
                      >


                        {/* ---------------------------------
                            BOOK HEADER
                        --------------------------------- */}

                        <div className="book-copy-header">

                          <div className="book-copy-main">

                            <strong className="book-copy-title">
                              {title}
                            </strong>


                            <div className="book-copy-details">


                              {book.author && (
                                <span>

                                  <strong>
                                    Author:
                                  </strong>{" "}

                                  {book.author}

                                </span>
                              )}


                              {book.isbn && (
                                <span>

                                  <strong>
                                    ISBN:
                                  </strong>{" "}

                                  {book.isbn}

                                </span>
                              )}


                              {book.barcode && (
                                <span>

                                  <strong>
                                    Barcode:
                                  </strong>{" "}

                                  {book.barcode}

                                </span>
                              )}


                              {book.branch_name && (
                                <span>

                                  <strong>
                                    Branch:
                                  </strong>{" "}

                                  {book.branch_name}

                                </span>
                              )}

                            </div>

                          </div>


                          <span className="status-badge">
                            AVAILABLE
                          </span>

                        </div>


                        {/* ---------------------------------
                            SELECTED
                        --------------------------------- */}

                        {isSelected && (

                          <div className="book-copy-selected">

                            ✓ Selected physical copy

                          </div>

                        )}

                      </div>

                    );

                  })}

                </div>

              )}

            </div>


            {/* =========================================
                SELECTED COPY SUMMARY
            ========================================= */}

            {selectedBook && (

              <div className="selected-book-summary">


                <div>

                  <span>
                    Selected Copy
                  </span>

                  <strong>
                    {
                      selectedBook.title_name ||
                      selectedBook.title ||
                      "Untitled"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Book ID
                  </span>

                  <strong>
                    {selectedBook.id || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    Barcode
                  </span>

                  <strong>
                    {selectedBook.barcode || "—"}
                  </strong>

                </div>


                <div>

                  <span>
                    Branch
                  </span>

                  <strong>
                    {selectedBook.branch_name || "—"}
                  </strong>

                </div>

              </div>

            )}


            {/* =========================================
                MEMBER
            ========================================= */}

            <div className="form-group">

              <label htmlFor="member">
                Member
              </label>


              <select
                id="member"
                value={selectedMember}
                onChange={(event) =>
                  setSelectedMember(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select an active member
                </option>


                {members.map((member) => (

                  <option
                    key={member.id}
                    value={member.id}
                  >

                    {member.member_id
                      ? `${member.member_id} — ${
                          member.name ||
                          member.full_name ||
                          member.user?.username ||
                          "Member"
                        }`
                      : member.name ||
                        member.full_name ||
                        member.user?.username ||
                        `Member ${member.id}`}

                  </option>

                ))}

              </select>

            </div>


            {/* =========================================
                LOAN PERIOD
            ========================================= */}

            <div className="form-group">

              <label htmlFor="loan-days">
                Loan Period
              </label>


              <div className="loan-days-row">

                <input
                  id="loan-days"
                  type="number"
                  min="1"
                  value={loanDays}
                  onChange={(event) =>
                    setLoanDays(
                      event.target.value
                    )
                  }
                />


                <span>
                  days
                </span>

              </div>


              <span className="field-help">
                Default loan period is 14 days.
              </span>

            </div>


            {/* =========================================
                NOTES
            ========================================= */}

            <div className="form-group">

              <label htmlFor="notes">
                Notes
              </label>


              <textarea
                id="notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Optional notes about this issue..."
                rows="4"
              />

            </div>


            {/* =========================================
                ACTIONS
            ========================================= */}

            <div className="issue-form-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={issuing}
              >
                Clear
              </button>


              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  issuing ||
                  searchingBooks ||
                  !selectedBook ||
                  !selectedMember
                }
              >

                {issuing
                  ? "Issuing..."
                  : "Issue Book"}

              </button>

            </div>


          </form>

        </div>

      </div>

    </div>
  );
};


export default IssueBook;