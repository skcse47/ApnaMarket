import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Apna Market</h1>
      <p>Your one-stop shop for all your needs</p>
      <div className="home-cta">
        <Link to="/products" className="cta-button">Start Shopping</Link>
      </div>
    </div>
  );
};

export default Home;
