# News Aggregation App

This repository contains a News Aggregation app for Rocket Chat. The app allows you to aggregate news from various sources and share them within your Rocket Chat instance.

## Installation

To install this app, follow these steps:

1. Clone this repository to your local machine:

```
git clone https://github.com/Spiral-Memory/News-Aggregation
```

2. Navigate to the `News-Aggregation` directory.

3. Open a command window and run the following command:

```
rc-apps deploy --url host_url --username your_username --password your_password
```

Make sure to replace `host_url`, `your_username`, and `your_password` with your Rocket Chat server URL, username, and password respectively.

Note: You must have a Rocket Chat server set up. If you haven't set up a Rocket Chat server yet, follow this [link](https://developer.rocket.chat/open-source-projects/server/server-environment-setup) for instructions.

4. Once the app is installed, you also need to start the RSS parser and scraper. Since npm packages are experimental to use in rc-apps, external services are used for this prototype version.

To start the RSS parser and scraper, follow these steps:

- Go to the root directory of the project.
- Navigate to the `backend` folder.
- Use `node scraper.js` and `node rssparser.js` in 2 separate instances of terminal.


## Features

This app currently supports 3 news aggregators: BBC News, TechCrunch, and NewsAPI, depending on what organization admin have enabled. It supports personalization at 3 levels: Workspace level controlled by the admin of the Rocket Chat server, DM level, and channel level personalization.

To enable different news providers at the organization level, follow these steps:

1. Go to RC app settings by clicking on the three dots present in the Rocket Chat app sidebar.
2. Navigate to "Installed," then "Private Apps."
3. Choose the "News Aggregation" app and then select "Settings."
4. Enable/disable the news provider you want and provide required API keys to enable those services.
5. To enable Google search and finding relevant articles, add the search engine CX ID as well. To generate that, information can be found [here](https://developers.google.com/custom-search/v1/overview).
6. Once these features are enabled, navigate to any channel or DM, and use the command /personalize to perform personalization at the local level. Afterward, use the commands `/get-news techcrunch`, `/get-news bbcnews`, or `/get-news newsapi` to fetch the news from the respective sources. To summarize the content and find relevant articles, click on the "More" option for that message and then select either "Get Relevant Articles" or "Summarize News" based on your preference.

Feel free to try out different features of this app. Here's a video demonstrating all the features:

[News Aggregation App Features Video](https://drive.google.com/drive/folders/1yOnNJ4UucZqH91ZbXo0XVz0VMkkfqDL4?usp=sharing)
