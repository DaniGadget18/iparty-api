'use strict'
const User = use('App/Models/User');
const Negocio = use('App/Models/Negocios');
const Comentario = use("App/Models/Comentario");


class ManagerController {

  static async obteneridNegocio ( email ) {
      const negociousuario = await User.query().with('administradores').where('email', email).fetch();
      const resp = negociousuario.toJSON();
      return resp[0]['administradores'][0]['id'];

  }

  static async tieneHorarioNegocio( id ){
    const negocio_horario = await Negocio.query().withCount('horarios').where('id', id).fetch();
    const data = negocio_horario.toJSON();
    return data[0]['__meta__']['horarios_count'];
  }

  static async countComentarios(id_negocio) {
    try {
      const negocio_comentario = await Negocio
        .query()
        .withCount('comentarios').where("id", id_negocio)
        .fetch()
      const data = negocio_comentario.toJSON();
      return data[0]['__meta__']['comentarios_count']
    } catch (error) {
      console.log(error)
    }

  }

  static async CountRank(id_negocio, rank) {
    const comentario_usuario = await Comentario
      .query()
      .withCount('usuario').where("id_negocio", id_negocio).where("calificacion", rank)
      .fetch()
    const data = comentario_usuario.toJSON();
    return data[0]["__meta__"]["comentarios_count"];
  }

  static async CountEventos(id_negocio) {
    const negocio_eventos = await Negocio
      .query()
      .withCount('eventos').where("id", id_negocio)
      .fetch()
    const data = negocio_eventos.toJSON();
    return data[0]["__meta__"]["eventos_count"];
  }

  static async isRoot( email ) {
    const root = await User.query().withCount('root').where('email', email).fetch();
    const data = root.toJSON()

    return data[0]['__meta__'].root_count;
  }

  static async idNegocioOnline(email) {
    const isAdmin = await User.query().withCount('administradores').where('email', email).fetch();
    const data1 = isAdmin.toJSON()
    if (data1[0]['__meta__'].administradores_count === 0){
      return null
    }
    const admin = await User.query().with('administradores').where('email', email).fetch();
    const data = admin.toJSON();
    return data[0].administradores[0].id + data[0].administradores[0].nombre;
  }

}


module.exports = ManagerController
