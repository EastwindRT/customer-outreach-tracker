require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory token→phone mapping
app.locals.tokenMap = new Map();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/outreach'));
app.use('/', require('./routes/response'));
app.use('/', require('./routes/webhook'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
