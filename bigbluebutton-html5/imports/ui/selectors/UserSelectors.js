/* eslint import/prefer-default-export: 0 */
import Users from '/imports/api/users';

import { createSelector } from './createSelector';
import { getCredentials } from './AuthSelectors';

export const getCurrentUserId = createSelector(
  getCredentials,
  credentials => credentials.requesterUserId,
);

export const getUser = userId => Users.findOne({ userId });

export const getCurrentUser = createSelector(
  getCurrentUserId,
  getUser,
);
