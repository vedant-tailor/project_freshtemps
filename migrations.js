const db = require('./db.js');

async function createTables() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure isAdmin column exists and is properly typed as boolean
    await db.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN isAdmin BOOLEAN DEFAULT FALSE;
        EXCEPTION
          WHEN duplicate_column THEN 
            -- Make sure isAdmin is boolean type
            ALTER TABLE users ALTER COLUMN isAdmin TYPE BOOLEAN USING (isAdmin::boolean);
            RAISE NOTICE 'column isAdmin already exists in users.';
        END;
      END $$;
    `);

    // Create products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        video_link VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        actual_price DECIMAL(10, 2) NOT NULL,
        dis_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create an admin user if none exists
    const adminExists = await db.query('SELECT * FROM users WHERE isAdmin = true');
    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await db.query(
        'INSERT INTO users (username, email, password, isAdmin) VALUES ($1, $2, $3, $4)',
        ['admin', 'admin@example.com', hashedPassword, true]
      );
      
      console.log('Admin user created with email: admin@example.com and password: admin123');
    }

    const users = await db.query('SELECT * FROM users');
    console.log(users.rows); // Log the entire rows to see the structure

    console.log('Tables created/updated successfully');
  } catch (error) {
    console.error('Error creating/updating tables:', error);
  } finally {
    // Close the database connection
    await db.end();
  }
}

async function uploadProduct(productData, userId) {
  try {
    // Check if the user is an admin
    const user = await db.query('SELECT isAdmin FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0 || !user.rows[0].isAdmin) {
      throw new Error('Only admin users can upload products.');
    }

    // Proceed to add the new product
    await db.query(
      'INSERT INTO products (video_link, name, actual_price, dis_price) VALUES ($1, $2, $3, $4)',
      [productData.video_link, productData.name, productData.actual_price, productData.dis_price]
    );

    console.log('Product uploaded successfully');
  } catch (error) {
    console.error('Error uploading product:', error);
  }
}

createTables();