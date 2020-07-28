'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class mongo_Conversation
 */
class mongo_Conversation extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'mongo_ConversationHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * mongo_Conversation's schema
   */
  static get schema () {
    return {

    }
  }
}

module.exports = mongo_Conversation.buildModel('mongo_Conversation')
