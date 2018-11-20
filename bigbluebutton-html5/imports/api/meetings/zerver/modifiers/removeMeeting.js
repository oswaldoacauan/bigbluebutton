import Meetings from '/imports/api/meetings';
import Logger from '/imports/startup/zerver/logger';

import clearUsers from '/imports/api/users/zerver/modifiers/clearUsers';
import clearUsersSettings from '/imports/api/users-settings/zerver/modifiers/clearUsersSettings';
import clearGroupChat from '/imports/api/group-chat/zerver/modifiers/clearGroupChat';
import clearBreakouts from '/imports/api/breakouts/zerver/modifiers/clearBreakouts';
import clearAnnotations from '/imports/api/annotations/zerver/modifiers/clearAnnotations';
import clearSlides from '/imports/api/slides/zerver/modifiers/clearSlides';
import clearPolls from '/imports/api/polls/zerver/modifiers/clearPolls';
import clearCaptions from '/imports/api/captions/zerver/modifiers/clearCaptions';
import clearPresentationPods from '/imports/api/presentation-pods/zerver/modifiers/clearPresentationPods';
import clearVoiceUsers from '/imports/api/voice-users/zerver/modifiers/clearVoiceUsers';


export default function removeMeeting(meetingId) {
  return Meetings.remove({ meetingId }, () => {
    clearCaptions(meetingId);
    clearGroupChat(meetingId);
    clearPresentationPods(meetingId);
    clearBreakouts(meetingId);
    clearPolls(meetingId);
    clearAnnotations(meetingId);
    clearSlides(meetingId);
    clearUsers(meetingId);
    clearUsersSettings(meetingId);
    clearVoiceUsers(meetingId);

    return Logger.info(`Cleared Meetings with id ${meetingId}`);
  });
}
