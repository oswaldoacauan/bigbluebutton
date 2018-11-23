/* eslint import/prefer-default-export: 0 */
import { createSelector } from './createSelector';
import { getCredentials } from './AuthSelectors';
import { getMeetings } from './MeetingsSelectors';

export const getMeeting = createSelector(
  getMeetings,
  (meetings, id) => meetings && id in meetings && meetings[id],
);

export const getCurrentMeetingId = createSelector(
  getCredentials,
  credentials => credentials.meetingId,
);

export const getCurrentMeeting = createSelector(
  getCurrentMeetingId,
  getMeeting,
);


// // 'name' is the name of the data on the wire that should go in the
// // store. 'wrappedStore' should be an object with methods beginUpdate, update,
// // endUpdate, saveOriginals, retrieveOriginals. see Collection for an example.
// const testStore = {
//   beginUpdate: (...args) => console.log('beginUpdate', ...args),
//   update: (...args) => console.log('update', ...args),
//   endUpdate: (...args) => console.log('endUpdate', ...args),
//   saveOriginals: (...args) => console.log('saveOriginals', ...args),
//   retrieveOriginals: (...args) => console.log('retrieveOriginals', ...args),
// };

// Meteor.connection.registerStore('test', testStore);