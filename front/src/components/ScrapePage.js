// import React, { useState } from 'react';

// const ScrapePage = () => {
//   const [url, setUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleInputChange = (event) => {
//     setUrl(event.target.value);
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       setError("Please enter a valid URL starting with http:// or https://");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:4300/api/scrape", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to scrape URL");
//       }

//       const data = await response.json();
//       localStorage.setItem("ScrapedFiles", JSON.stringify(data.articles));
//       // Navigate to the Scraped Files page
//       window.location.href = "/scraped-files";
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Scrape a URL</h1>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="url" 
//           value={url} 
//           onChange={handleInputChange} 
//           placeholder="Enter URL to scrape" 
//         />
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Scraping..." : "Scrape"}
//         </button>
//       </form>
//       {error && <div className="error-message">{error}</div>}
//     </div>
//   );
// };

// export default ScrapePage;

//first code



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ScrapePage.css';

// export default function ScrapePage() {
//     const [url, setUrl] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     // Handle URL input
//     const handleInputChange = (e) => {
//         setUrl(e.target.value);
//         setError('');
//     };

//     // Submit form to scrape URL
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         // URL validation
//         if (!url.startsWith('http://') && !url.startsWith('https://')) {
//             setError('Please enter a valid URL starting with http:// or https://');
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:4300/api/scrape', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ website_url: url }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to scrape URL');
//             }

//             navigate('/scraped-files'); // Navigate to scraped files page after success
//         } catch (err) {
//             setError(err.message || 'An error occurred');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="scraping-page">
//             <h1>Scraping Website</h1>
//             <div className="scraping-form-container">
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="url"
//                         placeholder="Enter Website URL"
//                         value={url}
//                         onChange={handleInputChange}
//                         disabled={isLoading}
//                     />
//                     <button type="submit" disabled={isLoading}>
//                         {isLoading ? 'Scraping...' : 'Scrape'}
//                     </button>
//                 </form>
//                 {error && <p className="scraping-error">{error}</p>}
//             </div>
//         </div>
//     );
// }


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// //import './ScrapingPage.css';
// //import Navbar from '../components/Navbar';

// export default function ScrapePage() {
//     const [url, setUrl] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     // Handle URL input
//     const handleInputChange = (e) => {
//         setUrl(e.target.value);
//         setError('');
//     };

//     // Submit form to scrape URL
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError('');

//         try {
//             const response = await fetch('http://localhost:4300/api/scrape', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ website_url: url }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to scrape URL');
//             }

//             navigate('/scraped-files'); // Navigate to scraped files page after success
//         } catch (err) {
//             setError(err.message || 'An error occurred');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="scraping-page">
//             <h1>Scraping Website</h1>
//             <div className="scraping-form-container">
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="url"
//                         placeholder="Enter Website URL"
//                         value={url}
//                         onChange={handleInputChange}
//                         disabled={isLoading}
//                     />
//                     <button type="submit" disabled={isLoading}>
//                         {isLoading ? 'Scraping...' : 'Scrape'}
//                     </button>
//                 </form>
//                 {error && <p className="scraping-error">{error}</p>}
//             </div>
//         </div>
//     );
// }



import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

const ScrapePage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [scrapedText, setScrapedText] = useState('');
  //const navigate = useNavigate(); // Hook to navigate programmatically

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate URL
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("Please enter a valid URL starting with http:// or https://");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch scraped data from the backend
      const response = await fetch("http://localhost:4300/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape URL");
      }

      const data = await response.json();
      setScrapedText(data.scraped_text);  // Store the scraped text for display
      localStorage.setItem("ScrapedFiles", JSON.stringify(data.articles));

      // Navigate to /scraped-files after a short delay
      // setTimeout(() => {
      //   // Pass the scraped data via navigate state
      //   navigate('/scraped-files', { state: { scrapedText: data.scraped_text } });
      // }, 2000);  // 2-second delay before redirect

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Scrape a URL</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="url" 
          value={url} 
          onChange={handleInputChange} 
          placeholder="Enter URL to scrape" 
           className="url-input"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Scraping..." : "Scrape"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {scrapedText && (
        <div className="scraped-text">
          <h3>Scraped Content:</h3>
          <p>{scrapedText}</p>
        </div>
      )}
    </div>
  );
};

export default ScrapePage;


//correct code very correct
// import React, { useState } from 'react';

// const ScrapePage = () => {
//   const [url, setUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [scrapedText, setScrapedText] = useState('');

//   const handleInputChange = (event) => {
//     setUrl(event.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       setError("Please enter a valid URL starting with http:// or https://");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:4300/api/scrape", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to scrape URL");
//       }

//       const data = await response.json();
//       setScrapedText(data.scraped_text);  // Store the scraped text for display
//       localStorage.setItem("ScrapedFiles", JSON.stringify(data.articles));

//       // Introduce a small delay before redirecting
//       setTimeout(() => {
//         window.location.href = "/scraped-files";  // Redirect to scraped files page after a delay
//       }, 2000);  // Delay of 2 seconds before redirect
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Scrape a URL</h1>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="url" 
//           value={url} 
//           onChange={handleInputChange} 
//           placeholder="Enter URL to scrape" 
//         />
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Scraping..." : "Scrape"}
//         </button>
//       </form>
//       {error && <div className="error-message">{error}</div>}
//       {scrapedText && (
//         <div className="scraped-text">
//           <h3>Scraped Content:</h3>
//           <p>{scrapedText}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScrapePage;







// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ScrapePage = () => {
//   const [url, setUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (event) => {
//     setUrl(event.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       setError("Please enter a valid URL starting with http:// or https://");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:4300/api/scrape", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to scrape URL");
//       }

//       const data = await response.json();
//       localStorage.setItem("ScrapedFiles", JSON.stringify(data.articles));

//       // Navigate to the ScrapedFiles component
//       navigate('/scraped-files');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Scrape a URL</h1>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="url" 
//           value={url} 
//           onChange={handleInputChange} 
//           placeholder="Enter URL to scrape" 
//         />
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Scraping..." : "Scrape"}
//         </button>
//       </form>
//       {error && <div className="error-message">{error}</div>}
//     </div>
//   );
// };

// export default ScrapePage;

// import React, { useState } from 'react';

// const ScrapePage = () => {
//   const [url, setUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [scrapedText, setScrapedText] = useState('');

//   const handleInputChange = (event) => {
//     setUrl(event.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       setError("Please enter a valid URL starting with http:// or https://");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:4300/api/scrape", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to scrape URL");
//       }

//       const data = await response.json();
//       setScrapedText(data.scraped_text);  // Store the scraped text for display
//       localStorage.setItem("ScrapedFiles", JSON.stringify(data.articles));
//       // Navigate to the Scraped Files page
//       window.location.href = "/scraped-files";
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Scrape a URL</h1>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="url" 
//           value={url} 
//           onChange={handleInputChange} 
//           placeholder="Enter URL to scrape" 
//         />
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Scraping..." : "Scrape"}
//         </button>
//       </form>
//       {error && <div className="error-message">{error}</div>}
//       {scrapedText && (
//         <div className="scraped-text">
//           <h3>Scraped Content:</h3>
//           <p>{scrapedText}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScrapePage;
