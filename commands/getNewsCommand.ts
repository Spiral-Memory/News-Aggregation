import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";

import { App } from "@rocket.chat/apps-engine/definition/App";
import { PreferenceStorage } from "../storage/PersonalizationStorage";

interface NewsData {
    link: string;
    title: string;
    description: string;
    pubDate: string;
}

interface IterableNews {
    iterableData: Array<any>;
}

class NewsProcessor {
    static async processNews(
        http: IHttp,
        url: string,
        context: SlashCommandContext,
        modify: IModify,
        dataHandler: (data: any) => NewsData,
        iterableHandler: (data: any) => IterableNews
    ) {
        const response = await http.get(url);
        const datas = response.data;
        const iterableData = iterableHandler(datas).iterableData;

        if (Array.isArray(iterableData)) {
            iterableData.forEach(async (data) => {
                const newsData = dataHandler(data);
                await this.sendMessage(context, modify, newsData);
            });
        } else {
            console.error("Unexpected data structure:", datas);
        }
    }

    private static async sendMessage(
        context: SlashCommandContext,
        modify: IModify,
        newsData: NewsData
    ) {
        const { link, title, description, pubDate } = newsData;
        const message = `*${title}*\n ${description} \n ${link} \n ${pubDate}`;

        const room = context.getRoom();
        const messageStructure = modify.getCreator().startMessage();
        messageStructure.setRoom(room);
        messageStructure.setText(message);
        await modify.getCreator().finish(messageStructure);
    }
}

class BBCNewsHandler {
    static handleBBCNews(data: any): NewsData {
        const link = data.link;
        const title = data.title;
        const description = data.description;
        const pubDate = data.pubDate;

        return { link, title, description, pubDate };
    }

    static handleBBCNewsData(data: any): IterableNews {
        console.log(data.items);
        return { iterableData: data.items };
    }
}

class TechCrunchHandler {
    static handleTechCrunchNews(data: any): NewsData {
        const link = data.link;
        const titleHTML = data.title.rendered;
        const descriptionHTML = data.excerpt.rendered;
        let description = "";
        let title = "";
        try {
            description = this.parseHTMLDescription(descriptionHTML);
            title = this.parseHTMLDescription(titleHTML);
        } catch (err) {
            console.log(err);
            title = titleHTML;
            description = descriptionHTML;
        }

        const pubDate = data.date;

        return { link, title, description, pubDate };
    }

    static handleTechCrunchNewsData(data: any): IterableNews {
        return { iterableData: data };
    }

    static parseHTMLDescription(html: string): string {
        const plainText = html
            .replace(/<[^>]*>/g, "")
            .replace(/&#\d+;/g, (match) =>
                String.fromCharCode(Number(match.slice(2, -1)))
            );
        const processedText = plainText.replace(/\[&[a-zA-Z]+;\]/g, "");
        return processedText;
    }
}

class NewsApiAggHandler {
    static handleNewsAPI(data: any): NewsData {
        const link = data.url;
        const title = data.title;
        const description = data.description;
        const pubDate = data.publishedAt;

        return { link, title, description, pubDate };
    }

    static handleNewsApiData(data: any): IterableNews {
        return { iterableData: data.articles };
    }
}

export class getNewsCommands implements ISlashCommand {
    app: App;
    constructor(app) {
        this.app = app;
    }
    command: string = "get-news";
    i18nDescription: string = "";
    i18nParamsExample: string = "";
    providesPreview: boolean = false;

    public async sendMessage(context, modify, message) {
        const room = context.getRoom();
        const messageStructure = modify.getCreator().startMessage();
        messageStructure.setRoom(room);
        messageStructure.setText(message);
        await modify.getCreator().finish(messageStructure);
    }

    public async getNews(
        http: IHttp,
        context: SlashCommandContext,
        modify: IModify,
        subcommand,
        sources,
        countries
    ) {
        if (sources.includes(subcommand)) {
            switch (subcommand) {
                case "bbcnews":
                    console.log("Fetching BBC News");
                    await NewsProcessor.processNews(
                        http,
                        "http://localhost:3003/bbcrss",
                        context,
                        modify,
                        BBCNewsHandler.handleBBCNews,
                        BBCNewsHandler.handleBBCNewsData
                    );

                    break;
                case "techcrunch":
                    console.log("Fetching TechCrunch News");
                    await NewsProcessor.processNews(
                        http,
                        "https://techcrunch.com/wp-json/wp/v2/posts",
                        context,
                        modify,
                        TechCrunchHandler.handleTechCrunchNews.bind(
                            TechCrunchHandler
                        ),
                        TechCrunchHandler.handleTechCrunchNewsData.bind(
                            TechCrunchHandler
                        )
                    );
                    break;

                case "newsapi":
                    const api_key = await this.app
                        .getAccessors()
                        .environmentReader.getSettings()
                        .getValueById("news-api-api-key");

                    if (countries.length === 0) {
                        const message =
                            "No Country is selected to fetch news ! ";
                        this.sendMessage(context, modify, message);
                    }

                    countries.forEach(async (country) => {
                        await NewsProcessor.processNews(
                            http,
                            `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${api_key}`,
                            context,
                            modify,
                            NewsApiAggHandler.handleNewsAPI,
                            NewsApiAggHandler.handleNewsApiData
                        );
                    });

                    break;

                default:
                    console.log("Provider not found");
            }
        } else {
            this.sendMessage(
                context,
                modify,
                `${subcommand} source is disabled either locally or globally`
            );
        }
    }

    async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const [subcommand] = context.getArguments();
        if (!subcommand) {
            throw new Error("Error!");
        }

        const room = context.getRoom();
        const persistenceRead = read.getPersistenceReader();
        const preferenceStorage = new PreferenceStorage(
            persis,
            persistenceRead,
            room.id
        );

        const preferences = await preferenceStorage.getPreference();
        console.log("Preference read");
        console.log(preferences);
        if (!(preferences.length === 0)) {
            const sourcePreferece =
                preferences[0].preferences.sourceSelectId.sourceAction;
            const countryPreference =
                preferences[0].preferences.countrySelectId.countryAction;

            this.getNews(
                http,
                context,
                modify,
                subcommand,
                sourcePreferece,
                countryPreference
            );
        } else {
            const globalSource = await this.app
                .getAccessors()
                .environmentReader.getSettings()
                .getValueById("source-select");

            const globalCountries = await this.app
                .getAccessors()
                .environmentReader.getSettings()
                .getValueById("country-select");

            this.getNews(
                http,
                context,
                modify,
                subcommand,
                globalSource,
                globalCountries
            );
        }
    }
}
