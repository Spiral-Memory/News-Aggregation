# News Aggregation App

This repository contains a News Aggregation app for Rocket Chat. The app allows you to aggregate news from various sources and share them within your Rocket Chat instance.

## Installation

To install this app, follow these steps:

1. Clone this repository to your local machine:

```
git clone https://github.com/your-username/your-repo.git
```

2. Navigate to the `News-Aggregation` directory.

3. Open a command window and run the following command:

```
rc-apps deploy --url host_url --username your_username --password your_password
```

Make sure to replace `host_url`, `your_username`, and `your_password` with your Rocket Chat server URL, username, and password respectively.

Note: You must have a Rocket Chat server set up. If you haven't set up a Rocket Chat server yet, follow this [link](https://developer.rocket.chat/open-source-projects/server/server-environment-setup) for instructions.

4. Once the app is installed, you also need to start the RSS parser and scraper. Since npm packages are experimental to use in rc-apps, external services are used for this prototype version.

## Features

After installation, you can try out all the features of this app. Here's a video demonstrating all the features:

[News Aggregation App Features Video](https://drive.google.com/drive/folders/1yOnNJ4UucZqH91ZbXo0XVz0VMkkfqDL4?usp=sharing)
