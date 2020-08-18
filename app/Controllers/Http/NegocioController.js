'use strict'
const { validate } = use("Validator");
const Menu = use("App/Models/Menus");
const HorarioNegocio = use("App/Models/HorariosNegocio");
const Negocio = use("App/Models/Negocios");
const Historia = use("App/Models/Historia");
const Comentario = use("App/Models/Comentario");
const Evento = use("App/Models/Evento");
const Manager = use("App/Controllers/Http/ManagerController");
const Reservacion = use("App/Models/Reservacion");
const Mail = use('Mail')

class NegocioController {

  // Acciones en la pagina

  async obteneridnombrenegocio({request, response}) {
    const { email } = request.all();
    const validation = await validate(request.all(), {
      email: 'required | email',
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const negocio = await Negocio.query().with('usuario').where('id', id_negocio).fetch();
      const data = negocio.toJSON();
      return response.status(200).send({ status: 'ok', data: negocio, room:data[0].id +data[0].nombre })
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  async existeNegocio({request, response}) {
    const { nombre } = request.all();
    try {
      const nombrenegocio = await Negocio.findBy ('nombre', nombre)
      response.status(200).send({'status':'ok', data:nombrenegocio })
    } catch (error) {
      response.status(400).send({'status':'error', message:'Ocurrio un error', type:error.message })
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



  // Actualizar un negocio

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

      if (count === 0) {
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

    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const negocio = await Negocio.find(id_negocio)

      const menu = await negocio
        .menu()
        .create({
          nombre,
          informacion,
          id_categoria: idcategoriamenu
        })
      return response.status(200).send({ status: 'ok', message: 'Se registro correctamente el producto', data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', message: 'algo salio mal', error: error.message })
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

      return response.status(200).send({ status: 'ok', message: 'Producto editado correctamente', data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', message: 'algo salio mal', error: error.message })
    }
  }

  async getMenuByNegocioEmail({ request, response }) {
    const { email, page } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta el email" })
    }


    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const menu = await Menu.query().with('categoria').where('id_negocio', id_negocio)
        .paginate(page, 5);

      return response.status(200).send({status: 'ok', data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error.message, message: 'Hubo un error' })
    }
  }

  async obtenerMenubyID({ request, response }) {
    const { id } = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta el ID" })
    }

    try {
      const menu = await Menu.find(id);
      return response.status(200).send({ status: 'ok', data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }
  }

  async eliminarProducto({ request, response }) {
    const { id } = request.all();
    const validation = await validate(request.all(), {
      id: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta el ID" })
    }

    try {
      const menu = await Menu.find(id);
      await menu.delete();
      return response.status(200).send({ status: 'ok', message: 'Se elimino correctamente', data: menu })
    } catch (error) {
      return response.status(400).send({ status: 'error', type: error, message: 'Hubo un error' })
    }

  }
  // Termina menu

  // Fotos


  async historia({ response, request }) {
    const { id_usuario, id_negocio, duracion, url_file, tipo, url_miniatura, descripcion } = request.all();
    const histori = new Historia();

    histori.id_usuario = id_usuario
    histori.id_negocio = id_negocio
    histori.duracion = duracion
    histori.url_file = url_file
    histori.tipo = tipo
    histori.url_miniatura = url_miniatura
    histori.descripcion = descripcion
    await histori.save()
    const historiaFound = await Historia.findBy("url_file", url_file);
    if (!historiaFound) {
      return response.send({
        status: 400, message: 'Error al guardar la historia.'
      });
    }
    else {
      return response.send({
        status: 202, message: 'Se a guardado la historia exitosamente.'
      });

    }


  }


  async fotos({ response, request }) {
    const { foto, id_negocio } = request.all();
    const fotos = new Foto();
    histori.foto = foto
    histori.id_negocio = id_negocio
    await fotos.save()
    const historiaFound = await Historia.fotos("url_file", url_file);
    if (!historiaFound) {
      return response.send({
        status: 400, message: 'Error al guardar la historia.'
      });
    }
    else {
      return response.send({
        status: 202, message: 'Se a guardado la historia exitosamente.'
      });

    }
  }
  // Terminan fotos

  // Comentarios

  async comentarios({ response, request }) {
    const { email } = request.all();
    const validation = await validate(request.all(), {
      email: 'required | email'
    });
    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const negocio = await Comentario.query().with('usuario').where("id_negocio", id_negocio).fetch();
      const count = await Manager.countComentarios( id_negocio );
      if (count === 0) {
        return response.send({
          status: "ok", message: 'No tiene comentarios', data:[]
        });
      }
      else {
        return response.status(200).send({ status: 'ok', data: negocio })
      }
    } catch (error) {
      return response.send({
        status: "error", message: 'Hubo un error', error: error.message
      });
    }
  }

  async comentariosranked({ response, request }) {
    const { email, rank } = request.all();
    const validation = await validate(request.all(), {
      email: 'required | email',
      rank: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const negocio = await Comentario.query().with('usuario').where("id_negocio", id_negocio).where("calificacion", rank).fetch();
      const count = await Manager.CountRank(id_negocio, rank);
      if (count === 0) {
        return response.send({
          status: "ok", message: 'No tiene comentarios', data: []
        });
      } else {
        return response.status(200).send({ status: 'ok', data: negocio })
      }
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  // Termina comentarios


  // reservaciones

  async obtenerReservaciones({request, response}) {
    const { email, page }  = request.all();
    const validation = await validate(request.all(), {
      email: 'required | email'
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const reservaciones = await Reservacion.query().with('usuario').where('id_negocio', id_negocio)
        .paginate(page, 5);
      return response.status(200).send({ status:'ok', data: reservaciones })
    } catch (error) {
      return response.status(400).send({ status:'error', message: 'Hubo un error', type: error.message })
    }
  }

  async updateReservacion({ request, response }) {
    const {id, dia, personas, zona } = request.all();

    const validation = await validate(request.all(), {
      id: 'required',
      dia: 'required',
      personas: 'required',
      zona: 'required',

    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error: "Falta algun campo" })
    }

    try {

      const reservacion = await Reservacion.query().where('id', id).update({
        dia: dia,
        personas: personas,
        zona: zona,
      });
      return response.status(200).send({ message: 'Reservavion editada con exito', data: reservacion })
    } catch (error) {
      return response.status(400).send({ message: 'algo salio mal', error: error })
    }
  }

  async cancelarReservacion({ request, response }) {
    const { id } = request.all();

    try {

      const reservacion = await Reservacion.query().where('id', id).update({
        confirmacion: "CANCELADO",
      });
      return response.status(200).send({ message: 'Reservavion cancelada con exito', data: reservacion })
    } catch (error) {
      return response.status(400).send({ message: 'algo salio mal', error: error })
    }
  }

  // Terminan reservaciones

  // Eventos

  async obtenerEventosNegocio({request, response }) {
    const { email } = request.all();
    const validation = await validate(request.all(), {
      email: 'required | email'
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const eventos = await Evento.query().where('id_negocio', id_negocio).fetch();
      return response.status(200).send({ status: 'ok', data: eventos })
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  async obtenerEventosFecha({request, response }) {
    const { email, fecha } = request.all();

    const validation = await validate(request.all(), {
      email: 'required | email',
      fecha: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }

    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const count = await Manager.CountEventos(id_negocio);
      if (count == 0) {
        return response.status(200).send({ status: 'ok', data: [], messages:"No hay comentarios" })
      }
      const eventos = await Evento.query().where('id_negocio', id_negocio).where('fecha', fecha).fetch();
      return response.status(200).send({ status: 'ok', data: eventos })
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  async registrarEventoNegocio({request, response}) {
    const { email, nombre, fecha, foto, informacion } = request.all();
    const validation = await validate(request.all(), {
      email: 'required | email',
      nombre: 'required',
      fecha: 'required',
      foto: 'required',
      informacion: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const negocio = await Negocio.find(id_negocio);
      const evento = await negocio.eventos()
        .create({
          informacion,
          nombre,
          fecha,
          foto,
        });
      return response.status(200).send({ status: 'ok', message:'Se registro correctamente el evento', data: evento })
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  async obtenerEventoById({request, response}) {
    const {id}  = request.all();
    const validation = await validate(request.all(), {
      id: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const evento = await Evento.find(id)
      return response.status(200).send({ status: 'ok', data: evento })
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  async editarEvento({request, response}) {
    const { id, nombre, fecha, foto, informacion } = request.all();
    const validation = await validate(request.all(), {
      id: 'required',
      nombre: 'required',
      fecha: 'required',
      foto: 'required',
      informacion: 'required'
    });
    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const evento = await Evento.query().where('id', id).update({
        nombre,
        fecha,
        informacion,
        foto
      });
      return response.status(200).send({ status: 'ok', message: 'Se elimino correctamente el evento' })
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  async eliminarEvento({request, response}) {
    const {id}  = request.all();
    const validation = await validate(request.all(), {
      id: 'required'
    });

    if (validation.fails()) {
      return response.status(400).send({ status:'error', message: validation.messages(), error: "Falta algun campo" })
    }
    try {
      const evento = await Evento.find(id);
      const data = evento.delete();
      return response.status(200).send({ status: 'ok', message: 'Se elimino correctamente el evento' })
    } catch (error) {
      return response.send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }

  // Terminan eventos

  async enviarCorreoConfirmacion({request, response}){
    const { id } = request.all()

    try {

      const reservacion = await Reservacion.query().with('usuario').with('negocio.usuario').where('id',id).fetch();
      const reservacionJSON = reservacion.toJSON()
      console.log(reservacionJSON[0].dia)

      /*await Mail.send('mails.confirmacion', reservacionJSON[0], (message, error) => {
        message
          .to(reservacionJSON[0].usuario.email)
          .from(reservacionJSON[0].negocio.usuario[0].email)
          .subject("Confirmar Asistencia")
      })*/

      return response.status(200).send({ status: 'ok', mensaje: 'Sen envio el correo con exito.', data:reservacion })
    } catch (error) {
      return response.status(400).send({status: "error", message: 'Hubo un error', error: error.message});
    }
  }
}

module.exports = NegocioController

