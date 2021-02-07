const mongoose = require('mongoose');
const DB = process.env.DB;

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
