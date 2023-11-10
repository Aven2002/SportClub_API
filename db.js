const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database('products.db', (err) => {
      if (err) {
        console.error('Database connection error:', err.message);
      } else {
        console.log('Connected to the database');
        this.initializeDatabase();
      }
    });
  }

  initializeDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        title TEXT,
        description TEXT,
        price REAL,
        rating REAL,
        stock INTEGER,
        thumbnail TEXT
      )
    `);
  }

  addProduct(product, callback) {
    const { title, description, price, rating, stock, thumbnail } = product;

    const sql = `
      INSERT INTO products (title, description, price, rating, stock, thumbnail)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    this.db.run(sql, [title, description, price, rating, stock, thumbnail], function (err) {
      if (err) {
        console.error('Error adding product:', err.message);
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, ...product });
      }
    });
  }

  getProducts(callback) {
    this.db.all('SELECT * FROM products', (err, products) => {
      if (err) {
        console.error('Error getting products:', err.message);
        callback(err, null);
      } else {
        callback(null, products);
      }
    });
  }

  deleteProduct(id, callback) {
    const sql = 'DELETE FROM products WHERE id = ?';
  
    this.db.run(sql, [id], function (err) {
      if (err) {
        console.error('Error deleting product:', err.message);
        callback(err, null);
      } else {
        callback(null, this.changes); // Number of rows affected
      }
    });
  }

  updateProduct(productId, productData, callback) {
    const { title, description, price, rating, stock, thumbnail } = productData;

    const sql = `
      UPDATE products
      SET title = ?, description = ?, price = ?, rating = ?, stock = ?, thumbnail = ?
      WHERE id = ?
    `;

    this.db.run(sql, [title, description, price, rating, stock, thumbnail, productId], function (err) {
      if (err) {
        console.error('Error updating product:', err.message);
        callback(err, null);
      } else {
        if (this.changes > 0) {
          callback(null, { id: productId, ...productData });
        } else {
          callback(null, null); // Product not found
        }
      }
    });
  }
}

module.exports = new Database();
