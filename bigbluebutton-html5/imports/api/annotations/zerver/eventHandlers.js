import RedisPubSub from '/imports/startup/zerver/redis';
import { processForHTML5ServerOnly } from '/imports/api/common/zerver/helpers';
import handleWhiteboardCleared from './handlers/whiteboardCleared';
import handleWhiteboardUndo from './handlers/whiteboardUndo';
import handleWhiteboardSend from './handlers/whiteboardSend';
import handleWhiteboardAnnotations from './handlers/whiteboardAnnotations';

RedisPubSub.on('ClearWhiteboardEvtMsg', handleWhiteboardCleared);
RedisPubSub.on('UndoWhiteboardEvtMsg', handleWhiteboardUndo);
RedisPubSub.on('SendWhiteboardAnnotationEvtMsg', handleWhiteboardSend);
RedisPubSub.on('GetWhiteboardAnnotationsRespMsg', processForHTML5ServerOnly(handleWhiteboardAnnotations));
