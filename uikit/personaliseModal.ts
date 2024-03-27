import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { BlockElementType } from "@rocket.chat/apps-engine/definition/uikit";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { TextObjectType } from "@rocket.chat/apps-engine/definition/uikit/blocks";

export function createModalBlock(
    modify: IModify,
    settings: any,
    viewId?: string
): IUIKitModalViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

    let sourceSelectOptions: any[] = [];
    let countrySelectOptions: any[] = [];

    if (settings.sourceSetting.includes("bbcnews")) {
        sourceSelectOptions.push({
            value: "bbcnews",
            text: {
                text: "BBC-News",
                type: TextObjectType.PLAINTEXT,
            },
        });
    }
    if (settings.sourceSetting.includes("techcrunch")) {
        sourceSelectOptions.push({
            value: "techcrunch",
            text: {
                text: "Techcrunch",
                type: TextObjectType.PLAINTEXT,
            },
        });
    }
    if (settings.sourceSetting.includes("newsapi")) {
        sourceSelectOptions.push({
            value: "newsapi",
            text: {
                text: "NewsAPI",
                type: TextObjectType.PLAINTEXT,
            },
        });
    }

    if (settings.countrySetting.includes("in")) {
        countrySelectOptions.push({
            value: "in",
            text: {
                text: "India",
                type: TextObjectType.PLAINTEXT,
            },
        });
    }
    if (settings.countrySetting.includes("us")) {
        countrySelectOptions.push({
            value: "us",
            text: {
                text: "United States",
                type: TextObjectType.PLAINTEXT,
            },
        });
    }

    let sourceSelect = blocks.newMultiStaticElement({
        placeholder: {
            text: "Choose your news providers",
            type: TextObjectType.PLAINTEXT,
        },
        actionId: "sourceAction",
        options: sourceSelectOptions,
    });

    let countrySelect = blocks.newMultiStaticElement({
        placeholder: {
            text: "Choose your favourite countries",
            type: TextObjectType.PLAINTEXT,
        },
        actionId: "countryAction",
        options: countrySelectOptions,
    });

    blocks.addInputBlock({
        label: {
            text: "Select your news provider",
            type: TextObjectType.PLAINTEXT,
        },
        element: sourceSelect,
        blockId: "sourceSelectId",
    });

    blocks.addInputBlock({
        label: {
            text: "Select your favourite countries",
            type: TextObjectType.PLAINTEXT,
        },
        element: countrySelect,
        blockId: "countrySelectId",
    });

    return {
        id: viewId || "personaliseModal",
        title: blocks.newPlainTextObject("Personlise News App"),
        submit: blocks.newButtonElement({
            text: blocks.newPlainTextObject("Submit"),
        }),
        blocks: blocks.getBlocks(),
    };
}
