const express = require("express");
const router = express.Router();

// Contact Us
router.get("/contact", (req, res) => {
    res.render("footer/contact");
});

// Help Center
router.get("/help", (req, res) => {
    res.render("footer/help");
});

// Privacy Policy
router.get("/privacy", (req, res) => {
    res.render("footer/privacy");
});

// Terms & Conditions
router.get("/terms", (req, res) => {
    res.render("footer/terms");
});

module.exports = router;