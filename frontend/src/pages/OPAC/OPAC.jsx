import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getOPAC } from "../../services/opacService";

import "./OPAC.css";

function OPAC() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [mediaType, setMediaType] = useState("");

    const [availableOnly, setAvailableOnly] = useState(false);

    const [sortBy, setSortBy] = useState("relevance");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =========================================================
    // LOAD CATALOGUE
    // =========================================================

    const loadCatalogue = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (category) {
                params.category = category;
            }

            if (mediaType) {
                params.media_type = mediaType;
            }

            if (availableOnly) {
                params.available = "true";
            }

            const data = await getOPAC(params);

            let results = data.results || [];


            // =================================================
            // SORT RESULTS
            // =================================================

            if (sortBy === "title") {
                results.sort((a, b) =>
                    (a.title || "").localeCompare(
                        b.title || ""
                    )
                );
            }

            if (sortBy === "author") {
                results.sort((a, b) =>
                    (a.author || "").localeCompare(
                        b.author || ""
                    )
                );
            }

            if (sortBy === "availability") {
                results.sort(
                    (a, b) =>
                        Number(b.available_copies || 0) -
                        Number(a.available_copies || 0)
                );
            }

            setBooks(results);

        } catch (err) {
            console.error(err);

            setError(
                "Unable to load the catalogue."
            );

            setBooks([]);

        } finally {
            setLoading(false);
        }
    };


    // =========================================================
    // INITIAL LOAD + FILTER CHANGES
    // =========================================================

    useEffect(() => {
        loadCatalogue();
    }, [
        category,
        mediaType,
        availableOnly,
        sortBy,
    ]);


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = (event) => {
        event.preventDefault();

        loadCatalogue();
    };


    // =========================================================
    // CLEAR ALL
    // =========================================================

    const handleClear = () => {
        setSearch("");
        setCategory("");
        setMediaType("");
        setAvailableOnly(false);
        setSortBy("relevance");
    };


    // =========================================================
    // CATEGORY
    // =========================================================

    const handleCategoryChange = (value) => {
        setCategory(
            category === value ? "" : value
        );
    };


    // =========================================================
    // MEDIA TYPE
    // =========================================================

    const handleMediaTypeChange = (value) => {
        setMediaType(
            mediaType === value ? "" : value
        );
    };


    return (
        <div className="opac-public-page" id="top">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="opac-header">

                <div className="opac-header-inner">

                    <Link
                        to="/opac"
                        className="opac-brand"
                    >

                        <div className="opac-brand-logo">
                            📚
                        </div>

                        <div>

                            <h2>
                                LibraryOS
                            </h2>

                            <span>
                                Library Management System
                            </span>

                        </div>

                    </Link>


                    <nav className="opac-navigation">

                        <Link
                            to="/opac"
                            className="active"
                        >
                            Home
                        </Link>

                        <a href="#catalogue">
                            Catalogue
                        </a>

                        <a href="#about">
                            About
                        </a>

                        <a href="#contact">
                            Contact
                        </a>

                    </nav>


                    <Link
                        to="/login"
                        className="opac-login-button"
                    >

                        <span>
                            ♙
                        </span>

                        Login

                    </Link>

                </div>

            </header>


            {/* =================================================
                HERO
            ================================================= */}

            <section className="opac-hero">

                <div className="opac-hero-overlay"></div>

                <div className="opac-hero-content">

                    <h1>
                        Find Your Next Book
                    </h1>

                    <p>
                        Search the library catalogue,
                        explore available books, and
                        check availability across branches.
                    </p>


                    {/* SEARCH */}

                    <form
                        className="opac-search"
                        onSubmit={handleSearch}
                    >

                        <span className="opac-search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by title, author, ISBN, publisher or barcode..."
                        />

                        <button type="submit">
                            Search
                        </button>

                    </form>


                    {/* HERO FILTERS */}

                    <div className="opac-hero-filters">


                        {/* CATEGORY */}

                        <select
                            className="hero-filter"
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                        >

                            <option value="">
                                All Categories
                            </option>

                            <option value="Fiction/Young Adult">
                                Fiction
                            </option>

                            <option value="Academic / Law / Taxation">
                                Academic / Law / Taxation
                            </option>

                            <option value="nothing">
                                Other
                            </option>

                        </select>


                        {/* MEDIA TYPE */}

                        <select
                            className="hero-filter"
                            value={mediaType}
                            onChange={(event) =>
                                setMediaType(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                All Media Types
                            </option>

                            <option value="Book">
                                Book
                            </option>

                            <option value="eBook">
                                eBook
                            </option>

                            <option value="Journal">
                                Journal
                            </option>

                        </select>


                        {/* AVAILABLE */}

                        <label className="hero-checkbox">

                            <input
                                type="checkbox"
                                checked={availableOnly}
                                onChange={(event) =>
                                    setAvailableOnly(
                                        event.target.checked
                                    )
                                }
                            />

                            <span>
                                Available Only
                            </span>

                        </label>

                    </div>

                </div>

            </section>


            {/* =================================================
                CATALOGUE
            ================================================= */}

            <main
                className="opac-main"
                id="catalogue"
            >


                {/* CATALOGUE HEADER */}

                <div className="opac-catalogue-header">

                    <div>

                        <h2>
                            Library Catalogue
                        </h2>

                        <p>
                            {books.length}{" "}
                            {books.length === 1
                                ? "book"
                                : "books"}{" "}
                            found
                        </p>

                    </div>


                    <div className="opac-sort">

                        <span>
                            Sort by
                        </span>

                        <select
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(
                                    event.target.value
                                )
                            }
                        >

                            <option value="relevance">
                                Relevance
                            </option>

                            <option value="title">
                                Title
                            </option>

                            <option value="author">
                                Author
                            </option>

                            <option value="availability">
                                Availability
                            </option>

                        </select>

                    </div>

                </div>


                <div className="opac-layout">


                    {/* =================================================
                        FILTER SIDEBAR
                    ================================================= */}

                    <aside className="opac-sidebar">

                        <div className="sidebar-title">

                            <div>

                                <span className="filter-icon">
                                    ⚱
                                </span>

                                <strong>
                                    Filters
                                </strong>

                            </div>

                            <button
                                type="button"
                                onClick={handleClear}
                            >
                                Clear All
                            </button>

                        </div>


                        {/* CATEGORY */}

                        <div className="sidebar-section">

                            <h3>
                                Category
                            </h3>

                            {[
                                {
                                    label: "Fiction",
                                    value: "Fiction/Young Adult",
                                },
                                {
                                    label: "Academic / Law / Taxation",
                                    value: "Academic / Law / Taxation",
                                },
                                {
                                    label: "Other",
                                    value: "nothing",
                                },
                            ].map((item) => (

                                <label key={item.value}>

                                    <input
                                        type="checkbox"
                                        checked={
                                            category === item.value
                                        }
                                        onChange={() =>
                                            handleCategoryChange(
                                                item.value
                                            )
                                        }
                                    />

                                    <span>
                                        {item.label}
                                    </span>

                                </label>

                            ))}

                        </div>


                        {/* MEDIA TYPE */}

                        <div className="sidebar-section">

                            <h3>
                                Media Type
                            </h3>


                            {[
                                "Book",
                                "eBook",
                                "Journal",
                            ].map((item) => (

                                <label key={item}>

                                    <input
                                        type="checkbox"
                                        checked={
                                            mediaType === item
                                        }
                                        onChange={() =>
                                            handleMediaTypeChange(
                                                item
                                            )
                                        }
                                    />

                                    <span>
                                        {item}
                                    </span>

                                </label>

                            ))}

                        </div>


                        {/* AVAILABILITY */}

                        <div className="sidebar-section">

                            <h3>
                                Availability
                            </h3>

                            <label>

                                <input
                                    type="checkbox"
                                    checked={availableOnly}
                                    onChange={(event) =>
                                        setAvailableOnly(
                                            event.target.checked
                                        )
                                    }
                                />

                                <span>
                                    Available Only
                                </span>

                            </label>

                        </div>


                    </aside>


                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    <section className="opac-results">


                        {loading && (

                            <div className="opac-status-card">
                                Loading catalogue...
                            </div>

                        )}


                        {error && (

                            <div className="opac-status-card opac-error">
                                {error}
                            </div>

                        )}


                        {!loading &&
                            !error &&
                            books.length === 0 && (

                                <div className="opac-empty-state">

                                    <div>
                                        📚
                                    </div>

                                    <h3>
                                        No books found
                                    </h3>

                                    <p>
                                        Try another search
                                        or change your filters.
                                    </p>

                                </div>

                            )}


                        {!loading &&
                            !error &&
                            books.length > 0 && (

                                <div className="opac-book-grid">

                                    {books.map(
                                        (book) => (

                                            <article
                                                className="opac-book-card"
                                                key={book.id}
                                            >


                                                {/* BOOK */}

                                                <div className="book-card-top">

                                                    <div className="book-cover">

                                                        <span>
                                                            📖
                                                        </span>

                                                    </div>


                                                    <div className="book-details">

                                                        <h3>
                                                            {book.title}
                                                        </h3>


                                                        {book.author && (

                                                            <p className="book-author">
                                                                {book.author}
                                                            </p>

                                                        )}


                                                        {book.isbn && (

                                                            <p>

                                                                <span>
                                                                    ♧
                                                                </span>

                                                                ISBN:{" "}
                                                                {book.isbn}

                                                            </p>

                                                        )}


                                                        {book.publisher && (

                                                            <p>

                                                                <span>
                                                                    ▣
                                                                </span>

                                                                Publisher:{" "}
                                                                {book.publisher}

                                                            </p>

                                                        )}


                                                        {book.publication_year && (

                                                            <p>

                                                                <span>
                                                                    ◈
                                                                </span>

                                                                Year:{" "}
                                                                {book.publication_year}

                                                            </p>

                                                        )}

                                                    </div>

                                                </div>


                                                {/* CARD FOOTER */}

                                                <div className="book-card-footer">


                                                    {Number(
                                                        book.available_copies
                                                    ) > 0 ? (

                                                        <span className="availability-badge available">

                                                            ●{" "}

                                                            {
                                                                book.available_copies
                                                            }

                                                            {" of "}

                                                            {
                                                                book.total_copies
                                                            }

                                                            {" available"}

                                                        </span>

                                                    ) : (

                                                        <span className="availability-badge unavailable">

                                                            ● Currently unavailable

                                                        </span>

                                                    )}


                                                    <button
                                                        type="button"
                                                        className="view-details-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/opac/${book.id}`
                                                            )
                                                        }
                                                    >

                                                        View Details

                                                        <span>
                                                            →
                                                        </span>

                                                    </button>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}

                    </section>

                </div>

            </main>


            {/* =================================================
                ABOUT
            ================================================= */}

            <section
                id="about"
                className="opac-about"
            >

                <div>

                    <h2>
                        About LibraryOS
                    </h2>

                    <p>
                        Explore our library catalogue,
                        discover books, and check
                        availability across branches.
                    </p>

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="opac-footer" id="contact">

                <div className="opac-footer-main">

                    {/* BRAND */}

                    <div className="footer-column footer-brand-column">

                        <div className="footer-brand">

                            <div className="footer-logo-box">
                                📚
                            </div>

                            <div className="footer-brand-text">

                                <strong>
                                    LibraryOS
                                </strong>

                                <span>
                                    Library Management System
                                </span>

                            </div>

                        </div>


                        <p className="footer-description">
                            Explore our library catalogue, discover
                            books, and check availability across
                            branches. Read. Learn. Grow.
                        </p>


                        <div className="footer-socials">

                            <a href="#contact" aria-label="Facebook">
                                f
                            </a>

                            <a href="#contact" aria-label="Twitter">
                                𝕏
                            </a>

                            <a href="#contact" aria-label="Instagram">
                                ◎
                            </a>

                            <a href="#contact" aria-label="YouTube">
                                ▶
                            </a>

                        </div>

                    </div>


                    {/* QUICK LINKS */}

                    <div className="footer-column">

                        <h3>
                            Quick Links
                        </h3>

                        <div className="footer-link-list">

                            <a href="#catalogue">
                                <span>›</span>
                                Home
                            </a>

                            <a href="#catalogue">
                                <span>›</span>
                                Catalogue
                            </a>

                            <a href="#about">
                                <span>›</span>
                                About
                            </a>

                            <a href="#contact">
                                <span>›</span>
                                Contact
                            </a>

                        </div>

                    </div>


                    {/* RESOURCES */}

                    <div className="footer-column">

                        <h3>
                            Resources
                        </h3>

                        <div className="footer-link-list">

                            <a href="#contact">
                                <span>›</span>
                                Membership
                            </a>

                            <a href="#contact">
                                <span>›</span>
                                User Guide
                            </a>

                            <a href="#contact">
                                <span>›</span>
                                FAQs
                            </a>

                            <a href="#contact">
                                <span>›</span>
                                Support
                            </a>

                        </div>

                    </div>


                    {/* CONTACT */}

                    <div className="footer-column footer-contact-column">

                        <h3>
                            Contact Us
                        </h3>


                        <div className="footer-contact-list">

                            <div className="footer-contact-item">

                                <span className="footer-contact-icon">
                                    ●
                                </span>

                                <span>
                                    Bhubaneswar, Odisha
                                    <br />
                                    India
                                </span>

                            </div>


                            <div className="footer-contact-item">

                                <span className="footer-contact-icon">
                                    ✉
                                </span>

                                <span>
                                    support@libraryos.com
                                </span>

                            </div>


                            <div className="footer-contact-item">

                                <span className="footer-contact-icon">
                                    ☎
                                </span>

                                <span>
                                    +91 8260015277
                                </span>

                            </div>


                            <div className="footer-contact-item">

                                <span className="footer-contact-icon">
                                    ◷
                                </span>

                                <span>
                                    Mon – Fri, 9:00 AM – 5:00 PM
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* NEWSLETTER */}

                    <div className="footer-column footer-newsletter">

                        <h3>
                            Stay Updated
                        </h3>

                        <p>
                            Get the latest updates, new arrivals
                            and library news.
                        </p>


                        <form
                            className="footer-newsletter-form"
                            onSubmit={(event) => event.preventDefault()}
                        >

                            <input
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Email address"
                            />

                            <button type="submit">
                                →
                            </button>

                        </form>

                    </div>

                </div>


                {/* COPYRIGHT BAR */}

                <div className="footer-bottom">

                    <div className="footer-bottom-inner">

                        <span>
                            © {new Date().getFullYear()} LibraryOS.
                            All rights reserved.
                        </span>


                        <div className="footer-bottom-right">

                            <span>
                                Read • Learn • Grow
                            </span>

                            <a
                                href="#top"
                                className="back-to-top"
                                aria-label="Back to top"
                            >
                                ↑
                            </a>

                        </div>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default OPAC;