const http = require('http');
const Parser = require('rss-parser');
const parser = new Parser();

const rssFeedUrl = 'https://feeds.bbci.co.uk/news/rss.xml';

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/bbcrss') {
    try {

      console.log("GET Request Received");
      const feed = await parser.parseURL(rssFeedUrl);
      console.log("BBC News RSS feed parsed");
      const responseData = {
        title: feed.title,
        description: feed.description,
        items: feed.items.map(item => ({
          title: item.title,
          link: item.link,
          description: item.contentSnippet,
          pubDate: item.pubDate
        }))
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      console.log("Successful -> Returning Response ...");
      res.end(JSON.stringify(responseData));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      console.log("Failed to fetch RSS feed");
      res.end(JSON.stringify({ error: 'Error fetching or parsing the RSS feed' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    console.log("Invalid GET Request");
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
