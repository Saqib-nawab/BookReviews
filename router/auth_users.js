const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Write code to check if the username is valid
}

const authenticatedUser = (username, password) => {
    // Write code to check if username and password match the one we have in records
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user exists and the password is correct
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, "secret_key"); // Change "secret_key" to your actual secret key

    // Save the JWT token in the session
    req.session.user = token;

    // Return the JWT token as response
    res.status(200).json({ token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session.user; // Retrieve username from the session

  // Check if the user is logged in
  if (!username) {
      return res.status(401).json({ message: "You must be logged in to add or modify a review" });
  }

  // Check if the review query parameter is provided
  if (!review) {
      return res.status(400).json({ message: "Review parameter is required" });
  }

  // Check if the book with the given ISBN exists
  const book = books[isbn];
  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already reviewed the book
  if (book.reviews[username]) {
      // If the user has already reviewed the book, modify the existing review
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
  } else {
      // If the user has not reviewed the book, add a new review
      book.reviews[username] = review;
      return res.status(201).json({ message: "Review added successfully" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.user; // Retrieve username from the session

  // Check if the user is logged in
  if (!username) {
      return res.status(401).json({ message: "You must be logged in to delete a review" });
  }

  // Check if the book with the given ISBN exists
  const book = books[isbn];
  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has reviewed the book
  if (!book.reviews[username]) {
      return res.status(404).json({ message: "You haven't reviewed this book" });
  }

  // Delete the review associated with the session username
  delete book.reviews[username];
  
  return res.status(200).json({ message: "Review deleted successfully" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
