'use strict';

/**
 * refresh-token controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::refresh-token.refresh-token');
