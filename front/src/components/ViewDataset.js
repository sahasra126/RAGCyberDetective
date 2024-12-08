import React, { useEffect, useState } from 'react';
import './ViewDataset.css'; // Import the CSS

export default function ViewDataset() {
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dataset');
        console.log(response)
        if (!response.ok) {
          throw new Error('Error fetching dataset');
        }
        const data = await response.json();
        console.log(data);  // Check the structure of the dataset
        setDataset(data.Sheet1 || []);  // Access the Sheet1 array inside the JSON
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDataset();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!dataset || dataset.length === 0) {
    return <div>No data available</div>;
  }

  const keys = dataset[0] ? Object.keys(dataset[0]) : [];

  return (
    <div className="dataset-container">
      <table className="dataset-table">
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataset.map((item, index) => (
            <tr key={index}>
              {keys.map((key) => (
                <td key={key}>{item[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}