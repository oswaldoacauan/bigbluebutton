import { makeCall } from '/imports/ui/services/api';
import Storage from '/imports/ui/services/storage/session';
import Auth from '/imports/ui/services/auth';
import {addAnnotation} from './addAnnotation';

const DRAW_SETTINGS = 'drawSettings';
let annotationsQueue = [];
//How many packets we need to have to use annotationsBufferTimeMax
let annotationsMaxDelayQueueSize = 60;
//Minimum bufferTime
let annotationsBufferTimeMin = 30;
//Maximum bufferTime
let annotationsBufferTimeMax = 200;
let annotationsSenderIsRunning = false;

const sendAnnotation = (annotation) => {
  annotationsQueue.push(annotation);
  if(!annotationsSenderIsRunning) setTimeout(proccessAnnotationsQueue, annotationsBufferTimeMin);
};

const proccessAnnotationsQueue = () => {
  annotationsSenderIsRunning = true;
  const queueSize = annotationsQueue.length;

  if (!queueSize) {
    annotationsSenderIsRunning = false;
    return;
  }

  // console.log('annotationQueue.length', annotationsQueue, annotationsQueue.length);
  makeCall('sendAnnotation', annotationsQueue);
  annotationsQueue = [];
  // ask tiago
  const delayPerc = Math.min(annotationsMaxDelayQueueSize, queueSize) / annotationsMaxDelayQueueSize;
  const delayDelta = annotationsBufferTimeMax - annotationsBufferTimeMin;
  const delayTime = annotationsBufferTimeMin + (delayDelta * delayPerc);
  console.debug('d,q',delayTime,queueSize);
  setTimeout(proccessAnnotationsQueue, delayTime);
}

const getWhiteboardToolbarValues = () => {
  const drawSettings = Storage.getItem(DRAW_SETTINGS);
  if (!drawSettings) {
    return {};
  }

  const {
    whiteboardAnnotationTool,
    whiteboardAnnotationThickness,
    whiteboardAnnotationColor,
    textFontSize,
    textShape,
  } = drawSettings;

  return {
    tool: whiteboardAnnotationTool,
    thickness: whiteboardAnnotationThickness,
    color: whiteboardAnnotationColor,
    textFontSize,
    textShapeValue: textShape.textShapeValue ? textShape.textShapeValue : '',
    textShapeActiveId: textShape.textShapeActiveId ? textShape.textShapeActiveId : '',
  };
};

const resetTextShapeSession = () => {
  const drawSettings = Storage.getItem(DRAW_SETTINGS);
  if (drawSettings) {
    drawSettings.textShape.textShapeValue = '';
    drawSettings.textShape.textShapeActiveId = '';
    Storage.setItem(DRAW_SETTINGS, drawSettings);
  }
};

const setTextShapeActiveId = (id) => {
  const drawSettings = Storage.getItem(DRAW_SETTINGS);
  if (drawSettings) {
    drawSettings.textShape.textShapeActiveId = id;
    Storage.setItem(DRAW_SETTINGS, drawSettings);
  }
};

const getCurrentUserId = () => Auth.userID;


export default {
  sendAnnotation,
  getWhiteboardToolbarValues,
  setTextShapeActiveId,
  resetTextShapeSession,
  getCurrentUserId,
};
