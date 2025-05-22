const express = require('express');
const router = express.Router();

// index - users
router.get('/users', (req, res) => {
    res.send('Users index');
});

// show - users
router.get('/users/:id', (req, res) => {
    res.send(`User with ID`);
});

// post - users
router.post('/users', (req, res) => {
    res.send('Create a new user');
});

// delete - users
router.delete('/users/:id', (req, res) => {
    res.send(`Delete user with ID`);
});

// ✅ Proper export
module.exports = router;
