require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

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
  image: String,
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
      date: post.date,
      image: post.image
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
      date: post.date,
      image: post.image
    });
  } catch {
    res.status(400).json({ message: 'Invalid post ID' });
  }
});

// Add blog post with image
app.post('/api/blog', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file?.filename;

  if (!title || !content) {
    return res.status(400).json({ message: 'Missing title or content.' });
  }

  try {
    const post = new Blog({ title, content, image });
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
app.put('/api/blog/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Post not found' });
    res.json(updated);
  } catch {
    res.status(400).json({ message: 'Error updating post' });
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
        <h2 style="color:#3a86ff;">Your Booking Is Confirmed! 🎉</h2>
        <p>Thank you for reserving with us! Below are your details:</p>
        <ul>
          <li><strong>ID:</strong> ${confirmationId}</li>
          <li><strong>Experience:</strong> ${experience}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Attendees:</strong> ${attendees}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Comments:</strong> ${comments || 'None'}</li>
        </ul>
        <p>We look forward to welcoming you!<br>Aqaba local experiences</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reservation confirmed!', confirmationId });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Reservation failed.', error });
  }
});

/* ───── ADMIN LOGIN LOGGING ───── */
const loginEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  username: String, // or just "admin" if password-only
  ip: String
});
const LoginEvent = mongoose.model('LoginEvent', loginEventSchema);

app.post('/api/admin-logins', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  await LoginEvent.create({ username: "admin", ip });
  res.sendStatus(201);
});

app.get('/api/admin-logins', async (req, res) => {
  const events = await LoginEvent.find().sort({ timestamp: -1 });
  res.json(events);
});

/* ───── START SERVER ───── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

