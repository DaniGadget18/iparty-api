'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class mongo_Administrator
 */
class mongo_Administrator extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'mongo_AdministratorHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * mongo_Administrator's schema
   */
  static get schema () {
    return {

    }
  }
}

module.exports = mongo_Administrator.buildModel('mongo_Administrator')
