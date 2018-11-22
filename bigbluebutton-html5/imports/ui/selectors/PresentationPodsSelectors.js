/* eslint import/prefer-default-export: 0 */
import PresentationPods from '/imports/api/presentation-pods';

import { createSelector } from './createSelector';
import { getCurrentMeetingId } from './MeetingSelectors';

export const getPresentationPodIds = createSelector(
  getCurrentMeetingId,
  meetingId => PresentationPods
    .find({ meetingId }, { fields: { podId: 1 } })
    .fetch()
    .map(({ podId }) => podId),
);
