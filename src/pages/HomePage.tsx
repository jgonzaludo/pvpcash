import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="page-content">
      <h1>Welcome to PvPCasino</h1>
      <section>
        <h2>Game Selection</h2>
        <ul>
          <li><Link to="/wheel">Wheel</Link></li>
          <li><Link to="/poker">Poker</Link></li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage; 