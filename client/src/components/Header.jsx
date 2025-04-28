import { isLoggedIn } from '../utils/auth';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Apna Market</Link>
      </div>
      <nav className="main-nav">
        <Link to="/products">Products</Link>
        {!isLoggedIn() && (
          <>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link> 
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
