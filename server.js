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
mongoose.connect('mongodb+srv://rajsingh:GQkjUy50FFbA4gI0@cluster0.u7lgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

// Google OAuth2 login route
app.post('/login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '33157572429-io4s5e7oj3p42i9evbrc0g6k8n7isj1t.apps.googleusercontent.com',  
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = new User({ googleId: sub, email, name });
      await user.save();
    }

    res.status(200).send({ message: 'Login successful', user });
  } catch (error) {
    res.status(400).send('Login failed');
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
