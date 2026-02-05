const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid; // kept for consistency
let users = require("./auth_users.js").users;     // kept for consistency

const public_users = express.Router();

// Task 10: Get the list of all books (async-await)
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await new Promise((resolve, reject) => {
            resolve(books);
        });
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books." });
    }
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject(`Book with ISBN ${isbn} not found.`);
        });
        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 12: Get book details based on Author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const result = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(b => b.author.toLowerCase() === author);
            if (filtered.length > 0) resolve(filtered);
            else reject(`No books found by author '${author}'.`);
        });
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 13: Get book details based on Title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const result = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(b => b.title.toLowerCase() === title);
            if (filtered.length > 0) resolve(filtered);
            else reject(`No books found with title '${title}'.`);
        });
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

module.exports.general = public_users;
