import { WithTranslation } from 'react-i18next';

import { IStore } from '../app/types';

export interface IMessage {
    displayName: string;
    error?: Object;
    id: string;
    isReaction: boolean;
    lobbyChat: boolean;
    message: string;
    messageId: string;
    messageType: string;
    privateMessage: boolean;
    reactions: Array<String>;
    recipient: string;
    timestamp: number;
}

/**
 * The type of the React {@code Component} props of {@code AbstractChat}.
 */
export interface IChatProps extends WithTranslation {

    /**
     * All the chat messages in the conference.
     */
    _messages: IMessage[];

    /**
     * Number of unread chat messages.
     */
    _nbUnreadMessages: number;

    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
}

export interface IChatMessageProps extends WithTranslation {

    /**
     * Whether the message can be reacted to.
     */
    canReact?: boolean;

    /**
     * Whether the message can be replied to.
     */
    canReply?: boolean;

    /**
     * Whether the kebab menu is visible from one's own chat message.
     */
    kebabMenuSelfVisible?: boolean;

    /**
     * Whether the kebab menu is visible from someone else's message.
     */
    kebabMenuVisible?: boolean;

    /**
     * Whether current participant is currently knocking in the lobby room.
     */
    knocking?: boolean;

    /**
     * The representation of a chat message.
     */
    message: IMessage;

    /**
     * Whether or not the avatar image of the participant which sent the message
     * should be displayed.
     */
    showAvatar?: boolean;

    /**
     * Whether or not the name of the participant which sent the message should
     * be displayed.
     */
    showDisplayName: boolean;

    /**
     * Whether or not the time at which the message was sent should be
     * displayed.
     */
    showTimestamp: boolean;
}
