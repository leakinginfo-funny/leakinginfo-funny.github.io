const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const postsFile = path.join(__dirname, 'posts.json');

// Make sure posts.json exists
if (!fs.existsSync(postsFile)) {
  fs.writeFileSync(postsFile, '[]');
}

// Middleware
app.use(express.json());

// Serve posts from posts.json
app.get('/posts', (req, res) => {
  fs.readFile(postsFile, (err, data) => {
    if (err) return res.status(500).json([]);
    res.json(JSON.parse(data));
  });
});

// Post new message
app.post('/posts', (req, res) => {
  const newPost = {
    text: req.body.text,
    timestamp: Date.now()
  };

  fs.readFile(postsFile, (err, data) => {
    let posts = [];
    if (!err) posts = JSON.parse(data);
    posts.push(newPost);
    fs.writeFile(postsFile, JSON.stringify(posts, null, 2), (err) => {
      if (err) return res.status(500).send({ error: 'Failed to save post.' });
      res.status(200).send({ success: true });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
