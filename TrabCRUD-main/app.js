// app.js

const express = require('express');
const sequelize = require('./sequelize');
const pessoasRouter = require('./routes/pessoas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/pessoas', pessoasRouter);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
