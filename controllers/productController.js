const db = require('../db');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const { video_link, name, actual_price, dis_price } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO products (video_link, name, actual_price, dis_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [video_link, name, actual_price, dis_price]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { video_link, name, actual_price, dis_price } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      'UPDATE products SET video_link = $1, name = $2, actual_price = $3, dis_price = $4 WHERE id = $5 RETURNING *',
      [video_link, name, actual_price, dis_price, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload a new product
exports.uploadProduct = async (req, res) => {
  const { video_link, name, actual_price, dis_price } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO products (video_link, name, actual_price, dis_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [video_link, name, actual_price, dis_price]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};