const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/User");
const { MongoClient } = require('mongodb');
const app = express();
const path = require('path')
const fs=require('fs')

// Middleware setup
//app.use(cors());
app.use(cors({
  origin: "http://localhost:2000"
}));

app.use(express.json());

// MongoDB Atlas connection
mongoose.connect("mongodb+srv://sahas:sahasra@cluster0.bouhc.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.log(err));

// Register Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Ensure all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Error in registration" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// app.post('/predict', (req, res) => {
//   const { question, scraped_content } = req.body;

//   if (!question || !scraped_content) {
//     return res.status(400).json({ error: 'Missing question or scraped_content' });
//   }

//   // Mock prediction response
//   const predictedAnswer = `Mock answer for question: ${question}`;
//   res.json({ predicted_answer: predictedAnswer });
// });
//for scrapped files
// app.get('/api/scraped-files/:filename', async (req, res) => {
//   const { filename } = req.params;
//   try {
//       const content = await fs.readFile(`path/to/your/files/${filename}`, 'utf-8');
//       res.json({ content });
//   } catch (error) {
//       res.status(404).json({ error: 'File not found' });
//   }
// });


// app.get('/api/scraped-files', (req, res) => {
//   try {
//       // Read the scraped files from the JSON file
//       if (fs.existsSync(scrapedFilesPath)) {
//           const data = fs.readFileSync(scrapedFilesPath, 'utf8');
//           const scrapedFiles = JSON.parse(data);
          
//           if (scrapedFiles.length === 0) {
//               return res.status(404).json({ error: "No scraped files found" });
//           }

//           return res.status(200).json(scrapedFiles);
//       } else {
//           return res.status(404).json({ error: "Scraped files file not found" });
//       }
//   } catch (error) {
//       console.error('Error fetching scraped files:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });


app.post('/api/scrape', (req, res) => {
  const data = req.body;
  const targetSite = data.url;
  console.log(`Received URL: ${targetSite}`);

  if (!targetSite) {
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log(`Scraping URL: ${targetSite}`);
  try {
    const articles = scrapeArticles(targetSite);
    return res.status(200).json({ message: 'Scraping completed', articles: articles });
  } catch (e) {
    return res.status(500).json({ error: 'An error occurred during scraping', details: e.message });
  }
});
app.post('/api/scraped-files', async (req, res) => {
  try {
    const files = await collection.find({}, { projection: { file_name: 1, url: 1 } }).toArray();
    const filesList = files.map((file) => ({ file_name: file.file_name, url: file.url }));
    res.status(200).json({ articles: filesList });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching files', details: err.message });
  }
});
//POST route to get content of a specific scraped file
app.post('/api/scraped-files/:file_name', async (req, res) => {
  const { file_name } = req.params;
  try {
    const file = await collection.findOne({ file_name: file_name });
    if (file) {
      res.status(200).json({ scraped_content: file.scraped_content });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching file content', details: err.message });
  }
});

app.get('/api/dataset', (req, res) => {
  //const filePath = path.join(__dirname, 'backend', 'FinalMergedDatabase.json');
  //const filePath = path.join('C:/Users/P SAHASRA/OneDrive/Desktop/alter/backend/CleanedQuestionsAnswers_NoDiamonds.json');
  const filePath = path.join(__dirname, 'CleanedQuestionsAnswers_NoDiamonds.json');

console.log('Request received for /api/dataset');
console.log('File path:', filePath);

  // Check if the JSON file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Read the JSON file
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read the file' });
    }

    // Parse and send the JSON data
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (err) {
      return res.status(500).json({ error: 'Invalid JSON file' });
    }
  });
});




//

// app.post('/api/scrape', (req, res) => {
//   const { url } = req.body;
//   console.log("Received scrape request for URL:", url);
//   // Implement your scraping logic here
//   if (!url) {
//       return res.status(400).json({ error: "URL is required" });
//   }
//   // Dummy response for testing
//   res.status(200).json({ message: "Scraping successful", url });
// });

// app.get('/api/scraped-files/:fileName', (req, res) => {
//   const fileName = req.params.fileName;

//   // Assuming you have a way to find the content of the file, 
//   // maybe by reading from a database or a filesystem.
//   const file = scrapedFiles.find(f => f.file_name === fileName);

//   if (file) {
//     // Send back the content
//     res.json({ scraped_content: file.content });
//   } else {
//     res.status(404).json({ error: "File not found" });
//   }
// });

// Start server
app.listen(5000,"0.0.0.0", () => {
  console.log("Backend server is running on port 5000");
});
