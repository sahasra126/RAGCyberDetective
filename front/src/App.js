
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Login from './components/Login';
// import Register from './components/Register';
// import Qa from './components/Qa';
// import Home from './components/Home';
// import './App.css';
// import ScrapedFiles from './components/ScrapedFiles';
// import FileDetail from './components/FileDetail';

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/qa" element={<Qa />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/" element={<Home />} /> {/* Default route */}
//         <Route path="/scraped-files" element={<ScrapedFiles />} />
//         <Route path="/file/:filename" element={<FileDetail />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';
import ScrapePage from './components/ScrapePage';
import ScrapedFiles from './components/ScrapedFiles';
import FileDetail from './components/FileDetail';
import QAPage from './components/QAPage.js';
import MLModel from "./components/MLModel";
import MLModelPage from './components/MLModelPage';
import Spacy from './components/Spacy'
import ViewDataset from './components/ViewDataset';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn'); // Check if the user is logged in

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true, // Pre-enable startTransition feature for smoother transitions
        v7_relativeSplatPath: true, // Pre-enable relative path behavior in splat routes
      }}
    >
      <div>
        {/* Navbar */}
        <Navbar />

        {/* Routes */}
        <Routes>
        <Route path="/scrape" element={<ScrapePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ml-model" element={<MLModel />} />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />} // Redirect to login if not logged in
          />
          <Route path="/qa" element={<QAPage />} />
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login page */}
          <Route path="/file/:filename" element={<FileDetail />} />
          <Route path="/scraped-files" element={<ScrapedFiles />} />
          <Route path="/ml-model-page" element={<MLModelPage />} />
           <Route path="/ml-model/spacy" element={<Spacy/>} /> SpaCy route *
           <Route path="/view-dataset" element={<ViewDataset />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Login from './components/Login';
// import Register from './components/Register';
// import Home from './components/Home';
// import './App.css';
// import ScrapedFiles from './components/ScrapedFiles';
// import FileDetail from './components/FileDetail';
// import QAPage from './components/QAPage.js';
// import MLModel from "./components/MLModel";

// function App() {
//   const isLoggedIn = localStorage.getItem('isLoggedIn'); // Check if the user is logged in

//   return (
  

//     <Router>
//       <div>
//         {/* Navbar */}
//         <Navbar />

//         {/* Routes */}
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/mlmodel" element={<MLModel />} />
//           <Route
//             path="/home"
//             element={isLoggedIn ? <Home /> : <Navigate to="/login" />} // Redirect to login if not logged in
//           />
//           <Route path="/qa" element={<QAPage />} />
//           <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login page */}
//           <Route path="/file/:filename" element={<FileDetail />} />
//           <Route path="/scraped-files" element={<ScrapedFiles />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Login from './components/Login';
// import Register from './components/Register';
// import Home from './components/Home';
// import './App.css';
// import ScrapedFiles from './components/ScrapedFiles';
// import FileDetail from './components/FileDetail';
// import QAPage from './components/QAPage.js';
// import MLModel from "./components/MLModel";
// function App() {
//   const isLoggedIn = localStorage.getItem('isLoggedIn'); // Check if the user is logged in

//   return (
  
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/mlmodel" element={<MLModel />} />
//         <Route
//           path="/home"
//           element={isLoggedIn ? <Home /> : <Navigate to="/login" />} // Redirect to login if not logged in
//         />
//         <Route path="/qa" element={<QAPage/>} />
//         <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect to login page */}
//         <Route path="/file/:filename" element={<FileDetail />} />
//         <Route path="/scraped-files" element={<ScrapedFiles />} />
//       </Routes>
//     </Router>

//   );
// }

// export default App;


