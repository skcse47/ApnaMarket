import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
      setLoading(true);
      setError('');
      try {
        // 1. Fetch cart items
        console.log('Fetching cart...');
        const response = await fetch('http://localhost:5000/api/cart', {
          credentials: 'include'
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to load cart');
        }

        const cartData = await response.json();
        console.log('Cart Data:', cartData);

        if (!Array.isArray(cartData)) {
          console.error('Cart data is not an array:', cartData);
          throw new Error('Invalid cart data received');
        }

        // Transform cart data to use the populated productId as product
        const transformedItems = cartData.map(item => ({
          ...item,
          product: item.productId // productId is already the populated product object
        }));

        console.log('Transformed cart items:', transformedItems);
        setCartItems(transformedItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError(error.message || 'Failed to load cart items');
      } finally {
        setLoading(false);
      }
    }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    setError('');
    try {
      console.log('Updating cart item quantity:', newQuantity);
      
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: itemId,
          quantity: newQuantity
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update quantity');
      }

      // Refresh cart to get updated data
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }

  };

  const removeItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    
    setLoading(true);
    setError('');
    try {
      console.log('Removing cart item:', itemId);
      
      const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to remove item');
        } else {
          throw new Error('Server error. Please try again.');
        }
      }

      // Refresh cart data
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const order = await response.json();
        setCartItems([]); // Clear cart after successful order
        navigate(`/orders/${order._id}`);
      } else {
        const error = await response.json();
        setError(error.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart to see them here.</p>
        <Link to="/products" className="cta-button">Browse Products</Link>
      </div>
    );
  }

  // Calculate total only if cartItems is an array and not empty
  const total = cartItems.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item._id} className="cart-item">
            <div className="item-image">
              <img 
                src={item.product.images[0]} 
                alt={item.product.title} 
              />
            </div>
            <div className="item-details">
              <h3>{item.product.title}</h3>
              <p className="item-price">₹{item.product.price.toLocaleString()}</p>
              <div className="quantity-controls">
                <button 
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  disabled={loading || item.quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  disabled={loading || item.quantity >= item.product.stock}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <p className="item-total">Total: ₹{(item.product.price * item.quantity).toLocaleString()}</p>
            </div>
            <button 
              className="remove-button"
              onClick={() => removeItem(item._id)}
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
        <button 
          className="checkout-button" 
          onClick={handleCheckout}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default Cart;
