const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


const stuffRoutes = require('./routes/sauces');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb+srv://johannvottero:ZWm828wQUvJQqQJ8@cluster0.uhxqqd7.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'images')));

module.exports = app;