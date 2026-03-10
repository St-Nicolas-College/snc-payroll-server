'use strict';

/**
 * refresh-token router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::refresh-token.refresh-token');
