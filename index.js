const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up session middleware with a secret for encryption
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication mechanism using session authorization
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the user is authenticated
    if (req.session && req.session.user) {
        // If user is authenticated, move to the next middleware
        next();
    } else {
        // If user is not authenticated, return an error response
        return res.status(401).json({ message: "Unauthorized" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes); //authorized users
app.use("/", genl_routes); //unauthorized users

app.listen(PORT, () => console.log("Server is running"));
