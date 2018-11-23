/* eslint import/prefer-default-export: 0 */
import { find, values } from 'lodash';
import { createSelector } from 'reselect';
import { injectState } from './createSelector';
import { getIdToFetch } from './CommonSelectors';
import { getSlides } from './SlidesSelectors';

export const getSlideSelector = createSelector(
  getSlides,
  getIdToFetch,
  (state, id) => state && id in state && state[id],
);

export const getSlide = injectState(getSlideSelector);

export const getCurrentSlideByPresentation = injectState(createSelector(
  getSlides,
  getIdToFetch,
  (state, id) => state && find(values(state), { current: true, presentationId: id }),
));

export const getCurrentSlideByPod = injectState(createSelector(
  getSlides,
  getIdToFetch,
  (state, id) => state && find(values(state), { current: true, podId: id }),
));
