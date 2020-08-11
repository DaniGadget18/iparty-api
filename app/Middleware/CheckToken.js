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
    console.log(token);
    try {
      await auth.check();
      await next()
    } catch (error) {
      response.status(400).send({ status:'error', error: error.message, message: 'Token invalido' });
    }
  }
}

module.exports = CheckToken
