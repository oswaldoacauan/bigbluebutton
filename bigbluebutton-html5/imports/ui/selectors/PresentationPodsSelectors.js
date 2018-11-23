/* eslint import/prefer-default-export: 0 */
import PresentationPods from '/imports/api/presentation-pods';
import { normalize, schema } from 'normalizr';
import { createSelector } from './createSelector';

export const schemaPresentation = new schema.Entity('presentationPods', {}, { idAttribute: 'podId' });

export const schemaPresentationPods = new schema.Array(schemaPresentation);

export const getPresentationPodsRaw = () => PresentationPods.find().fetch();

export const getPresentationPodsNormalized = createSelector(
  getPresentationPodsRaw,
  state => normalize(state, schemaPresentationPods),
);

export const getPresentationPodIds = createSelector(
  getPresentationPodsNormalized,
  state => state.result,
);

export const getPresentationPods = createSelector(
  getPresentationPodsNormalized,
  state => state.entities.presentationPods,
);
