/* eslint import/prefer-default-export: 0 */
import Auth from '/imports/ui/services/auth/index';
import { createSelector } from './createSelector';

export const getCredentials = () => Auth.credentials;

export const getSessionToken = createSelector(
  getCredentials,
  credentials => credentials.sessionToken,
);

export const getLogoutUrl = createSelector(
  getCredentials,
  credentials => credentials.logoutURL,
);
