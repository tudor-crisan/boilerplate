import { EventEmitter } from 'events';

// Use a global variable to store the emitter instance to prevent it from being 
// re-created during hot reloads in development
if (!global.boardEventEmitter) {
  global.boardEventEmitter = new EventEmitter();
}

const boardEvents = global.boardEventEmitter;

export default boardEvents;
