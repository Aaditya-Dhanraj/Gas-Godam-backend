const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXEPTION, shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = "mongodb+srv://aaditya:adityaROCKS552.@cluster0.s2rn4.mongodb.net/aaditya?retryWrites=true&w=majority"

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!!!'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App running on port no ${PORT}....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDELED REJECTION. shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM REJECTION. shutting down gently');
  server.close(() => {
    console.log('Process terminated!');
  });
});
