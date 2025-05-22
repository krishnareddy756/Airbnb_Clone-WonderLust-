const express = require('express'); 
const app = express();

const users = require('./routes/user.js');
const posts = require('./routes/post.js'); // <-- ADD THIS LINE

app.get("/getcookies", (req, res) => {
    res.cookie("name", "John Doe");
    res.cookie("age", 30);
    res.cookie("isAdmin", true);
    res.send("Check your cookies in the console");
});
app.get('/', (req, res) => {
    res.send('HI I AM ROOT');
});

app.use("/users", users);
app.use('/posts', posts);

app.listen(3000, () => {    
    console.log('Server is running on port 3000');
});
