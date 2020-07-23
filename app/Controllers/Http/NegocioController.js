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
const Comentario = use("App/Models/Comentario");
const Negocio = use("App/Models/Negocios");
const Hash = use('Hash');

class NegocioController {

  // Metodos con Lucid
  async registrarNegocioLucid({ request, response }) {
    const { nombre, email, password, fecha_nacimiento, nombreAdmin } = request.all();
    const validation = await validate(request.all(), {
      nombre: 'required',
      email: 'required | email',
      password: 'required',
      fecha_nacimiento: 'required',
      nombreAdmin: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ status: 'error', message: 'Falta un campo' })
    }

    try {
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

      return response.status(200).send({ status: 'ok', message: 'Negocio creado con exito', data: administradores })
    } catch (error) {
      return response.status(400).send({ status: 'error', message: 'Hubo un error', error: error })
    }
  }

  async obtenerNegocioByEmail({ request, response }) {
    const { email } = request.all();


    const validation = await validate(request.all(), {
      email: 'required | email'
    });

    if (validation.fails()) {
      return response.status(400).send({ status: 'error', message: "Falta mandar el email" })
    }

    try {
      const negociousuario = await User.query().with('administradores').where('email', email).fetch();
      const resp = negociousuario.toJSON();
      const id = resp[0]['administradores'][0]['id'];

      const negocio = await Negocio.query().with('fotos').with('horarios').with('categoria_negocio').where('id', id).fetch();
      return response.status(200).send({ "status": 'ok', data: negocio })
    } catch (error) {
      console.log(error);
      return response.status(400).send({ status: 'error', message: "Hubo un error", "error": error })
    }
  }

  async obtenerNegocios({ response }) {
    try {
      const negocios = await Negocio.all();
      console.log(negocios.length);
      return response.status(200).send({ status: 'ok', data: negocios });
    } catch (e) {
      return response.status(400).send({ status: 'ok', message: 'Hubo un error' });
    }
  }

  async obtenerNegocioByID({ request, response }) {
    const { id } = request.all();

    const validation = await validate(request.all(), {
      id: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ status: 'error', message: "Falta mandar el id" })
    }

    try {

      const negocio = await Negocio.query().with('categoria_negocio').with('usuario').where('id', id).fetch();
      return response.status(200).send({ "status": 'ok', data: negocio })
    } catch (error) {
      console.log(error);
      return response.status(400).send({ status: 'error', message: "Hubo un error", "error": error.message })
    }
  }


  async updateNegocio({ request, response }) {
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

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
    }

    try {
      const negociousuario = await User.query().with('administradores').where('email', email).fetch();
      const resp = negociousuario.toJSON();
      const id = resp[0]['administradores'][0]['id'];

      const negocio = await Negocio.query().where('id', id).update({
        nombre: nombre,
        ubicacion: ubicacion,
        id_categorias: id_categorias,
        informacion: informacion,
        lat: lat,
        lng: lng,
        foto: foto
      });
      return response.status(200).send({ message: 'Negocio editado con exito', data: negocio })
    } catch (error) {
      return response.status(400).send({ message: 'algo salio mal', error: error })
    }
  }

  // Horarios negocio

  async updateHorarioNegocio({ request, response }) {
    const { email, lunes, martes, miercoles, jueves, viernes, sabado, domingo } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
      lunes: 'required',
      martes: 'required',
      miercoles: 'required',
      jueves: 'required',
      viernes: 'required',
      sabado: 'required',
      domingo: 'required'
    });


    if (validation.fails()) {
      return response.status(400).send({ status: 'error', message: validation.messages(), error: "Falta algun campo" })
    }

    try {
      const negociousuario = await User.query().with('administradores').where('email', email).fetch();
      const resp = negociousuario.toJSON();
      const id = resp[0]['administradores'][0]['id'];

      const negocio_horario = await Negocio.query().withCount('horarios').where('id', id).fetch();
      const data = negocio_horario.toJSON();
      const count = data[0]['__meta__']['horarios_count'];

      if (count == 0) {
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
      } else {
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
      }
      return response.status(200).send({ status: 'ok', message: 'Informacion editada con exito' })
    } catch (error) {
      console.log(error);
      return response.status(400).send({ status: 'error', message: 'algo salio mal', error: error.message })
    }
  }


  // Menu
  async updateMenuByNegocio({ request, response }) {
    const { id, email, id_categoria, nombre, informacion } = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
      email: 'required | email',
      nombre: 'required',
      informacion: 'required',
      id_categoria: 'required'
    });

    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp = negociousuario.toJSON();
    const id_negocio = resp[0]['administradores'][0]['id'];

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
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
      return response.status(200).send({ message: 'Informacion editada con exito', data: editada })
    } catch (error) {
      return response.status(400).send({ message: 'algo salio mal', error: error })
    }
  }

  async getMenuByNegocioId({ request, response }) {
    const { email } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta el email" })
    }

    const negociousuario = await User.query().with('administradores').where('email', email).fetch();
    const resp = negociousuario.toJSON();
    const id_negocio = resp[0]['administradores'][0]['id'];

    try {
      const menu = await Menu.query().where('id_negocio', id_negocio).fetch();

      return response.status(200).send({ data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }
  }
  // Hacia arriba metodos sobre CRUD
  // De aqui en adelante hacer solo consultas
  // Consultas

  async cat(){
    const neg = await Negocio.query().with('comentarios.usuario').with('fotos').with('horarios').with('categoria_negocio').with('menu.categoria').fetch();

    const cat = await Categoria.all();
    const p = [];


    var aux;
    var auxa;
    var myObj = {};

    for (let i in cat.rows) {
      const pp = [];
      p.push(cat.rows[i]['categoria'])
      aux = cat.rows[i]['categoria'];
      auxa = cat.rows[i]['id'];
      console.log("´k",auxa);


      for (let i in neg.rows) {
        console.log("ASD", neg.rows[i]['id_categoria'], auxa)
        if(neg.rows[i]['id_categoria']==auxa){
          console.log("entro", neg.rows[i]['id_categoria'], auxa)
          pp.push(neg.rows[i])
        }


      }
      myObj[aux]=pp;




      console.log(aux) // you should be able to have access to name now
    }







    // We expect: Object { Hello="world" }
    //console.log(myObj, cat['id']); // Object{ Hello="World" } OK!


    var result = [];
    return myObj

  }

  async top({ response }) {
    const categorias =await Categoria.query()
    .with('negocios.comentarios.usuario')
    .with('negocios.fotos')
    .with('negocios.menu.categoria')
    .fetch();
    //const negocios = await Negocio.find(15);
    //const negocio_comentario = await Negocio.query().with('comentarios').with('fotos').with('menu').fetch();
    //const comentarios = await comentario.profile().first();
    return response.status(200).send({message:'Negocio editado con exito', data:categorias})


    /*const categorias = await Categoria.query()
      .with('negocios.comentarios.usuario')
      .with('negocios.fotos')
      .with('negocios.menu.categoria')
      .with('negocios.categoria_negocio')
      .fetch();*/
    //const negocios = await Negocio.find(15);
    //const negocio_comentario = await Negocio.query().with('comentarios').with('fotos').with('menu').fetch();
    //const comentarios = await comentario.profile().first();

    return response.status(200).send({ message: 'HOLI', data: myObj })

  }

  async getTop5({ response }) {

    const data = await Negocio
      .query()
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .orderBy('popularidad', 'desc')
      .limit(5)
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });

  }

  async getTop5ByCategoria({ request, response }) {

    const data = await Negocio
      .query()
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
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

    const data = await Negocio
    .query()
    .leftJoin('categorias', 'categorias.id', 'negocios.id_categoria')
    .with('categoria_negocio')
    .with('fotos')
    .with('horarios')
    .with('menu')
    .with('historias')
    .with('comentarios')
    .with('comentarios.usuario')
    .where('nombre', 'LIKE', '%'+request.body['data']+'%')
    .orWhere('ubicacion', 'LIKE', '%'+request.body['data']+'%')
    .orWhere('categorias.categoria', 'LIKE', '%'+request.body['data']+'%')
    .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

  async getBares({response }) {

    const data = await Negocio
      .query()
      .leftJoin('categorias', 'categorias.id', 'negocios.id_categoria')
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .where('categorias.categoria', 'LIKE', '%bar%')
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }
  async getAntros({response }) {

    const data = await Negocio
      .query()
      .leftJoin('categorias', 'categorias.id', 'negocios.id_categoria')
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .where('categorias.categoria', 'LIKE', '%antro%')
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

  async getCantinas({response }) {

    const data = await Negocio
      .query()
      .leftJoin('categorias', 'categorias.id', 'negocios.id_categoria')
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .where('categorias.categoria', 'LIKE', '%cantina%')
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

  async getBillar({response }) {

    const data = await Negocio
      .query()
      .leftJoin('categorias', 'categorias.id', 'negocios.id_categoria')
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .where('categorias.categoria', 'LIKE', '%billar%')
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

  async getClubs({response }) {

    const data = await Negocio
      .query()
      .leftJoin('categorias', 'categorias.id', 'negocios.id_categoria')
      .with('categoria_negocio')
      .with('fotos')
      .with('horarios')
      .with('menu')
      .with('historias')
      .with('comentarios')
      .with('comentarios.usuario')
      .where('categorias.categoria', 'LIKE', '%club%')
      .fetch()
    return response.status(200).send({ status: 'ok', data: data });
  }

}

module.exports = NegocioController
