const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
  }

  // If username doesn't exist, create a new user and add to the users array
  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully", user: newUser });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Create a promise to retrieve the book list
  const getBookList = new Promise((resolve, reject) => {
      // Assuming books is imported from booksdb.js
      const bookList = Object.values(books);

      // Check if the book list is retrieved successfully
      if (bookList) {
          resolve(bookList);
      } else {
          reject("Failed to retrieve book list");
      }
  });

  // Handle the promise
  getBookList
      .then(bookList => {
          // Respond with the list of books in a neatly formatted JSON string
          const formattedBookList = JSON.stringify(bookList, null, 2); // Indent with 2 spaces
          res.status(200).send(formattedBookList);
      })
      .catch(error => {
          // Handle errors
          res.status(500).json({ message: error });
      });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Create a promise to retrieve book details based on ISBN
  const getBookDetails = new Promise((resolve, reject) => {
      const isbn = req.params.isbn; // Retrieve ISBN from request parameters
      const book = books[isbn]; // Assuming books is imported from booksdb.js

      // Check if the book with the given ISBN exists
      if (book) {
          resolve(book);
      } else {
          reject("Book not found");
      }
  });

  // Handle the promise
  getBookDetails
      .then(book => {
          // If the book exists, respond with its details in JSON format
          res.status(200).json(book);
      })
      .catch(error => {
          // If the book does not exist, respond with a 404 Not Found error
          res.status(404).json({ message: error });
      });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Create a promise to retrieve book details based on author
  const getBooksByAuthor = new Promise((resolve, reject) => {
      const author = req.params.author; // Retrieve author from request parameters
      const booksByAuthor = [];

      // Iterate through all books to find those by the provided author
      Object.values(books).forEach(book => {
          if (book.author === author) {
              booksByAuthor.push(book);
          }
      });

      // Check if books by the author are found
      if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
      } else {
          reject("No books found for the provided author");
      }
  });

  // Handle the promise
  getBooksByAuthor
      .then(books => {
          // If books by the author are found, respond with their details in JSON format
          res.status(200).json(books);
      })
      .catch(error => {
          // If no books are found for the provided author, respond with a 404 Not Found error
          res.status(404).json({ message: error });
      });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Create a promise to retrieve books based on title
  const getBooksByTitle = new Promise((resolve, reject) => {
      const title = req.params.title; // Retrieve title from request parameters
      const booksByTitle = [];

      // Iterate through all books to find those with the same title
      Object.values(books).forEach(book => {
          if (book.title === title) {
              booksByTitle.push(book);
          }
      });

      // Check if any books with the same title were found
      if (booksByTitle.length > 0) {
          resolve(booksByTitle);
      } else {
          reject("Books with this title not found");
      }
  });

  // Handle the promise
  getBooksByTitle
      .then(books => {
          // If books with the same title were found, respond with their details in JSON format
          res.status(200).json(books);
      })
      .catch(error => {
          // If no books with the same title were found, respond with a 404 Not Found error
          res.status(404).json({ message: error });
      });
});


// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  const book = books[isbn]; // Assuming books is imported from booksdb.js

  // Check if the book with the given ISBN exists
  if (book) {
      const reviews = book.reviews;
      // Respond with the reviews for the book in JSON format
      res.status(200).json(reviews);
  } else {
      // If the book does not exist, respond with a 404 Not Found error
      res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
