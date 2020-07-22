'use strict'
const { validate } = use("Validator");
const Database = use("Database");
const User = use("App/Models/User");
const Categoria = use("App/Models/Categorias");
const Evento = use("App/Models/Eventos");
const Menu = use("App/Models/Menus");
const HorarioNegocio = use("App/Models/HorariosNegocio");
const Foto = use("App/Models/Fotos");
const Administrador = use("App/Models/Administradores");
const comentario = use("App/Models/Comentario");
const Negocio = use("App/Models/Negocios");
const Hash = use('Hash');

class NegocioController {

  // Metodos con Lucid
  async registrarNegocioLucid({request, response}) {
    const { nombre, email, password, fecha_nacimiento, nombreAdmin} = request.all();
    const validation = await validate(request.all(), {
      nombre: 'required',
      email: 'required | email',
      password: 'required',
      fecha_nacimiento: 'required',
      nombreAdmin: 'required'
    });

    if (validation.fails()){
      return response.status(400).send({ status:'error', message:'Falta un campo' })
    }
    const negocio = await Negocio.create({
      nombre
    });
    const usuario = await User.create({
      email,
      password,
      nombre: nombreAdmin,
      fecha_nacimiento
    });
    const administradores = await Administrador.create({
      id_usuario: usuario.id,
      id_negocio: negocio.id,
      id_rol: 1
    });
    try {
      return response.status(200).send({ status:'ok', message:'Negocio creado con exito', data:administradores })
    } catch (error) {
      return response.status(400).send({ status:'error', message:'Hubo un error', error: error })
    }
  }

  async obtenerNegocioById({request, response}){
    const { email } = request.all();


    const validation = await validate(request.all(), {
      email: 'required | email'
    });

    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp =  negociousuario.toJSON();
    const id = resp[0]['administradores'][0]['id'];

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: "Falta mandar el id"})
    }

    try {
      const negocio = await Negocio.query().with('fotos').with('horarios').with('categoria_negocio').where('id',id).fetch();
      return response.status(200).send({ "status":'ok', data: negocio })
    } catch (error) {
      return response.status(400).send({ status:'error', message: "Hubo un error", "error":error })
    }
  }

  async obtenerNegocios({response}) {
    const negocios = await Negocio.all();
    try {
      console.log(negocios.length);
      return response.status(200).send({ status: 'ok', data: negocios });
    } catch (e) {
      return response.status(400).send({ status: 'ok', message: 'Hubo un error' });
    }
  }


  async updateNegocio({request, response}) {
    const { email, nombre, ubicacion, id_categorias, informacion, lat, lng, foto } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
      nombre: 'required',
      ubicacion: 'required',
      id_categorias: 'required',
      informacion: 'required',
      lat: 'required',
      lng: 'required'
    });

    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp =  negociousuario.toJSON();
    const id = resp[0]['administradores'][0]['id'];

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    const negocio = await  Negocio.query().where('id', id).update({
      nombre: nombre,
      ubicacion: ubicacion,
      id_categorias: id_categorias,
      informacion: informacion,
      lat: lat,
      lng: lng,
      foto: foto
    });

    try {
      return response.status(200).send({message:'Negocio editado con exito', data: negocio})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error: error })
    }
  }

  // Horarios negocio

  async createHorarioNegocio({request, response}) {
    const { email , lunes, martes, miercoles, jueves, viernes, sabado, domingo } = request.all();

    const validation = await validate(request.all(), {
      email : 'required | email',
      lunes: 'required',
      martes: 'required',
      miercoles: 'required',
      jueves: 'required',
      viernes: 'required',
      sabado: 'required',
      domingo: 'required'
    });
 
    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp =  negociousuario.toJSON();
    const id = resp[0]['administradores'][0]['id'];

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {
      const horario = new HorarioNegocio();
        horario.id_negocio = id,
        horario.lunes = lunes,
        horario.martes = martes,
        horario.miercoles = miercoles,
        horario.jueves = jueves,
        horario.viernes = viernes,
        horario.sabado = sabado,
        horario.domingo = domingo
      await horario.save();
      return response.status(200).send({message:'Horario creado con exito', data:horario})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async updateHorarioNegocio({request, response}) {
    const { email , lunes, martes, miercoles, jueves, viernes, sabado, domingo } = request.all();

    const validation = await validate(request.all(), {
      email : 'required | email',
      lunes: 'required',
      martes: 'required',
      miercoles: 'required',
      jueves: 'required',
      viernes: 'required',
      sabado: 'required',
      domingo: 'required'
    });

    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp =  negociousuario.toJSON();
    const id = resp[0]['administradores'][0]['id'];

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const horario = await HorarioNegocio
        .query()
        .where('id_negocio', id)
        .update({
          lunes: lunes,
          martes: martes,
          miercoles: miercoles,
          jueves: jueves,
          viernes: viernes,
          sabado: sabado,
          domingo: domingo
        });
      return response.status(200).send({message:'Informacion editada con exito', data:editada})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }


  // Menu
  async updateMenuByNegocio({request, response}) {
    const {id, email, id_categoria, nombre, informacion} = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
      email: 'required | email',
      nombre: 'required',
      informacion: 'required',
      id_categoria: 'required'
    });

    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp =  negociousuario.toJSON();
    const id_negocio = resp[0]['administradores'][0]['id'];

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {
      const menu = await Menu
      .query()
      .where('id', id)
        .where('id_negocio', id_negocio)
      .update({
        nombre: nombre,
        informacion: informacion,
        id_categoria: id_categoria
      })
      const editada = await Menu.query().where('id', id).fetch()
      return response.status(200).send({message:'Informacion editada con exito', data:editada})
    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async getMenuByNegocioId({request, response}){
    const { email } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta el email" })
    }

    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp =  negociousuario.toJSON();
    const id_negocio = resp[0]['administradores'][0]['id'];

    try {
      const menu = await Menu.query().where('id_negocio', id_negocio).fetch();

      return response.status(200).send({data:menu})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }


  // Consultas

  async top({response}) {

    const categorias =await Categoria.query()
      .with('negocios.comentarios.usuario')
      .with('negocios.fotos')
      .with('negocios.menu.categoria')
      .with('negocios.catagoria')
      .fetch();
    //const negocios = await Negocio.find(15);
    //const negocio_comentario = await Negocio.query().with('comentarios').with('fotos').with('menu').fetch();
    //const comentarios = await comentario.profile().first();

    return response.status(200).send({message:'Negocio editado con exito', data:categorias})

  }

  async getTop5({response}) {

    const data = await Negocio
      .query()
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('comentarios')
      .with('comentarios.usuario')
      .orderBy('popularidad', 'desc')
      .limit(5)
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });

  }

  async getTop5ByCategoria({request, response}) {
    const data = await Negocio
      .query()
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('comentarios')
      .with('comentarios.usuario')
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
