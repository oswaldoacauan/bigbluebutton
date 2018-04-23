import Redis from 'redis';
import Threads from 'webworker-threads';

const NUM_THREADS = 5;

const ThreadPool = Threads.createPool(NUM_THREADS);

ThreadPool.on('publish', (data) => {
  console.error('[emit-publish-start]', data);
  const end = Date.now() + 500;
  while (Date.now() < end) {
    const doSomethingHeavyInJavaScript = 1 + 2 + 3;
  }
  console.error('[emit-publish-end]', data);
});

export function emit(type, ...args) {
  console.warn('[emit]', type)
  ThreadPool.any.emit(type, ...args);
}

(function spinForever () {
  setImmediate(spinForever);
})();
