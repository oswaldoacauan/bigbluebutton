/* eslint import/prefer-default-export: 0 */
import Slides from '/imports/api/slides';
import { normalize, schema } from 'normalizr';
import { createSelector } from './createSelector';

export const schemaSlide = new schema.Entity('slides');

export const schemaSlides = new schema.Array(schemaSlide);

export const getSlidesRaw = () => Slides.find().fetch();

export const getSlidesNormalized = createSelector(
  getSlidesRaw,
  state => normalize(state, schemaSlides),
);

export const getSlidesIds = createSelector(
  getSlidesNormalized,
  state => state.result,
);

export const getSlides = createSelector(
  getSlidesNormalized,
  state => state.entities.slides,
);

