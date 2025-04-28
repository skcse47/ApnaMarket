require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Fetch products from dummyjson
    const products = await fetchProducts();
    
    // Transform products to match our schema
    const transformedProducts = products.map(product => ({
      title: product.title,
      description: product.description,
      price: product.price,
      images: product.images,
      stock: product.stock,
      category: product.category,
      isActive: true
    }));

    // Insert products
    const insertedProducts = await Product.insertMany(transformedProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seeding
seedProducts();
