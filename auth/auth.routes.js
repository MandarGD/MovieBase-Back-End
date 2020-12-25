const express = require("express");
const control = require("./auth.control");

const router = express.Router();

router.post('/login', control.login);
router.post('/signup', control.signup);
router.post('/isTokenValid', control.isTokenValid);

module.exports = router;