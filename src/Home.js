import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const games = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    description: 'Futuristic open-world RPG.',
    price: '$59.99',
    image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp'
  },
  {
    id: 2,
    title: 'Elden Ring',
    description: 'Dark fantasy action RPG.',
    price: '$69.99',
    image: 'https://th.bing.com/th/id/R.6eb59976f763b05a21fb206ad4a6ebe2?rik=RJHdVxmdgmwQKg&pid=ImgRaw&r=0'
  },
  {
    id: 3,
    title: 'Minecraft',
    description: 'Create and explore your blocky world.',
    price: '$26.95',
    image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8fu6.webp'
  },
  {
    id: 4,
    title: 'Valorant',
    description: 'Team-based tactical shooter.',
    price: 'Free',
    image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8ok7.webp'
  }
];

function Home() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const addToCart = (game) => {
    setCart((prevCart) => [...prevCart, game]);
  };

  const goToCheckout = (game) => {
    navigate('/checkout', { state: { game } });
  };

  return (
    <div className="home">
      <h1>GameVilla</h1>
      <p>Discover trending games</p>
      <div className="game-list">
        {games.map(game => (
          <div className="game-card" key={game.id}>
            <img src={game.image} alt={game.title} />
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            <p className="price">{game.price}</p>
            <div className="game-buttons">
              <button className="buy-btn" onClick={() => goToCheckout(game)}>Buy</button>
              <button className="cart-btn" onClick={() => addToCart(game)}>Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
