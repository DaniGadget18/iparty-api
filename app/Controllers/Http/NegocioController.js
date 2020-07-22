'use strict'
const { validate } = use("Validator");
const Database = use("Database");
const User = use("App/Models/User");
const Categoria = use("App/Models/Categorias");
const Evento = use("App/Models/Eventos");
const Menu = use("App/Models/Menus");
const HorarioNegocio = use("App/Models/HorariosNegocio");
const Foto = use("App/Models/Foto");
const Comentario = use("App/Models/Comentario");
const Negocio = use("App/Models/Negocios");
const Hash = use('Hash');

class NegocioController {

  async obtenerNegocio({response, request}) {
    const { id } = request.all();
    const negocio = await Database
      .from('negocios')
      .where('negocios.id', id)
      .leftJoin('categorias', 'negocios.id_categoria', 'categorias.id')
      .leftJoin('horarios_negocios', 'negocios.id', 'horarios_negocios.id_negocio')
      .leftJoin('fotos', 'negocios.id', 'fotos.id_negocio')
      .leftJoin('eventos', 'negocios.id', 'eventos.');


    try {
      return response.status(200).send({ status: 'ok', data: negocio });
    } catch (e) {
      return response.status(400).send({ status: 'error', error:e });
    }
  }

  async obtenerNegocios({response}) {
    const negocios = await Database
      .select('*')
      .from('negocios')

    try {
      console.log(negocios.length);
      return response.status(200).send({ status: 'ok', data: negocios });
    } catch (e) {

    }
  }

  async registrarNegocio({request, response}) {
    const { nombre, ubicacion, id_categoria, nombreAdmin, email, password } = request.all();

    const validation = await validate(request.all(), {
      nombre: 'required',
      ubicacion: 'required',
      id_categoria: 'required',
      nombreAdmin: 'required',
      email: 'required|email',
      password: 'required|min:5'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    const negocio = await Database.from('users').where('nombre', nombre)
    if (!negocio) {
      return response.status(400).send("Negocio ya creado");
    }
    const userFound = await User.findBy("email", email);
    if (userFound) {
      return response.status(400).send("El usuario ya existe");
    }

    try {
      const negocio = await Database
        .table('negocios')
        .insert({nombre: nombre, ubicacion: ubicacion, id_categorias:id_categoria});
      const usuario = await Database
        .table('users')
        .insert({email: email, nombre: nombreAdmin, password:password });
      const datosUsuario = await Database
        .select('id')
        .from('users')
        .where('email', email);
      const datosNegocio = await Database
        .select('id')
        .from('negocios')
        .where('nombre', nombre);

      const administrador = await Database
        .table('administradores')
        .insert({id_usuario: datosUsuario[0].id, id_negocio: datosNegocio[0].id, id_rol:1 });
      console.log(usuario);


      return response.status(200).send({status:'ok', message:'Negocio y usuario creados con exito'})

    } catch (e) {
      return response.status(400).send({status:'error', type:e, message:'Hubo un error'})
    }

  }

  async updateNegocio({request, response}) {
    const { id, nombre, ubicacion, id_categoria, nombreAdmin, email, password } = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
      nombre: 'required',
      ubicacion: 'required',
      id_categoria: 'required',
      informacion: 'required',
      lat: 'required',
      lng: 'required',
      foto: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const negocio = await Negocio
      .query()
      .where('id', request.body['id'])
      .update({
        nombre: nombre,
        ubicacion: ubicacion,
        id_categoria: id_categoria,
        informacion: informacion,
        lat: lat,
        lng: lng,
        foto: foto
      })
      const editada = await Negocio.query().where('id', request.body['id']).fetch()
      return response.status(200).send({message:'Negocio editado con exito', data:editada})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }
  async top({response}) {

    const categorias =await Categoria.query().with('negocios.comentarios.usuario').with('negocios.fotos').with('negocios.menu.categoria').fetch();
    //const negocios = await Negocio.find(15);
    //const negocio_comentario = await Negocio.query().with('comentarios').with('fotos').with('menu').fetch();
    //const comentarios = await comentario.profile().first();

    return response.status(200).send({message:'Negocio editado con exito', data:categorias})

  }

  async getTop5({response}) {

    const data = await Negocio
    .query()
    .orderBy('popularidad', 'desc')
    .limit(5)
    .fetch()
    return response.status(200).send({ status: 'ok', data: data });

  }

  async getTop5ByCategoria({request, response}) {

    const data = await Negocio
    .query()
    .where('id_categoria', request.body['id_categoria'])
    .orderBy('popularidad', 'desc')
    .limit(5)
    .fetch()
    return response.status(200).send({ status: 'ok', data: data });

  }

  async createComentario({request,response}){
    const { id_negocio, id_usuario, comentario, calificacion } = request.all();

    const validation = await validate(request.all(), {
      id_negocio: 'required',
      id_usuario: 'required',
      comentario: 'required',
      calificacion: 'integer|required|max:1',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
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
                                popularidad : NuevaPopularidad,
                              })
      return response.status(200).send({message:'Comentatio guardado con exito', data:comentari})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }

  }



}

module.exports = NegocioController
