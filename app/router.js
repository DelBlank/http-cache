'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.httpCache.index);
  router.get('/memory-cache', controller.memoryCache.index);
  router.get('/api/no-cache-etag', controller.httpCache.noCacheWithEtag)
  router.get('/api/no-cache-modified', controller.httpCache.noCacheWithModified)
  router.get('/api/max-age', controller.httpCache.maxAge)
};
