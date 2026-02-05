const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "You must be logged in to add a review." });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, "fingerprint_customer"); // same secret used in login
        req.username = decoded.username; // save username for routes
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
