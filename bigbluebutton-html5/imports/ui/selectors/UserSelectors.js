/* eslint import/prefer-default-export: 0 */
import { createSelector } from 'reselect';
import { injectState } from './createSelector';
import { getCredentials } from './AuthSelectors';
import { getIdToFetch } from './CommonSelectors';
import { getUsers } from './UsersSelectors';

export const getUserSelector = createSelector(
  getUsers,
  getIdToFetch,
  (state, id) => state && id in state && state[id],
);

export const getUser = injectState(getUserSelector);

export const getCurrentUserId = createSelector(
  getCredentials,
  credentials => credentials.requesterUserId,
);

export const getCurrentUser = createSelector(
  getUsers,
  getCurrentUserId,
  getUserSelector,
);
