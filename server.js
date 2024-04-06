const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile('access.log', log, (err) => {
    if (err) console.error(err);
  });
  next();
});

app.post('/createFile', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content) {
    return res.status(400).send('Both filename and content are required.');
  }
  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error occurred while writing the file.');
    }
    res.status(200).send('File created successfully.');
  });
});

app.get('/getFiles', (req, res) => {
  fs.readdir('.', (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error occurred while reading files.');
    }
    res.json(files);
  });
});

app.get('/getFile', (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).send('Filename parameter is required.');
  }
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(400).send('File not found.');
    }
    res.send(data);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
