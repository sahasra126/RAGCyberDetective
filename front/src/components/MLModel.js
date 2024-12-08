// import React, { useState } from 'react';

// function MLModel() {
//   const [inputText, setInputText] = useState('');
//   const [result, setResult] = useState({});
//   const [error, setError] = useState('');

//   // Function to handle form submission and API request
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Send a POST request to the backend (adjust the URL as needed)
//     const response = await fetch('http://localhost:4200/process_text', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ input_text: inputText }), // Send the input text to the backend
//       });

//       // If the response is successful, parse the result
//       if (response.ok) {
//         const data = await response.json();
//         setResult(data.word_to_entity_map); // Store the result in state
//       } else {
//         throw new Error('Something went wrong with the backend');
//       }
//     } catch (error) {
//       setError(error.message); // Set error if there is an issue
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Word-to-Entity Mapping</h2>

//       {/* Display error message */}
//       {error && <p className="error">{error}</p>}

//       {/* Form for input text */}
//       <form onSubmit={handleSubmit}>
//         <textarea
//           placeholder="Enter text for word-to-entity mapping"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//         />
//         <button type="submit">Get Mapping</button>
//       </form>

//       {/* Display word-to-entity mapping result */}
//       {Object.keys(result).length > 0 && (
//         <div>
//           <h3>Word-to-Entity Mapping:</h3>
//           <ul>
//             {Object.entries(result).map(([word, entity]) => (
//               <li key={word}>
//                 <strong>{word}:</strong> {entity}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MLModel;


import React, { useState } from 'react';
import './MLModel.css'

function MLModel() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState({});
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://localhost:4200/process_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: inputText }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.word_to_entity_map);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Unknown error from the backend');
      }
    } catch (err) {
      setError(`Frontend Error: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Word-to-Entity Mapping</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter text for word-to-entity mapping"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Get Mapping</button>
      </form>
      {Object.keys(result).length > 0 && (
        <div>
          <h3>Word-to-Entity Mapping:</h3>
          <ul>
            {Object.entries(result).map(([word, entity]) => (
              <li key={word}>
                <strong>{word}:</strong> {entity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MLModel;
