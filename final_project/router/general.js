const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user" });
});

// TASK 10: Get all books using async/await (simulating async operation)
public_users.get('/', async (req, res) => {
  try {
    // Simulate async database access using Promise
    const getBooksAsync = () => {
      return new Promise((resolve, reject) => {
        // Simulate database delay
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };

    const allBooks = await getBooksAsync();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// TASK 11: Get book by ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    
    // Simulate async database lookup
    const findBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 100);
      });
    };

    const book = await findBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// TASK 12: Get books by author using async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    
    // Simulate async database search
    const findBooksByAuthor = (authorName) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = Object.values(books).filter(
            (book) => book.author.toLowerCase().includes(authorName.toLowerCase())
          );
          
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error("No books found for this author"));
          }
        }, 100);
      });
    };

    const booksByAuthor = await findBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// TASK 13: Get books by title using async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    
    // Simulate async database search
    const findBooksByTitle = (bookTitle) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const filteredBooks = Object.values(books).filter(
            (book) => book.title.toLowerCase().includes(bookTitle.toLowerCase())
          );
          
          if (filteredBooks.length > 0) {
            resolve(filteredBooks);
          } else {
            reject(new Error("No books found with this title"));
          }
        }, 100);
      });
    };

    const booksByTitle = await findBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Alternative version using async functions that return Promises directly
// This is cleaner and more realistic for actual async operations

// TASK 10 Alternative: Using Promise directly
public_users.get('/promise', async (req, res) => {
  try {
    const allBooks = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// TASK 11 Alternative: Using Promise directly
public_users.get('/promise/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({ message: err }));
});

// TASK 12 Alternative: Using Promise directly
public_users.get('/promise/author/:author', async (req, res) => {
  const author = req.params.author;
  
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.author.toLowerCase().includes(author.toLowerCase())
    );
    
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found for this author");
    }
  })
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({ message: err }));
});

// TASK 13 Alternative: Using Promise directly
public_users.get('/promise/title/:title', async (req, res) => {
  const title = req.params.title;
  
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase().includes(title.toLowerCase())
    );
    
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  })
  .then(books => res.status(200).json(books))
  .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;