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
const CategoriaMenu = use("App/Models/Categoriamenu");
const Hash = use('Hash');
const Historia =use("App/Models/Historia");
const Manager = use("App/Controllers/Http/ManagerController");

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

    const id = await Manager.obteneridNegocio(email);

    try {

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
    const { email, nombre, ubicacion, id_categoria, informacion, lat, lng, foto } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
      nombre: 'required',
      ubicacion: 'required',
      id_categoria: 'required',
      informacion: 'required',
      lat: 'required',
      lng: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
    }

    try {
      const id = await Manager.obteneridNegocio(email);
      const negocio = await Negocio.query().where('id', id).update({
        nombre: nombre,
        ubicacion: ubicacion,
        id_categoria: id_categoria,
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

    try {
      const id = await Manager.obteneridNegocio(email);


      const count = await Manager.tieneHorarioNegocio(id)

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
      return response.status(400).send({ status: 'error', error: 'algo salio mal', message: error.message })
    }
  }


  // Menu
  async obtenerCategoriasMenu({ request, response }) {
    try{
      const categoriasMenu = await CategoriaMenu.all();
      return response.status(200).send({ status:'ok', data: categoriasMenu })
    } catch (error) {
      return response.status(400).send({ status:'error', message: 'algo salio mal', error: error.message })
    }
  }

  async registrarProductoNegocio({ request, response }) {
    const { email, nombre, informacion, idcategoriamenu } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
      nombre: 'required',
      informacion: 'required',
      idcategoriamenu: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
    }

    try{
      const id_negocio = await Manager.obteneridNegocio(email);
      const negocio = await Negocio.find(id_negocio)

      const menu = await negocio
        .menu()
        .create({
          nombre,
          informacion,
          id_categoria: idcategoriamenu
        })
      return response.status(200).send({ status:'ok', message:'Se registro correctamente el producto', data: menu })
    } catch (error) {
      return response.status(400).send({ status:'error', message: 'algo salio mal', error: error.message })
    }
  }

  async updateMenuByNegocio({ request, response }) {
    const { id, idcategoriamenu, nombre, informacion } = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
      nombre: 'required',
      informacion: 'required',
      idcategoriamenu: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
    }

    try {
      const menu = await Menu
        .query()
        .where('id', id)
        .update({
          nombre: nombre,
          informacion: informacion,
          id_categoria: idcategoriamenu
        })

      return response.status(200).send({ status:'ok', message: 'Producto editado correctamente', data: menu })
    } catch (error) {
      return response.status(400).send({ status:'error', message: 'algo salio mal', error: error.message })
    }
  }

  async getMenuByNegocioEmail({ request, response }) {
    const { email } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta el email" })
    }

    const id_negocio = await Manager.obteneridNegocio(email);

    try {
      const menu = await Negocio.query().with('menu.categoria').where('id', id_negocio).fetch();

      return response.status(200).send({ data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }
  }

  async obtenerMenubyID({request, response}) {
    const { id} = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({message: validation.messages(), error: "Falta el ID"})
    }

    try {
      const menu = await Menu.find(id);
      return response.status(200).send({status:'ok', data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }
  }

  async eliminarProducto({request, response}) {
    const { id } = request.all();
    const validation = await validate(request.all(), {
      id: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({message: validation.messages(), error: "Falta el ID"})
    }

    try {
      const menu = await Menu.find(id);
      await menu.delete();
      return response.status(200).send({ status:'ok', message:'Se elimino correctamente', data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }

  }

  async historia({ response, request }) {
    const {id_usuario,id_negocio, duracion,url_file ,tipo, url_miniatura, descripcion} = request.all();
    const histori = new Historia();

    histori.id_usuario = id_usuario
    histori.id_negocio = id_negocio
    histori.duracion = duracion
    histori.url_file = url_file
    histori.tipo =tipo
    histori.url_miniatura = url_miniatura
    histori.descripcion = descripcion
    await histori.save()
    const historiaFound = await Historia.findBy("url_file", url_file);
        if (!historiaFound) {
          return response.send({
            status: 400, message: 'Error al guardar la historia.'
        });
        }
        else{
          return response.send({
            status: 202, message: 'Se a guardado la historia exitosamente.'
        });

        }


  }

}

module.exports = NegocioController

