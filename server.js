const express = require('express');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const app = express();
const client = new OAuth2Client('33157572429-io4s5e7oj3p42i9evbrc0g6k8n7isj1t.apps.googleusercontent.com');

app.use(bodyParser.json());

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
  content: String,
  rating: Number,
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

// Example route to add a review
app.post('/addReview', async (req, res) => {
  const { userId, content, rating } = req.body;
  const review = new Review({ userId, content, rating });
  try {
    await review.save();
    res.status(201).send('Review added');
  } catch (err) {
    res.status(400).send('Error adding review');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});