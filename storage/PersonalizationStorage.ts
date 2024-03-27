import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";

interface IRoomInteractionStorage {
    storePreference(preference: any): Promise<void>;
    getPreference(roomId: string): Promise<any>;
    clearPreference(roomId: string): Promise<void>;
}

export class PreferenceStorage implements IRoomInteractionStorage {
    private roomId: string;
    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead,
        roomId: string
    ) {
        this.roomId = roomId;
    }

    public async storePreference(preferences: any): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.ROOM,
            `${this.roomId}#Preferences`
        );
        await this.persistence.updateByAssociation(
            association,
            { preferences: preferences },
            true
        );
    }

    public async getPreference(): Promise<any> {
        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                `${this.roomId}#Preferences`
            );
            const result = await this.persistenceRead.readByAssociation(
                association
            );
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    public async clearPreference(): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.ROOM,
            `${this.roomId}#Preferences`
        );
        await this.persistence.removeByAssociation(association);
    }
}
