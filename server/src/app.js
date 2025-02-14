require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/api.router');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const { PORT } = process.env;

const corsConfig = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1', apiRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});