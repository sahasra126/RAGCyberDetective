// import React, { useEffect, useState } from 'react';
// //import { useNavigate } from 'react-router-dom';

// const ScrapedFiles = () => {
//   const [files, setFiles] = useState([]);
//   const [selectedFileContent, setSelectedFileContent] = useState('');
//   //const navigate = useNavigate();

//   useEffect(() => {
//     const storedFiles = localStorage.getItem('scrapedFiles');
//     if (storedFiles) {
//       setFiles(JSON.parse(storedFiles));
//     }
//   }, []);

//   const handleFileClick = async (fileName) => {
//     try {
//       const response = await fetch(`http://localhost:4000/api/scraped-files/${fileName}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch file content");
//       }
//       const data = await response.json();
//       setSelectedFileContent(data.scraped_content);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h2>Scraped Files</h2>
//       <ul>
//         {files.map((file) => (
//           <li key={file.file_name} onClick={() => handleFileClick(file.file_name)}>
//             {file.file_name}
//           </li>
//         ))}
//       </ul>
//       {selectedFileContent && (
//         <div>
//           <h3>File Content</h3>
//           <pre>{selectedFileContent}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScrapedFiles;


//''''''''''''''''''''''''''''''''''''''''



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ScrapePage.css'

const ScrapedFiles = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4300/api/scraped-files')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data); // Debugging
                setFiles(data.articles || []); // Adjust based on your API response structure
            })
            .catch((error) => console.error('Error fetching files:', error));
    }, []);

    return (
        <div className="scraped-files-container">
            <h2>Scraped Files</h2>
            <ul className="file-list">
                {files.map((file) => (
                    <li key={file.file_name}>
                        <Link to={`/file/${file.file_name}`}>{file.file_name} (URL: {file.url})</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScrapedFiles;

//code 2 correct one
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
//                 {files.map((file, index) => (
//                     <li key={index}>
//                         <Link to={`/file/${file.file_name}`}>{file.file_name} (URL: {file.url})</Link>

//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default ScrapedFiles;




// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// const ScrapedFiles = () => {
//     const [files, setFiles] = useState([]); // Initialize as an empty array
//     const [error, setError] = useState(''); // For error messages

//     useEffect(() => {
//         const fetchFiles = async () => {
//             try {
//                 const response = await fetch('http://localhost:4300/api/scraped-files'); // API endpoint
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch files');
//                 }
//                 const data = await response.json();
//                 console.log('Fetched Files:', data); // Debugging API response
//                 setFiles(data || []); // Handle case where data might be null/undefined
//             } catch (err) {
//                 setError(err.message); // Set error if fetch fails
//                 console.error('Error fetching files:', err);
//             }
//         };

//         fetchFiles();
//     }, []);

//     return (
//         <div className="scraped-files">
//             <h2>Scraped Files</h2>
//             {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Display error message */}
//             <ul>
//                 {Array.isArray(files) && files.length > 0 ? ( // Check if files is an array and has elements
//                     files.map((file) => (
//                         <li key={file.file_name}>
//                             <Link to={`/file-detail/${file.file_name}`}>
//                                 {file.file_name} - {file.createdAt ? new Date(file.createdAt).toLocaleString() : 'No Date'}
//                             </Link>
//                         </li>
//                     ))
//                 ) : (
//                     <p>No files available.</p> // Display when no files are available
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default ScrapedFiles;

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// //import { UserContext } from '../../context/userContext';

// const ScrapedFiles = () => {
    
//     const [files, setFiles] = useState([]);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchFiles = async () => {
//             try {
//                 const response = await fetch('http://localhost:4300/api/scraped-files');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch files');
//                 }
//                 const data = await response.json();
//                 setFiles(data);
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error fetching files:', err);
//             }
//         };

//         fetchFiles();
//     }, []);

    

//     return (
//         <div className="scraped-files">
//             {/* Completely remove the Navbar */}
//             <h2>Scraped Files</h2>
//             {error && <p>Error: {error}</p>}
//             <ul>
//                 {files.map(file => (
//                     <li key={file.file_name}>
//                         <Link to={`/file-detail/${file.file_name}`}>
//                             {file.file_name} - {new Date(file.createdAt).toLocaleString()}
//                         </Link>
//                     </li>
//                 ))}
//             </ul>
            
//         </div>
//     );
// };

// export default ScrapedFiles;