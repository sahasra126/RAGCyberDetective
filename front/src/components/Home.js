
// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import './Home.css'; // Assuming the CSS file is named Home.css

// // function Home() {
// //   return (
// //     <div className="home-container">
// //       <div className="qa-section">
// //         <Link to="/qa">
// //           <button className="qa-button">Go to Q&A Section</button>
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;
// // const Home = () => {
// //     return (
// //         <div>
// //             <h1>Home Page</h1>
// //         </div>
// //      );
// // }

// // export default Home;

// //gap

// // import React, { useState } from 'react';
// // import { useNavigate ,Link } from 'react-router-dom'; // Import Link from react-router-dom

// // const Home = () => {
// //     const [url, setUrl] = useState('');
// //     const [result, setResult] = useState(null);
// //     const [error, setError] = useState('');
// //     const navigate = useNavigate();

// //     const handleInputChange = (e) => {
// //         setUrl(e.target.value);
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setError(''); // Reset error state

// //         if (!url.startsWith('http://') && !url.startsWith('https://')) {
// //             setError('Please enter a valid URL that starts with http:// or https://');
// //             return;
// //         }

// //         try {
// //             const response = await fetch('/api/scrape', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({ url }),
// //             });
// //             console.log('Response status:', response.status);
// //             const responseText = await response.text(); // Read the response as text
// //             console.log('Response text:', responseText);
// //             if (!response.ok) {
// //                 let errorData;
// //                 try {
// //                     errorData = JSON.parse(responseText);
// //                 } catch {
// //                     errorData = { error: responseText }; // Fallback to the text response
// //                 }

// //                 //const errorData = JSON.parse(responseText);
// //               //  const errorData = await response.json(); // Get error details
// //             throw new Error(errorData.error || 'Failed to scrape URL');
// //             }
// //             //const data = await response.json();
// //             const data = JSON.parse(responseText);
// //             localStorage.setItem('scrapedFiles', JSON.stringify(data.files));
// //             navigate('/scraped-files');

// //            // const data = await response.json();
// //             setResult(data.title); // Example: display the scraped title
// //         } catch (err) {
// //             setError(err.message);
// //         }
// //     };

// //     return (
// //         <div className="container">
// //             <div className="header">
// //                 <div className="text">Web Scraper</div>
// //                 <div className="underline"></div>
// //             </div>
// //             <form className="inputs" onSubmit={handleSubmit}>
// //                 <div className="input">
// //                     <input
// //                         type="url"
// //                         placeholder="Enter URL to scrape"
// //                         value={url}
// //                         onChange={handleInputChange}
// //                     />
// //                 </div>
// //                 <div className="submit-container">
// //                     <button type="submit" className="submit">Scrape</button>
// //                 </div>
// //             </form>
// //             {error && <div className="error-message">{error}</div>}
// //             {result && (
// //                 <div className="result">
// //                     <h2>Scraped Title:</h2>
// //                     <p>{result}</p>
// //                 </div>
// //             )}
// //             <div className="register-section">
// //                 <span>Don't have an account?</span>
// //                 <Link to="/signup">Register</Link> {/* Link to the signup page */}
// //             </div>
// //         </div>
// //     );
// // };

// // export default Home;
// import './Home.css';
// import React from "react";
// import { useNavigate } from "react-router-dom";
// //import axios from 'axios';

// const Home = () => {
//   //const [url, setUrl] = useState("");
//   //const [isLoading, setIsLoading] = useState(false);
//   //const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // const handleInputChange = (event) => {
//   //   setUrl(event.target.value);
//   // };
//   const handleMLModelClick = () => {
//     navigate("/ml-model-page");
//   };
//   const handleScrapeClick = () => {
//     navigate('/scrape'); // Navigate to the ScrapePage component
//   };
//   const handleDatabaseViewClick = () => {
//     navigate('/view-dataset'); // Navigate to the Database View page
//   };

 
  
// //   // Handle form submit for scraping the URL
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsLoading(true); // Set loading state to true
// //     setError(""); // Clear any existing errors

