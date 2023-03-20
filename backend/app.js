const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// Login to database
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`,
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// express-rate-limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,			// 15 minutes
	max: 200,							// Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true,				// Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false,				// Disable the `X-RateLimit-*` headers
})
app.use(limiter)

// express-mongo-sanitize
app.use(mongoSanitize());

// helmet
app.use(helmet({crossOriginResourcePolicy: false}));

app.use(express.json());

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/users');
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'images')));

module.exports = app;