/* eslint import/prefer-default-export: 0 */
import Meetings from '/imports/api/meetings';

import { createSelector } from './createSelector';
import { getCredentials } from './AuthSelectors';

export const getCurrentMeetingId = createSelector(
  getCredentials,
  credentials => credentials.meetingId,
);

export const getMeeting = meetingId => Meetings.findOne({ meetingId });

export const getCurrentMeeting = createSelector(
  getCurrentMeetingId,
  getMeeting,
);
