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
  const bookList = Object.values(books); // Assuming books is imported from booksdb.js
  // Respond with the list of books in a neatly formatted JSON string
  const formattedBookList = JSON.stringify(bookList, null, 2); // Indent with 2 spaces
  res.status(200).send(formattedBookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
