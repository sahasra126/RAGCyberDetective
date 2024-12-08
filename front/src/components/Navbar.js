

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        {/* <Link to="/qa">Q&A</Link>  */}
      </div>
      <div className="navbar-brand">
        RAG Cyber Detective
      </div>
    </div>
  );
}

export default Navbar;
