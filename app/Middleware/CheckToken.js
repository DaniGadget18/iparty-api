'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckToken {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request , auth, response}, next) {
    const token = request.header('Authorization');
    try {
      await auth.check();
      await next()
    } catch (error) {
      return response.status(400).send({
        status: 'error',
        message: 'Token expirado / invalido',
        type: 'token',
        error: error.message
      });
    }
  }
}

module.exports = CheckToken
