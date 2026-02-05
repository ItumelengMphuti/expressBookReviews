const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check if username/password matches
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Create JWT token
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

    return res.status(200).json({ message: `User '${username}' logged in successfully.`, token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.username; // from JWT middleware

    if (!username) {
        return res.status(401).json({ message: "You must be logged in to add a review." });
    }

    if (!reviewText) {
        return res.status(400).json({ message: "Review text is required." });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    book.reviews[username] = reviewText;

    return res.status(200).json({
        message: `Review for book '${book.title}' by user '${username}' added/updated successfully.`,
        reviews: book.reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.username; // from JWT middleware

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    if (!book.reviews[username]) {
        return res.status(404).json({ message: `No review found for user '${username}' on this book.` });
    }

    delete book.reviews[username];

    return res.json({
        message: "Review for ISBN " + isbn + " deleted"
      });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
