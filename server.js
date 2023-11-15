// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Endpoint to get products
app.get('/products', (req, res) => {
  db.getProducts((err, products) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.json(products);
    }
  });
});

// Endpoint to add a new product
app.post('/products', (req, res) => {
  const { title, description, price, rating, stock, thumbnail } = req.body;

  if (!title || !description || !price || !rating || !stock || !thumbnail) {
    return res.status(400).send('Missing required fields');
  }

  db.addProduct({ title, description, price, rating, stock, thumbnail }, (err, product) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).json(product);
    }
  });
});

// Endpoint to delete a product
app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).send('Invalid product ID');
  }

  db.deleteProduct(productId, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (result === 0) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).send('Product deleted successfully');
    }
  });
});

// Endpoint to update a product
app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const { title, description, price, rating, stock, thumbnail } = req.body;

  if (!title || !description || !price || !rating || !stock || !thumbnail) {
    return res.status(400).send('Missing required fields');
  }

  db.updateProduct(productId, { title, description, price, rating, stock, thumbnail }, (err, product) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Product not found');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});