'use strict';

/**
 * payroll-period service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payroll-period.payroll-period');
