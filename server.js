const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/betting-game', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
    phone: String,
    otp: String,
    wallet: Number,
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/signup', async (req, res) => {
    const { phone, otp } = req.body;
    const user = new User({ phone, otp, wallet: 0 });
    await user.save();
    res.send('User signed up successfully');
});

app.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone, otp });
    if (user) {
        res.send('OTP verified successfully');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

app.post('/add-money', async (req, res) => {
    const { phone, amount } = req.body;
    const user = await User.findOne({ phone });
    if (user) {
        user.wallet += amount;
        await user.save();
        res.send(`Added ${amount} KES to wallet`);
    } else {
        res.status(400).send('User not found');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
