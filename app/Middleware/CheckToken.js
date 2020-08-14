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
    if (token) {
      await auth.check();
      await next()
    } else {
      return 'Token invalido'
    }
  }
}

module.exports = CheckToken
