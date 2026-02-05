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
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  }

  return res.status(404).json({ message: "Unable to register user" });
});

public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${req.params.isbn}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Author not found" });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${req.params.title}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Title not found" });
  }
});

module.exports.general = public_users;
