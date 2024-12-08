// MLModelPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MLModelPage.css'
const MLModelPage = () => {
  const navigate = useNavigate();

  const handleXGBoostClick = () => {
    navigate('/ml-model'); // Navigate to MLModel component for XGBoost
  };

  const handleSpaCyClick = () => {
    navigate('/ml-model/spacy'); // Navigate to MLModel component for SpaCy (you can customize as needed)
  };

  return (
    <div className="ml-model-page">
      <h2>ML Model Options</h2>
      <button onClick={handleXGBoostClick}>XGBoost</button>
      <button onClick={handleSpaCyClick}>SpaCy</button>
    </div>
  );
};

export default MLModelPage;
