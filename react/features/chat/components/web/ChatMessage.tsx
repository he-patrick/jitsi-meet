import { Theme } from '@mui/material';
import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { IReduxState } from '../../../app/types';
import { translate } from '../../../base/i18n/functions';
import Message from '../../../base/react/components/web/Message';
import { withPixelLineHeight } from '../../../base/styles/functions.web';
import { getCanReplyToMessage, getFormattedTimestamp, getMessageText, getPrivateNoticeMessage } from '../../functions';
import { IChatMessageProps } from '../../types';

import PrivateMessageButton from './PrivateMessageButton';
import ReactButton from './ReactButton.tsx';
import KebabMenu from './KebabMenu.tsx';

interface IProps extends IChatMessageProps {

    type: string;
}

const useStyles = makeStyles()((theme: Theme) => {
    return {
        chatMessageWrapper: {
            maxWidth: '100%',
            // Intended to make the icons faintly visible when the message is hovered, but does not work.
            // '&:hover $reactButton, &:hover $kebabButton': {
            //     opacity: 0.5
            // },
        },

        chatMessage: {
            display: 'inline-flex',
            padding: '12px',
            backgroundColor: theme.palette.ui02,
            borderRadius: '4px 12px 12px 12px',
            maxWidth: '100%',
            marginTop: '4px',
            boxSizing: 'border-box' as const,

            '&.privatemessage': {
                backgroundColor: theme.palette.support05
            },

            '&.local': {
                backgroundColor: theme.palette.ui04,
                borderRadius: '12px 4px 12px 12px',

                '&.privatemessage': {
                    backgroundColor: theme.palette.support05
                }
            },

            '&.error': {
                backgroundColor: theme.palette.actionDanger,
                borderRadius: 0,
                fontWeight: 100
            },

            '&.lobbymessage': {
                backgroundColor: theme.palette.support05
            }
        },

        sideBySideContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            alignItems: 'center',
            marginLeft: theme.spacing(1)
        },

        replyWrapper: {
            display: 'flex',
            flexDirection: 'row' as const,
            alignItems: 'center',
            maxWidth: '100%'
        },

        messageContent: {
            maxWidth: '100%',
            overflow: 'hidden',
            flex: 1
        },

        optionsButtonContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing(1)

        },

        replyButton: {
            padding: '2px'
        },

        displayName: {
            ...withPixelLineHeight(theme.typography.labelBold),
            color: theme.palette.text02,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            marginBottom: theme.spacing(1)
        },

        userMessage: {
            ...withPixelLineHeight(theme.typography.bodyShortRegular),
            color: theme.palette.text01,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
        },

        privateMessageNotice: {
            ...withPixelLineHeight(theme.typography.labelRegular),
            color: theme.palette.text02,
            marginTop: theme.spacing(1)
        },

        timestamp: {
            ...withPixelLineHeight(theme.typography.labelRegular),
            color: theme.palette.text03,
            marginTop: theme.spacing(1)
        }
    };
});

/**
 * Renders a single chat message.
 *
 * @param {IProps} props - Component's props.
 * @returns {JSX}
 */
const ChatMessage = ({
    // canReply,
    canReact,
    kebabMenuSelfVisible,
    kebabMenuVisible,
    knocking,
    message,
    showDisplayName,
    showTimestamp,
    type,
    t
}: IProps) => {
    const { classes, cx } = useStyles();

    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    function _renderDisplayName() {
        return (
            <div
                aria-hidden = { true }
                className = { cx('display-name', classes.displayName) }>
                {message.displayName}
            </div>
        );
    }

    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    function _renderPrivateNotice() {
        return (
            <div className = { classes.privateMessageNotice }>
                {getPrivateNoticeMessage(message)}
            </div>
        );
    }

    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    function _renderTimestamp() {
        return (
            <div className = { cx('timestamp', classes.timestamp) }>
                {getFormattedTimestamp(message)}
            </div>
        );
    }

    return (
        <div
            className = { cx(classes.chatMessageWrapper, type) }
            id = { message.messageId }
            tabIndex = { -1 }>
            <div className = { classes.sideBySideContainer }>
                { kebabMenuSelfVisible && 
                    <div className = { classes.optionsButtonContainer }>
                        <KebabMenu />
                    </div>
                }
                <div
                    className = { cx('chatmessage', classes.chatMessage, type,
                        message.privateMessage && 'privatemessage',
                        message.lobbyChat && !knocking && 'lobbymessage') }>
                    <div className = { classes.replyWrapper }>
                        <div className = { cx('messagecontent', classes.messageContent) }>
                            {showDisplayName && _renderDisplayName()}
                            <div className = { cx('usermessage', classes.userMessage) }>
                                <span className = 'sr-only'>
                                    {message.displayName === message.recipient
                                        ? t('chat.messageAccessibleTitleMe')
                                        : t('chat.messageAccessibleTitle',
                                            { user: message.displayName })}
                                </span>
                                <Message text = { getMessageText(message) } />
                            </div>
                            {(message.privateMessage || (message.lobbyChat && !knocking))
                                && _renderPrivateNotice()}
                        </div>
                    </div>
                </div>
                {(canReact || kebabMenuVisible) &&
                    <div
                        className= { classes.sideBySideContainer }>
                        <div>
                        {canReact
                            && (
                                <div
                                className = { classes.optionsButtonContainer }>
                                    <ReactButton />
                                </div>
                            )}
                        </div>
                        <div>
                        {kebabMenuVisible
                            && (
                                <div
                                    className = { classes.optionsButtonContainer }>
                                    <KebabMenu />
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
            {showTimestamp && _renderTimestamp()}
        </div>
    );
};

/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState, { message }: IProps) {
    const { knocking } = state['features/lobby'];
    const localParticipantId = state['features/base/participants'].local?.id;

    return {
        canReply: getCanReplyToMessage(state, message),
        canReact: message.id !== localParticipantId,
        kebabMenuSelfVisible: message.id == localParticipantId,
        kebabMenuVisible: message.id !== localParticipantId,
        knocking
    };
}

export default translate(connect(_mapStateToProps)(ChatMessage));
