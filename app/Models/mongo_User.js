'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class mongo_User
 */
class mongo_User extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'mongo_UserHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * mongo_User's schema
   */
  static get schema () {
    return {

    }
  }
}

module.exports = mongo_User.buildModel('mongo_User')
