import { publish } from '/imports/api/common/server/helpers';
import { isAllowedTo } from '/imports/startup/server/userPermissions';
import { appendMessageHeader } from '/imports/api/common/server/helpers';
import Presentations from '/imports/api/presentations';
import Slides from '/imports/api/slides';

Meteor.methods({
  displayPresentation(credentials, presentationID) {
    const REDIS_CONFIG = Meteor.settings.redis;
    const { meetingId, requesterUserId, requesterToken } = credentials;

    const currentPresentation = Presentations.findOne({
      meetingId: meetingId,
      'presentation.current': true,
    });

    const presentation = Presentations.findOne({
      meetingId: meetingId,
      'presentation.id': presentationID,
    });

    if (presentation && isAllowedTo('switchSlide', credentials)) {
      let message = {
        payload: {
          page: requestedSlideDoc.slide.id,
          meeting_id: meetingId,
        },
      };

      message = appendMessageHeader('go_to_slide', message);
      return publish(REDIS_CONFIG.channels.toBBBApps.presentation, message);
    }
  },
});
