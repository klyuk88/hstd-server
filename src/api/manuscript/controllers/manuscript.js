'use strict';
/**
 * manuscript controller
 */

const {
    createCoreController
} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::manuscript.manuscript');