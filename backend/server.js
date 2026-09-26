require('dotenv').config();

const express = require('express');
const cors = require('cors');

const rotas = require('./equipamentos');

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.static(__dirname + '/../frontend'));


app.use('/equipamentos', rotas);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API de equipamentos rodando em http://localhost:${PORT}`);
});