// //     // Validate if the URL starts with http or https
// //     if (!url.startsWith("http://") && !url.startsWith("https://")) {
// //       setError("Please enter a valid URL that starts with http:// or https://");
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       console.log("Sending request to scrape:", url);
// //       // Use the full URL for the fetch request
// //       const response = await fetch("http://localhost:4000/api/scrape", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ url }),
// //       });
// // console.log(response)
// // console.log("Response status:", response.status, response.statusText);
// // console.log("Response URL:", response.url);
// //       // Check if the response is ok
// //       // if (!response.ok) {
// //       //   const errorData = await response.json();
// //       //   console.error("Server responded with error:", errorData);
// //       //   throw new Error(errorData.error || "Failed to scrape URL");
// //       // }
// //       if (!response.ok) {
// //         const errorText = await response.text(); // Get raw text if parsing fails
// //         console.error("Error response text:", errorText);
  
// //         let errorData;
// //         try {
// //           errorData = JSON.parse(errorText); // Attempt to parse as JSON
// //         } catch (err) {
// //           errorData = { error: errorText }; // Fallback to raw text
// //         }
  
// //         console.error("Parsed error data:", errorData);
// //         throw new Error(errorData.error || "Failed to scrape URL");
// //       }
  
// //       // If successful, process the response
// //       const data = await response.json();
// //       console.log("Response data:", data);

// //       // Store scraped files in localStorage and navigate to ScrapedFiles
// //       localStorage.setItem("ScrapedFiles", JSON.stringify(data.articles)); // Adjust based on your response structure
// //       navigate("/scraped-files"); // Navigate to ScrapedFiles component
// //     } catch (err) {
// //       // Set any error messages
// //       setError(err.message);
// //     } finally {
// //       setIsLoading(false); // Reset loading state
// //     }
// //   };
  

//   return (
//     <div className="container">
//       {/* <div className="header">
//         <div className="text">Web Scraper</div>
//         <div className="underline"></div>
//       </div> */}
//       {/* <form className="inputs" onSubmit={handleSubmit}>
//         <div className="input">
//           <input
//             type="url"
//             placeholder="Enter URL to scrape"
//             value={url}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div className="submit-container">
//           <button type="submit" className="submit" disabled={isLoading}>
//             {isLoading ? "Scraping..." : "Scrape"}
//           </button>
//         </div>
//       </form> */}
//        {/* Heading */}
//        <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px" }}>
//         RAG CYBER DETECTION - P. SAHASRA, 22BD1A0598
//       </h1>
      
//       <div className="scraper-section">
        
//         <button 
//           onClick={handleScrapeClick} 
//           style={{ padding: "10px 20px", fontSize: "16px" }}
//         >
//           Web Scraper
//         </button>
//       </div>
//       {/* Q&A Button */}
//       <div className="qa-section">
//         <button className="qa-button" onClick={() => navigate("/qa")}>
//           Go to Q&A Section
//         </button>
//       </div>
//       <div style={{ textAlign: "center", marginTop: "20px" }}>
//       {/* <h1>Welcome to the ML Platform</h1> */}
//        <button onClick={handleMLModelClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
//         ML Model
//       </button>
//       <div className="database-view-section" style={{ textAlign: "center", marginTop: "20px" }}>
//         <button 
//           onClick={handleDatabaseViewClick} 
//           style={{ padding: "10px 20px", fontSize: "16px" }}
//         >
//           Database View
//         </button>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Home;
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const NavigationButton = ({ text, onClick, className = "" }) => (
    <button 
      onClick={onClick}
      className={`
        flex items-center justify-center 
        space-x-2 
        px-6 py-3 
        bg-gradient-to-r from-blue-500 to-purple-600 
        text-white 
        rounded-lg 
        shadow-lg 
        hover:shadow-xl 
        transition-all duration-300 
        transform hover:-translate-y-1 
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-2 
        focus:ring-blue-500
        ${className}
      `}
    >
      <span className="text-lg font-semibold">{text}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
          RAG CYBER DETECTION
        </h1>
        
        <div className="space-y-4">
          <NavigationButton 
            text="Web Scraper"
            onClick={() => navigate("/scrape")}
          />
          
          <NavigationButton 
            text="Q&A Section"
            onClick={() => navigate("/qa")}
          />
          
          <NavigationButton 
            text="ML Model"
            onClick={() => navigate("/ml-model-page")}
          />
          
          <NavigationButton 
            text="Database View"
            onClick={() => navigate("/view-dataset")}
            className="bg-gradient-to-r from-green-500 to-teal-600"
          />
        </div>
        
        <div className="text-center text-gray-500 mt-4">
          <p className="text-sm">
            Project by P. Sahasra, 22BD1A0598
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
