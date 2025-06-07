const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data stores (replace with DB in production)
let messages = [
    { id: 1, name: "Jane Doe", email: "jane@email.com", message: "Hello, I want to book a class!" },
    { id: 2, name: "John Smith", email: "john@email.com", message: "Do you offer vegetarian options?" }
];
let blogPosts = [
    { id: 1, title: "Discovering the Food Culture of Aqaba", content: "Sample content...", date: "2024-06-01" },
    { id: 2, title: "The Rich History of Aqaba", content: "Sample content...", date: "2024-05-20" }
];
let products = [
    { id: 1, name: "Authentic Cooking Class", price: "30JD" },
    { id: 2, name: "Walking and Food Taste Tour", price: "20JD" }
];

// Middleware for CORS and JSON
app.use(cors({
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501', 'https://suhaila-locals.space'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize multer for file uploads (if needed)
const upload = multer();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Reservation email endpoint (unchanged)
app.post('/send-email', upload.none(), (req, res) => {
    const { experience, date, attendees, name, email, phone, comments } = req.body;
    if (!email) {
        return res.status(400).send({ message: 'Email is required.' });
    }
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}, ${process.env.EMAIL_USER}`,
        subject: 'Reservation Confirmation',
        text: `Hello ${name},\n\nThank you for your reservation!\n\n` +
        `Here are your reservation details:\n` +
        `----------------------------------------\n` +
        `| Field                 | Information     |\n` +
        `----------------------------------------\n` +
        `| Experience            | ${experience}   |\n` +
        `| Date                  | ${date}        |\n` +
        `| Number of Attendees   | ${attendees}   |\n` +
        `| Phone                 | ${phone}       |\n` +
        `| Comments              | ${comments}    |\n` +
        `----------------------------------------\n` +
        `We will contact you soon.\n\n` +
        `Best regards,\n` +
        `Suhaila Cooking Experience`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ message: 'Error sending email.' });
        }
        res.status(200).send({ message: 'Reservation confirmed!' });
    });
});

/* --- ADMIN API ENDPOINTS --- */

// --- Messages ---
app.get('/api/messages', (req, res) => {
    res.json(messages);
});
app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body;
    const newMsg = { id: Date.now(), name, email, message };
    messages.push(newMsg);
    res.status(201).json(newMsg);
});
app.delete('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    messages = messages.filter(msg => msg.id !== id);
    res.json({ success: true });
});

// --- Blog Posts ---
app.get('/api/blog', (req, res) => {
    res.json(blogPosts);
});
app.post('/api/blog', (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: Date.now(), title, content, date: new Date().toISOString().slice(0,10) };
    blogPosts.push(newPost);
    res.status(201).json(newPost);
});
app.put('/api/blog/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const post = blogPosts.find(p => p.id === id);
    if (post) {
        post.title = title;
        post.content = content;
        res.json(post);
    } else {
        res.status(404).json({ message: "Not found" });
    }
});
app.delete('/api/blog/:id', (req, res) => {
    const id = parseInt(req.params.id);
    blogPosts = blogPosts.filter(post => post.id !== id);
    res.json({ success: true });
});

// --- Products ---
app.get('/api/products', (req, res) => {
    res.json(products);
});
app.post('/api/products', (req, res) => {
    const { name, price } = req.body;
    const newProduct = { id: Date.now(), name, price };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const prod = products.find(p => p.id === id);
    if (prod) {
        prod.name = name;
        prod.price = price;
        res.json(prod);
    } else {
        res.status(404).json({ message: "Not found" });
    }
});
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(prod => prod.id !== id);
    res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});