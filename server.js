require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('MongoDB error:', err));

/* ───── BLOG ───── */
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
    res.json(posts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      date: post.date
    })));
  } catch {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Get blog post by ID
app.get('/api/blog/:id', async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({
      id: post._id,
      title: post.title,
      content: post.content,
      date: post.date
    });
  } catch {
    res.status(400).json({ message: 'Invalid post ID' });
  }
});

// Add blog post
app.post('/api/blog', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Missing title or content.' });
  try {
    const post = new Blog({ title, content });
    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: 'Error saving the post' });
  }
});

// Delete blog post
app.delete('/api/blog/:id', async (req, res) => {
  try {
    const deletedPost = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch {
    res.status(400).json({ message: 'Invalid post ID' });
  }
});

/* ───── RESERVATION + EMAIL ───── */
const reservationSchema = new mongoose.Schema({
  experience: String,
  date: String,
  attendees: Number,
  name: String,
  email: String,
  phone: String,
  comments: String,
  confirmationId: String
});
const Reservation = mongoose.model('Reservation', reservationSchema);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

app.post('/api/reserve', async (req, res) => {
  try {
    const { experience, date, attendees, name, email, phone, comments } = req.body;
    if (!email || !name) return res.status(400).json({ message: 'Name and email are required.' });

    const confirmationId = Math.random().toString(36).substr(2, 9);
    const reservation = new Reservation({ experience, date, attendees, name, email, phone, comments, confirmationId });
    await reservation.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${email}, ${process.env.EMAIL_USER}`,
      subject: 'Reservation Confirmation',
      html: `
        <h2>Hello ${name},</h2>
        <p>Your reservation is confirmed!</p>
        <ul>
          <li><strong>ID:</strong> ${confirmationId}</li>
          <li><strong>Experience:</strong> ${experience}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Attendees:</strong> ${attendees}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Comments:</strong> ${comments || 'None'}</li>
        </ul>
        <p>We look forward to welcoming you!<br>Suhaila Cooking Experience</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reservation confirmed!', confirmationId });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Reservation failed.', error });
  }
});

/* ───── START SERVER ───── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));