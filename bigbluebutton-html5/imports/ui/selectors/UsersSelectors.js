/* eslint import/prefer-default-export: 0 */
import Users from '/imports/api/users';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';

export const schemaUser = new schema.Entity('users', {}, { idAttribute: 'userId' });

export const schemaUsers = new schema.Array(schemaUser);

export const getUsersRaw = () => Users.find().fetch();

export const getUsersNormalized = createSelector(
  getUsersRaw,
  state => normalize(state, schemaUsers),
);

export const getUsersIds = createSelector(
  getUsersNormalized,
  state => state.result,
);

export const getUsers = createSelector(
  getUsersNormalized,
  state => state.entities.users,
);
