import {
    ISetting,
    SettingType,
} from "@rocket.chat/apps-engine/definition/settings";

export const settings: ISetting[] = [
    {
        id: "source-select",
        i18nLabel: "Select from supported news providers",
        i18nDescription:
            "Help admins allowing / disallowing a certain news providers",
        type: SettingType.MULTI_SELECT,
        values: [
            { key: "bbcnews", i18nLabel: "BBC-News" },
            { key: "techcrunch", i18nLabel: "Techcrunch" },
            { key: "newsapi", i18nLabel: "News API Aggregator" },
        ],
        required: true,
        public: true,
        packageValue: "",
    },

    {
        id: "country-select",
        i18nLabel: "Select news country wise",
        i18nDescription: "Help admins to choose country specific news",
        type: SettingType.MULTI_SELECT,
        values: [
            { key: "in", i18nLabel: "India" },
            { key: "us", i18nLabel: "United States" },
        ],
        required: true,
        public: true,
        packageValue: "",
    },

    {
        id: "news-api-api-key",
        i18nLabel: "NewsAPI Api key",
        i18nDescription:
            "Provide your NewsApi API key to access news content from this news aggregator",
        type: SettingType.STRING,
        required: true,
        public: false,
        packageValue: "",
    },

    {
        id: "google-search-api-key",
        i18nLabel: "Google Search Api key",
        i18nDescription:
            "Provide your Google Custom Search JSON API key to find matching articles",
        type: SettingType.STRING,
        required: true,
        public: false,
        packageValue: "",
    },

    {
        id: "google-search-engine-id",
        i18nLabel: "Search engine id",
        i18nDescription:
            "Provide your CX id provided by Google Search API",
        type: SettingType.STRING,
        required: true,
        public: false,
        packageValue: "",
    },
];
