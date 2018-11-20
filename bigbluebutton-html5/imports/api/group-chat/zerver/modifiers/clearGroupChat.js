import GroupChat from '/imports/api/group-chat';
import Logger from '/imports/startup/zerver/logger';
import clearGroupChatMsg from '/imports/api/group-chat-msg/zerver/modifiers/clearGroupChatMsg';

export default function clearGroupChat(meetingId) {
  clearGroupChatMsg(meetingId);
  return GroupChat.remove({ meetingId }, Logger.info(`Cleared GroupChat (${meetingId})`));
}
