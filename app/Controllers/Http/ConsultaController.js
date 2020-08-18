'use strict'

const ManagerController = require("./ManagerController");

const Negocio = use("App/Models/Negocios");
const { validate } = use("Validator");
const Comentario = use("App/Models/Comentario");
const Reservacion = use("App/Models/Reservacion");
const Evento = use("App/Models/Evento");

class ConsultaController {

  async getTop5Negocios({ response }) {

    try {

      const data = await Negocio
        .query()
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('eventos')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios.usuario')
        .orderBy('popularidad', 'desc')
        .limit(5)
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });

    } catch (error) {
      return response.status(200).send({ status: 'error', error: error.message });
    }

  }

  async getTop5ByCategoria({ request, response }) {

    const data = await Negocio
      .query()
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('eventos')
      .with('menu.categoria')
      .with('historias.usuario')
      .with('comentarios.usuario')
      .where('id_categoria', request.body['id_categoria'])
      .orderBy('popularidad', 'desc')
      .limit(5)
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

  async createComentario({ request, response }) {
    const { id_negocio, id_usuario, comentario, calificacion } = request.all();

    const validation = await validate(request.all(), {
      id_negocio: 'required',
      id_usuario: 'required',
      comentario: 'required',
      calificacion: 'integer|required|max:1',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      //guargar comentario
      const comentari = new Comentario();
      comentari.id_negocio = id_negocio
      comentari.id_usuario = id_usuario
      comentari.comentario = comentario
      comentari.calificacion = calificacion
      await comentari.save();

      //actualizar popularidad del negocio
      const count = await Comentario
        .query().where('id_negocio', id_negocio).count('* as cantidad')
      const sum = await Comentario
        .query().where('id_negocio', id_negocio).sum('calificacion as suma')
      const NuevaPopularidad = sum[0].suma / count[0].cantidad
      const negocio = await Negocio
        .query()
        .where('id', id_negocio)
        .update({
          popularidad: NuevaPopularidad,
        })
      return response.status(200).send({ message: 'Comentatio guardado con exito', data: comentari })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }

  }

  async getBusqueda({ request, response }) {

    const { data } = request.all()

    const resul = await Negocio
      .query()
      .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
      .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('eventos')
      .with('menu.categoria')
      .with('historias.usuario')
      .with('comentarios.usuario')
      .where('nombre', 'LIKE', '%' + data + '%')
      .orWhere('ubicacion', 'LIKE', '%' + data + '%')
      .orWhere('categorias.categoria', 'LIKE', '%' + data + '%')
      .fetch()
    return response.status(200).send({ status: 'ok', data: resul });
  }

  async getBares({ response }) {

    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('eventos')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%bar%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(400).send({ status: 'error', error: e.message });
    }
  }
  async getAntros({ response }) {

    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('eventos')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%antro%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(400).send({ status: 'error', error: e.message });
    }
  }

  async getCantinas({ response }) {

    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('eventos')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%cantina%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(400).send({ status: 'error', error: e.message });
    }
  }

  async getBillar({ response }) {
    try{
      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('eventos')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%billar%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(400).send({ status: 'error', error: e.message });
    }
  }

  async getClubs({ response }) {

    try {

      const data = await Negocio
        .query()
        .innerJoin('categorias', 'categorias.id', 'negocios.id_categoria')
        .select('negocios.id' ,'id_categoria','nombre', 'foto', 'ubicacion', 'informacion', 'lat', 'lng', 'popularidad', 'negocios.created_at', 'negocios.updated_at')
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('eventos')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios.usuario')
        .where('categorias.categoria', 'LIKE', '%club%')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(400).send({ status: 'error', error: e.message });
    }
  }

  async getFavs({ request, response }) {
    const {array} = request.body;
    const data = [];

    try {

      for(let i in array){
        console.log(i)
        const result = await Negocio
          .query()
          .with('categoria_negocio')
          .with('fotos')
          .with('horarios')
          .with('eventos')
          .with('menu.categoria')
          .with('historias.usuario')
          .with('comentarios.usuario')
          .where('id', array[i])
          .fetch()

         const auxi = result.toJSON()

        data.push(auxi[0])
      }

      return response.status(200).send({ status: 'ok', data:data });
    } catch (e) {
      return response.status(400).send({ status: 'error', error: e.message });
    }
  }

  async buscarReservacion({ request, response }) {

    const { data } = request.all()
    try {
      const resul = await Reservacion
      .query()
      .innerJoin('users', 'users.id', 'reservaciones.id_usuario')
      .select('reservaciones.id' ,'id_usuario','id_negocio', 'dia', 'confirmacion', 'personas', 'zona' )
      .with('usuario')
      .where('users.nombre', 'LIKE', '%' + data + '%')
      .orWhere('reservaciones.dia', 'LIKE', '%' + data + '%')
      .fetch()
      return response.status(200).send({ status: 'ok', data: resul });
    } catch (error) {
      return response.status(400).send({ status: 'ERROR', error: error.message });
    }

  }

  async totalComentarios({ request, response }) {

    const { email } = request.all()
    const id_negocio = await ManagerController.obteneridNegocio(email)

    const resul = await Comentario
    .query()
    .count('* as total')
    .where('id_negocio', id_negocio)

    return response.status(200).send({ status: 'ok', data: resul });
  }

  async reservacionesDia({ request, response }) {

    const { email } = request.all()
    const id_negocio = await ManagerController.obteneridNegocio(email)

    const resul = await Reservacion
      .query()
      .count("* as total ")
      .whereRaw("day(created_at) = now()")
      .where('id_negocio', id_negocio)

    return response.status(200).send({ status: 'ok', data: resul });
  }

  async reservacionesDiaSemana({ request, response }) {

    const { email } = request.all()
    const id_negocio = await ManagerController.obteneridNegocio(email)

    const resul = await Reservacion
      .query()
      .select('dia')
      .groupByRaw("day(dia)")
      .count('* as total')
      .where('id_negocio', id_negocio)
      .limit(7)
      .orderBy("dia","ASC")

    return response.status(200).send({ status: 'ok', data: resul });
  }

  async promedioPopu({ request, response }) {

    const { email } = request.all()
    const id_negocio = await ManagerController.obteneridNegocio(email)

    const resul = await Negocio
    .query()
    .select('popularidad')
    .where('id', id_negocio)
    .fetch()

    return response.status(200).send({ status: 'ok', data: resul });
  }

  async comentariosPorEstrellas({ request, response }) {

    const { email } = request.all()
    const id_negocio = await ManagerController.obteneridNegocio(email)

    const resul = await Comentario
    .query()
    .select('calificacion')
    .groupBy('calificacion')
    .count('* as total')
    .where('id_negocio', id_negocio)
    return response.status(200).send({ status: 'ok', data: resul });
  }

  async eventosProximos({ request, response }) {

    const { email } = request.all()
    const id_negocio = await ManagerController.obteneridNegocio(email)

    const resul = await Evento
    .query()
    .orderBy("fecha","ASC")
    .whereRaw('fecha >= now()')
    .where('id_negocio', id_negocio)
    .limit(3)
    .fetch()

    return response.status(200).send({ status: 'ok', data: resul });

  }

  async getAll({  response }) {

    try {
      const data = await Negocio
        .query()
        .with('categoria_negocio')
        .with('fotos')
        .with('horarios')
        .with('eventos')
        .with('menu.categoria')
        .with('historias.usuario')
        .with('comentarios.usuario')
        .fetch()
      return response.status(200).send({ status: 'ok', data: data });
    } catch (e) {
      return response.status(400).send({ status: 'error', error: e.message });
    }
  }

}

module.exports = ConsultaController
