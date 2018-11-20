import RedisPubSub from '/imports/startup/zerver/redis';
import handleCursorUpdate from './handlers/cursorUpdate';

RedisPubSub.on('SendCursorPositionEvtMsg', handleCursorUpdate);
