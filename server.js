require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Use the MongoDB URI from .env
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('MongoDB error:', err));

// Blog schema and model
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', blogSchema);

// Get all blog posts
app.get('/api/blog', async (req, res) => {
    try {
        const posts = await Blog.find().sort({ date: -1 });
        // Map _id to id for consistency with frontend
        const mappedPosts = posts.map(post => ({
          id: post._id,
          title: post.title,
          content: post.content,
          date: post.date
        }));
        res.json(mappedPosts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Get a single blog post by ID
app.get('/api/blog/:id', async (req, res) => {
    try {
        const post = await Blog.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Map _id to id for consistency
        res.json({
          id: post._id,
          title: post.title,
          content: post.content,
          date: post.date
        });
    } catch (err) {
        res.status(400).json({ message: 'Invalid post ID' });
    }
});

// Add a new blog post
app.post('/api/blog', async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = new Blog({ title, content });
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error saving the post' });
    }
});
// Delete a blog post by ID
app.delete('/api/blog/:id', async (req, res) => {
    try {
        const deletedPost = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid post ID' });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
