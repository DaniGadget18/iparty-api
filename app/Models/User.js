'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static get hidden () {
    return ['password']
  }
  static boot () {

    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  administradores() {
    return this.belongsToMany('App/Models/Negocios', 'id_usuario', 'id_negocio', 'id', 'id')
      .pivotTable('administradores');
  }

  historias() {
    return this.hasMany( 'App/Models/Historia', 'id', 'id_usuario');
  }
  root() {
    return this.hasOne('App/Models/Root', 'id', 'id_usuario');
  }
}

module.exports = User
