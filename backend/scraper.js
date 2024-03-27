const http = require("http");
const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeWebsite(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const olElement = $("ol.gs-u-m0.gs-u-p0.lx-stream__feed.qa-stream");
        const textItems = olElement
            .find("li")
            .map((index, element) => $(element).text())
            .get();

        const allText = textItems.join("\n");

        return allText;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

async function generateResponse(scrapedText) {
    const apiKey = "AIzaSyCb3VI30T90hTPATeJdt_tVV3WT0m-jYR8";
    const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        apiKey;

    const requestData = {
        contents: [
            {
                parts: [
                    {
                        text: `Generate a concise summary of the news article provided, adhering to the following guidelines:

                        Remove Introductory Text: Omit any text preceding the main content of the news article, including phrases like "Posted at," "Copy this link," or similar indicators.

                        Use Text: Use text following the "Posted at" segment, as it will contain the relevant parts of the news.

                        Eliminate Social Media Text: Exclude any text related to sharing the article on social media platforms such as Facebook, Twitter, etc. Ensure the summary does not contain references specific to social media.

                        Concise and Clear: Provide a succinct summary that captures the key points, main events, and significant details of the news article. The summary should be easy to understand and free from unnecessary elaboration.

                        Generate the summary with these guidelines under 300 words making sure you only return summary with no heading or extra information. Scraped news article: ${scrapedText}`,
                    },
                ],
            },
        ],
    };

    try {
        const response = await axios.post(url, requestData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
        console.error("There was a problem with the request:", error);
        throw error;
    }
}



const server = http.createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/scrape") {
        let data = "";

        req.on("data", (chunk) => {
            data += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const websiteUrl = data.trim();
                const scrapedText = await scrapeWebsite(websiteUrl);
                const response = await generateResponse(scrapedText);
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(response);
            } catch (error) {
                console.error("Error:", error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error scraping or generating response");
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found");
    }
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
