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
import { createModalBlock } from "../uikit/personaliseModal";
import { RoomInteractionStorage } from "../storage/RoomInteraction";

export class personliseNews implements ISlashCommand {
    app: App;
    constructor(app) {
        this.app = app;
    }
    command: string = "personalise";
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

    async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const [subcommand] = context.getArguments();
        console.log("Personalise req received");

        const room = context.getRoom();
        const user = context.getSender();

        const persistenceRead = read.getPersistenceReader();
        const roomInteraction = new RoomInteractionStorage(
            persis,
            persistenceRead,
            user.id
        );
        await roomInteraction.storeInteractionRoomId(room?.id);

        const sourceSetting = await this.app
            .getAccessors()
            .environmentReader.getSettings()
            .getValueById("source-select");
        const countrySetting = await this.app
            .getAccessors()
            .environmentReader.getSettings()
            .getValueById("country-select");

        const triggerId = context.getTriggerId() as string;
        const modalBlock = createModalBlock(modify, {
            sourceSetting: sourceSetting,
            countrySetting: countrySetting,
        }, );
        await modify
            .getUiController()
            .openModalView(modalBlock, { triggerId }, user);
    }
}
