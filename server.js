const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON data sent in POST requests

// Define the path for the posts file directly in the root folder
const postsFilePath = path.join(__dirname, 'posts.json');

// GET route to fetch posts
app.get('/', (req, res) => {
  fs.readFile(postsFilePath, (err, data) => {
    if (err) {
      return res.status(500).json([]);
    }
    res.json(JSON.parse(data));
  });
});

// POST route to save posts
app.post('/', (req, res) => {
  const newPost = {
    text: req.body.text,
    timestamp: Date.now()
  };

  fs.readFile(postsFilePath, (err, data) => {
    let posts = [];
    if (!err) posts = JSON.parse(data);
    posts.push(newPost);
    fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).send({ error: 'Failed to save post.' });
      res.status(200).send({ success: true });
    });
  });
});

// Enable CORS to allow frontend access from different domains (e.g., GitHub Pages)
const cors = require('cors');
app.use(cors());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
