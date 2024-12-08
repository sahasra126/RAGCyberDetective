// import React, { useState } from 'react';
// import './QAPage.css';

// const QAPage = () => {
//   const [question, setQuestion] = useState('');
//   const [scrapedContent, setScrapedContent] = useState('');
//   const [predictedAnswer, setPredictedAnswer] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     if (id === 'question') setQuestion(value);
//     else if (id === 'scrapedContent') setScrapedContent(value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:4000/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question, scraped_content: scrapedContent }),
//       });

//       if (!response.ok) {
//         throw new Error('Error fetching answer');
//       }

//       const data = await response.json();
//       console.log('Response from backend:', data); // Log response for debugging
//       setPredictedAnswer(data.predicted_answer);
//     } catch (error) {
//       console.error('Error:', error);
//       setPredictedAnswer('Unable to fetch the answer. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>QA Page</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="question">Question:</label>
//           <input
//             id="question"
//             type="text"
//             value={question}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="scrapedContent">Scraped Content:</label>
//           <textarea
//             id="scrapedContent"
//             value={scrapedContent}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? 'Fetching...' : 'Get Answer'}
//         </button>
//       </form>

//       {/* Display the predicted answer */}
//       {predictedAnswer && (
//         <div>
//           <h3>Predicted Answer:</h3>
//           <p>{predictedAnswer}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QAPage;


import React, { useState } from "react";
import "./QAPage.css"; // Add styling here if needed

const QAPage = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [bleuScore, setBleuScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.answer);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };


  // Handle accuracy button click
  const handleAccuracy = async () => {
    setAccuracy(null);
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/evaluate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ question }),
      });

      const data = await res.json();
      console.log("Accuracy response from server:", data);
      if (res.ok) {
        setAccuracy(data.accuracy);  // Update accuracy from response
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Handle BLEU score button click
  // const handleBleuScore = async () => {
  //   setBleuScore(null);
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const res = await fetch("http://localhost:4000/api/evaluate", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // body: JSON.stringify({ question }),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       setBleuScore(data.bleu_score);  // Update BLEU score from response
  //     } else {
  //       setError(data.message || "Something went wrong.");
  //     }
  //   } catch (err) {
  //     setError("Error connecting to the server.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="qa-container">
      <h1>Question-Answering System</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="question">Enter your question:</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Get Answer"}
        </button>
      </form>
      {/* Display accuracy */}
      <button onClick={handleAccuracy} disabled={loading}>Get Accuracy</button>
      {accuracy !== null && (
        <div className="accuracy">
          <strong>Accuracy:</strong> {accuracy}%
        </div>
      )}

      {/* Display BLEU score */}
     
      {response && <div className="response"><strong>Answer:</strong> {response}</div>}
      {error && <div className="error"><strong>Error:</strong> {error}</div>}
    </div>
  );
};

export default QAPage;

 