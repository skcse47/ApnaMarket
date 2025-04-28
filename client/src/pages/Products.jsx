import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      console.log('Adding product to cart:', productId); // Debug log

      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productId, // Match backend expectation
          quantity: 1
        }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Add to cart response:', data); // Debug log

      if (response.ok) {
        if (window.confirm('Item added to cart! View cart now?')) {
          navigate('/cart');
        }
      } else if (response.status === 401) {
        if (window.confirm('Please login to add items to cart. Go to login page?')) {
          navigate('/login');
        }
      } else {
        throw new Error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="products">
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.images[0]} alt={product.title} />
            <h3>{product.title}</h3>
            <p className="description">{product.description}</p>
            <p className="price">₹{product.price}</p>
            <button 
              onClick={() => addToCart(product._id)}
              disabled={addingToCart === product._id}
              className={addingToCart === product._id ? 'loading' : ''}
            >
              {addingToCart === product._id ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
