const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

connectDB();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// Update this to your actual Netlify deployment URL
app.use(cors({
  origin: 'https://stupendous-lily-5e8714.netlify.app'
}));

const PORT = process.env.PORT || 3000;

app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
