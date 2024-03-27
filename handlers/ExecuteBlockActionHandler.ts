import {
    IHttp,
    IMessageExtender,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    IUIKitResponse,
    UIKitActionButtonInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { NewsAggregationApp } from "../NewsAggregationApp";
import {
    IMessage,
    IMessageAttachment,
} from "@rocket.chat/apps-engine/definition/messages";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export class ExecuteActionButtonHandler {
    private context: UIKitActionButtonInteractionContext;
    constructor(
        protected readonly app: NewsAggregationApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitActionButtonInteractionContext
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { actionId, user, room, triggerId, message } =
            this.context.getInteractionData();

        switch (actionId) {
            case "summarise":
                const messageText: string | undefined = message?.text;
                const messageId: string = message?.id as string;
                const sender: IUser = message?.sender as IUser;

                const pattern: RegExp = /(https?|http):\/\/\S+/;
                const match: RegExpMatchArray | null | undefined =
                    messageText?.match(pattern);


                if (match) {
                    const link: string = match[0];

                    const response = await this.http.post(
                        "http://localhost:3002/scrape",
                        {
                            headers: { "Content-type": "application/json" },
                            content: link,
                        }
                    );

                    console.log(response.content);

                    const messageExtender = await this.getMessageExtender(
                        messageId,
                        sender,
                        this.modify
                    );
                    messageExtender.addCustomField("key", 1);
                    const messageAttachment: IMessageAttachment = {
                        text: "News Summary: " + response.content,
                    };
                    messageExtender.addAttachment(messageAttachment);
                    await this.modify.getExtender().finish(messageExtender);
                }
        }

        return this.context.getInteractionResponder().successResponse();
    }

    private async getMessageExtender(
        messageId: string,
        sender: IUser,
        modify: IModify
    ): Promise<IMessageExtender> {
        return modify.getExtender().extendMessage(messageId, sender);
    }
}

// async executePostMessageSent(
//     message: IMessage,
//     read: IRead,
//     http: IHttp,
//     persistence: IPersistence,
//     modify: IModify
// ): Promise<void> {
//     const msgId = message.id as string;
//     const sender = message.sender;
//     const room = message.room;
//     const persistenceRead = read.getPersistenceReader();

//     const association = new RocketChatAssociationRecord(
//         RocketChatAssociationModel.ROOM,
//         ${room.id}#RoomId
//     );
//     const [result] = (await persistenceRead.readByAssociation(
//         association
//     )) as Array<{ language: string }>;

//     const language = result.language;
//     if(!language){
//         const msg = modify.getCreator().startMessage()
//                 .setSender(sender)
//                 .setRoom(room)
//                 .setText("Please set language for translation");

//         read.getNotifier().notifyUser(sender, msg.getMessage());
//         return;
//     }

//     const messageExtender = await this.getMessageExtender(
//         msgId,
//         sender,
//         modify
//     );
//     const value = 1;
//     const text = message?.text as string;
//     const translation = await this.Translator(text,language,http);
//     const Btn: IMessageAction = {
//         type: MessageActionType.BUTTON,
//         text: "SEND",
//         msg_processing_type: MessageProcessingType.SendMessage,
//         msg_in_chat_window: true,
//         is_webview: true,
//     }
//     const translationAttachment: IMessageAttachment = {
//         text: ${translation},
//         actions: [Btn],
//         actionButtonsAlignment: MessageActionButtonsAlignment.HORIZONTAL
//     };

//     messageExtender.addCustomField("key", value);
//     messageExtender.addAttachment(translationAttachment);

//     await modify.getExtender().finish(messageExtender);
// }
