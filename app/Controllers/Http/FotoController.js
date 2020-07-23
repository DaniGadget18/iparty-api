'use strict'
const { validate } = use("Validator");
const Foto = use("App/Models/Fotos");
const PublitioAPI = use('publitio_js_sdk').default
const  { readFileSync } = use('fs');

class FotoController {


  async obtenerfotosApi() {

    this.publitio.call('/files/list', 'GET', { offset: '0', limit: '10'})
      .then(response => { console.log(response) })
      .catch(error => { console.log(error) })
  }

  async subirfoto ({ request, response }) {
    const image  = request.file();
    console.log(image);
    const publitio = new PublitioAPI('QzWG6xZdAcL9Z9igcGWA', 'SxtaWjneTr6QeN8Bhs1yB7NmMtSZWxsi');
    const archivo = readFileSync(image);
    console.log(archivo);
    this.publitio.uploadFile(file, 'archivo').then( (data) => {
      console.log(data);
    }).catch( (error) => {
      console.log(error);
    } )

  }


  async insertFotoNegocio({request, response}) {
    const { id_negocio , foto } = request.all();

    const validation = await validate(request.all(), {
      id_negocio : 'required',
      foto: 'required',
    });

    if (validation.fails()) {
      return response.status(400).send({ message: validation.messages(), error:"Falta algun campo" })
    }

    try {

      const fotoN = new Foto();
      fotoN.id_negocio = id_negocio
      fotoN.foto = foto
      await fotoN.save();
      return response.status(200).send({message:'Foto creada con exito', data:fotoN})

    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async deleteFotoNegocio({request, response}) {

    try {
      const foto = await Foto.find(request.body['id'])
      await foto.delete()
      return response.status(200).send({message:'Foto eliminada con exito', data:store})

    } catch (error) {
      return response.status(400).send({ message:'algo salio mal', error:error })
    }
  }

  async getFotoById({request ,response}){

    try {
      const foto = await Foto.query().where('id', request.body['id']).fetch()
      return response.status(200).send({data:foto})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

  async getFotoByNegocioId({request ,response}){

    try {
      const foto = await Foto.query().where('id_negocio', request.body['id_negocio']).fetch()
      return response.status(200).send({data:foto})
    } catch (error) {
      return response.status(400).send({status:'error', type:error, message:'Hubo un error'})
    }
  }

}

module.exports = FotoController
