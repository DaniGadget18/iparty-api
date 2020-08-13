'use strict'
const PublitioAPI = use("publitio_js_sdk");

const { validate } = use("Validator");
const Foto = use("App/Models/Fotos");
const User = use("App/Models/User");
const Manager = use("App/Controller/ManagerController");
const Negocio = use("App/Models/Negocios");


class FotoController {

  async subirFotosNegocio({ request, response }) {
    const { email, url, id_imagen } = request.all();

    const validation = await validate(request.all(), {
      email: "required | email",
      url: "required"
    });

    if (validation.fails()){
      return response.status(400).send({ status:"error", message:"Falta recibir url o email", type: validation.fails()});
    }

    try {
      const id_negocio = await Manager.obteneridNegocio(email);
      const negocio = await Negocio.find(id_negocio);
      const foto = await negocio.fotos().create({
        foto: url
      });

      const ultimaFoto = await Foto.query().where('foto', url).fetch();
      return response.status(200).send({status:'ok', message:'Fotos subidas con exito', foto:ultimaFoto});
    } catch (e) {
      return response.status(400).send({status:'error', message:'Hubo un error', type:e.message });
    }

  }


  async getFotoByNegocioEmail({request ,response}){
    const { email } = request.all();

    const validation = await validate(request.all(), {
      email: "required | email"
    });

    if (validation.fails()){
      return response.status(400).send({ status:"error", message:"Falta recibir el email", type: validation.fails()});
    }

    try {
      const negociousuario = await User.query().with('administradores').where('email', email).fetch();
      const resp = negociousuario.toJSON();
      const id = resp[0]['administradores'][0]['id'];

      const fotos = await Negocio.query().with('fotos').where('id', id).fetch();
      return response.status(200).send({status:'ok', data:fotos})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

}

module.exports = FotoController
