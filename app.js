require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ConnectionStates } = require('mongoose');
const connectDB = require('./config/db');
const { handleErrors, handle404 } = require('./utils');

const app = express();

// Connecting to database
connectDB();

app.use(cors());

// Parsing incoming requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initin routes
app.use('/api/animes', require('./routes/anime_routes'));
app.use('/api/users', require('./routes/user_routes'));
// app.post('/api/upload', async (req, res) => {
//   try {
//     const file = req.body.data;
//     const Uploaded = await cloudinary.uploader.upload(file, {
//       upload_preset: 'dev_setup',
//       eager: [{ width: 150, height: 150, crop: 'pad' }],
//     });
//     console.log(Uploaded);
//     res.send('scc');
//   } catch (error) {
//     console.log(error);
//   }
// });

// Handling errors
app.use(handle404);
app.use(handleErrors);

module.exports = app;
