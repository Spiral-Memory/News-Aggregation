import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { NewsAggregationApp } from "../NewsAggregationApp";
import { RoomInteractionStorage } from "../storage/RoomInteraction";
import { PreferenceStorage } from "../storage/PersonalizationStorage";

export class ExecuteViewSubmitHandler {
    constructor(
        private readonly app: NewsAggregationApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly modify: IModify,
        private readonly persistence: IPersistence
    ) {}

    public async run(context: UIKitViewSubmitInteractionContext) {
        const { user, view } = context.getInteractionData();
        console.log(view.state);
        const persistenceRead = this.read.getPersistenceReader();
        const roomInteractionStorage = new RoomInteractionStorage(
            this.persistence,
            persistenceRead,
            user.id
        );
        const roomId = await roomInteractionStorage.getInteractionRoomId();
        const preferenceStorage = new PreferenceStorage(
            this.persistence,
            persistenceRead,
            roomId
        );
        await preferenceStorage.storePreference(view.state);
        await roomInteractionStorage.clearInteractionRoomId();
        return {
            success: true,
        };
    }
}
