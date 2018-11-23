/* eslint import/prefer-default-export: 0 */
import Presentations from '/imports/api/presentations';
import { normalize, schema } from 'normalizr';
import { createSelector } from 'reselect';
import { cloneDeep } from 'lodash';

export const schemaPresentation = new schema.Entity('presentations');

export const schemaPresentations = new schema.Array(schemaPresentation);

export const getPresentationsRaw = () => cloneDeep(Presentations.find().fetch());

export const getPresentationsNormalized = createSelector(
  getPresentationsRaw,
  state => normalize(state, schemaPresentations),
);

export const getPresentationsIds = createSelector(
  getPresentationsNormalized,
  state => state.result,
);

export const getPresentations = createSelector(
  getPresentationsNormalized,
  state => state.entities.presentations,
);

