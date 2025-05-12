const express = require('express');
const fetch = require('node-fetch');
const TurndownService = require('turndown');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/scrapes', express.static(path.join(__dirname, 'scrapes')));
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const html = await response.text();
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(html);
    const fileName = `scrape-${Date.now()}.md`;
    const dirPath = path.join(__dirname, 'scrapes');
    fs.mkdirSync(dirPath, { recursive: true });
    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, markdown);
    res.json({ markdown, fileName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
