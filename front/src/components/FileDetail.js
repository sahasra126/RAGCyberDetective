import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FileDetail = () => {
    const { filename } = useParams(); // Get filename from the URL parameters
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFileContent = async () => {
            try {
                const encodedFilename = encodeURIComponent(filename); // Ensure proper encoding
                const response = await fetch(`http://localhost:4300/api/scraped-files/${encodedFilename}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch file content');
                }
                const data = await response.json();
                setFileContent(data.scraped_content || ''); // Access the correct property
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFileContent();
    }, [filename]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="file-detail">
            <h2>File: {filename}</h2>
            <p>{fileContent}</p>
        </div>
    );
};

export default FileDetail;
