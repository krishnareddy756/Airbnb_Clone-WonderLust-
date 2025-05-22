const express = require('express');
const router = express.Router();

// index - posts
router.get('/', (req, res) => {
    res.send('Posts index');
});

// show - posts
router.get('/:id', (req, res) => {
    res.send(`Post with ID`);
});

// post - posts
router.post('/', (req, res) => {
    res.send('Create a new post');
});

// delete - posts
router.delete('/:id', (req, res) => {
    res.send(`Delete post with ID`);
});

module.exports = router;
