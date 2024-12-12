

import React, { useState } from "react";
import './Spacy.css'

const Spacy = () => {
  const [text, setText] = useState("");  // For the input text
  const [entities, setEntities] = useState([]);  // For storing the extracted entities
  const [loading, setLoading] = useState(false);  // For managing loading state
  const [error, setError] = useState("");  // For handling errors

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text) {
      setError("Please enter some text.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send the request to the Flask API
      const response = await fetch("http://localhost:4400/predict-spacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      // Parse the JSON response
      const result = await response.json();

      // If there's an error in the result, show it
      if (result.error) {
        throw new Error(result.error);
      }

      // Set the entities in state
      setEntities(result.entities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-model-spacy">
      <h2>Named Entity Recognition (NER) with SpaCy</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for entity extraction"
          rows="6"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      {entities.length > 0 && (
        <div>
          <h3>Extracted Entities:</h3>
          <ul>
            {entities.map((entity, index) => (
              <li key={index}>
                {/* <strong>{entity.label}:</strong> {entity.text} */}
                <strong>{entity.text}: {entity.label} </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Spacy;
