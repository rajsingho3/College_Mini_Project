const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const client = new OAuth2Client('33157572429-io4s5e7oj3p42i9evbrc0g6k8n7isj1t.apps.googleusercontent.com');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://rajsingh:6MBezNqg2iqlnbKg@cluster0.u7lgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define User Schema
const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
});

// Define Review Schema
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  rating: Number,
  review: String,
});

// Create Models
const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);

// Example route to add a user
app.post('/addUser', async (req, res) => {
  const { googleId, email, name } = req.body;
  const user = new User({ googleId, email, name });
  try {
    await user.save();
    res.status(201).send('User added');
  } catch (err) {
    res.status(400).send('Error adding user');
  }
});

// Handle form submission
app.post('/submit-review', async (req, res) => {
  const { name, email, rating, review } = req.body;

  const newReview = new Review({ name, email, rating, review });

  try {
    await newReview.save();
    res.status(200).send('Review submitted successfully');
  } catch (error) {
    res.status(500).send('Failed to submit review');
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});