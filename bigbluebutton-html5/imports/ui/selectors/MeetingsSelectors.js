/* eslint import/prefer-default-export: 0 */
import Meetings from '/imports/api/meetings';
import { normalize, schema } from 'normalizr';

import { createSelector } from './createSelector';

export const schemaMeeting = new schema.Entity('meetings', {}, { idAttribute: 'meetingId' });

export const schemaMeetings = new schema.Array(schemaMeeting);

export const getMeetingsRaw = () => Meetings.find().fetch();

export const getMeetingsNormalized = createSelector(
  getMeetingsRaw,
  meetings => normalize(meetings, schemaMeetings),
);

export const getMeetingIds = createSelector(
  getMeetingsNormalized,
  meetings => meetings.result,
);

export const getMeetings = createSelector(
  getMeetingsNormalized,
  meetings => meetings.entities.meetings,
);
