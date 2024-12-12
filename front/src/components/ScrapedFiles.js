

// //actual correct one
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import './ScrapePage.css'

// const ScrapedFiles = () => {
//     const [files, setFiles] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:4300/api/scraped-files')
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then((data) => {
//                 console.log(data); // Debugging
//                 setFiles(data.articles || []); // Adjust based on your API response structure
//             })
//             .catch((error) => console.error('Error fetching files:', error));
//     }, []);

//     return (
//         <div className="scraped-files-container">
//             <h2>Scraped Files</h2>
//             <ul className="file-list">
//                 {files.map((file) => (
//                     <li key={file.file_name}>
//                         <Link to={`/file/${file.file_name}`}>{file.file_name} (URL: {file.url})</Link>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default ScrapedFiles;

import React from 'react';
import { useLocation } from 'react-router-dom';
import './ScrapedFiles.css'
const ScrapedFiles = () => {
  const location = useLocation();
  const scrapedText = location.state?.scrapedText; // Access scraped text from state

  return (
    <div className="container">
      <h1>Scraped Files</h1>
      {scrapedText ? (
        <div className="scraped-content">
          <h3>Scraped Content:</h3>
          <p>{scrapedText}</p>
        </div>
      ) : (
        <p>No scraped content available. Please try scraping a URL first.</p>
      )}
    </div>
  );
};

export default ScrapedFiles;
