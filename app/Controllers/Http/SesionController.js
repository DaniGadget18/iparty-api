'use strict'
const { validate } = use("Validator");
const User = use("App/Models/User");
const Manager = use("App/Controllers/Http/ManagerController");
const Root = use("App/Models/Root");
const Database = use("Database");
const Hash = use('Hash')
const randomstring = use("randomstring");
const Mail = use('Mail')
const Codigo = use("App/Models/Codigos")
class SesionController {

  async sesion({ request, auth, response }) {
    const { email, password } = request.all();


    const validation = await validate(request.all(), {
      email: "required",
      password: "required",
    });

    if (validation.fails()) {
      return response.status(400).send({ status: 'error', type: validation.message(), message: "Falta algun campo" });
    }

    const userFound = await User.findBy("email", email);
    if (!userFound) {
      return response.status(400).send({ status: 'error', message: 'Usuario no existe' });
    }

    if (userFound) {
      const isSame = await Hash.verify(password, userFound.password);
      if (!isSame) {
        return response.status(400).send({ status: 'error', message: 'Contraseña incorrecta' });
      }
    }

    try {
      const accessOnline = await Manager.idNegocioOnline(email);
      const token = await auth.attempt(email, password);
      const root = await Manager.isRoot(email);
      if (root > 0) {
        return response.status(200).send({ status: 'ok', data: { token, email, accessOnline }, isRoot: true });
      } else {
        return response.status(200).send({ status: 'ok', data: { token, email, accessOnline }, isRoot: false });
      }
    } catch (error) {
      return response.status(400).send({ status: 'error', message: error.message });
    }
  }

  async registrar({ request, response }) {
    const { nombre, email, foto, fecha_nacimiento, password } = request.all();

    const validation = await validate(request.all(), {
      email: 'required|email',
      nombre: 'required',
      foto: 'required',
      fecha_nacimiento: 'required',
      password: 'required|min:5'
    });

    if (validation.fails()) {
      return response.send({ status: 202, message: validation.messages() })
    }

    const userFound = await User.findBy("email", email);
    if (userFound) {
      return response.send({
        status: 202, message: 'Ya existe un usuario creado con ese correo.'
      });
    }

    const userBD = await User.create({
      email,
      nombre,
      foto,
      fecha_nacimiento,
      password,
    });

    return this.sesion(...arguments);

    //return response.status(200).send({message:'Has creado tu usuario con exito.'})
  }
  async editarusuario({ request, response }) {
    const { nombre, email, foto, fecha_nacimiento } = request.all()

    const user = await Database
      .table('users')
      .where('email', email)
      .update({
        nombre: nombre,
        foto: foto,
      })


    const editar = await Database.from('users').where('email', email)
    return response.status(200).send({ message: 'usuario editado con exito', data: editar })
  }

  async usuario({ request, response }) {
    const { email } = request.all();
    const userr = await User.findBy("email", email);
    if (!userr) {
      return response.send({ status: 400, message: "No existe este usuario" });
    }
    return response.status(200).send({ message: 'usuario encontrado', data: userr })
  }

  static async info(email) {

    const userr = await User.findBy("email", email);

    return userr;
  }

  async logout({ auth, response }) {
    await auth.logout()
    return response.status(200).send({ message: 'Hata la proxima.' })
  }

  async checkAuth({ response, request, auth }) {
    try {
      await auth.check();
      const nowUser = await auth.getUser();
      const root = await Manager.isRoot(nowUser.email);
      if (root > 0) {
        return response.status(200).send({ status: 'ok', data: nowUser, role: { isRoot: true, role: 'root' } });
      } else {
        return response.status(200).send({ status: 'ok', data: nowUser, role: { isRoot: false, role: 'admin' } });
      }
    } catch (error) {
      response.status(200).send({ status: 'error', error: error.message, type: 'token', message: 'Ocurrio un problema con el token' })
    }
  }

  async newToken({ request, response, auth }) {
    const { refresh } = request.all();
    console.log('se genero nuevo token')
    return await auth.generateForRefreshToken(refresh, false)
  }

  async enviarMailderecuperacion({ request, response, }) {
    const { email } = request.all()

    const userFound = await User.findBy("email", email);
    if (!userFound) {
      return response.send({
        status: 202, message: 'Este email no esta registrado'
      });
    }
    else {
      const data = {
        to: {
          mail: email
        },
        from: {
          mail: 'admin@iparty.com',
          name: 'AdonisJS Demo - MailGun'
        },
        subject: 'Purchase details for #XYZ-123',
        text: 'Testing some Mailgun awesomness!',
        date: '00-00-0000 00:00:00',
        book: {
          sku: 'P001',
          title: 'Build Apps with Adonis.JS',
          price: 5,
          currency: 'USD'
        }
      }



      try{

        await Mail.send('mails.mail', data, (message, error) => {
          console.log(data)
          message
            .to(email)
            .from(data.from.mail)
            .subject("prueba")
        })
        var codigo = randomstring.generate(7);
      var correo = email;
      var estado = true;
      const Codigos = await Codigo.create({
        correo,
        codigo,
        estado,
      });



        return response.status(200).send({ message: 'correo enviado', data: email })
      }
      catch(ex) {
        return response.status(400).send({ message: 'ERROR', data: ex.message })
      }

    }



    }

    async validarcodigo({ request, response, }) {
      try{
      const { email, codigo } = request.all()
      const userFound = await Codigo.query().where("correo", email).where("codigo",codigo).getCount()
      //return userFound
      if(userFound==1){
        var a=await Codigo.query().where("correo", email).where("codigo",codigo).where("estado",1).getCount()
        if(a==1){
          var b=await Codigo.query().where("correo", email).where("codigo",codigo).where("estado",1).fetch()
          return response.status(200).send({ message: 'Codigo ingresado valido', data: b })
        }
        else{
          return response.status(200).send({ message: 'Codogo ya usado', data: a })
        }
      }
      else{
        return response.status(200).send({ message: 'Codogo ingresado es erroneo', data: userFound })
      }}
      catch(ex){
        return response.status(400).send({ message: 'ERROR', data: ex.message })
      }

    }

    async cambiocontrasena({ request, response, }) {

      const { password, email } = request.all()
      const validation = await validate(request.all(), {

        password: 'required|min:5',
        email: 'required | email'
      });
      if (validation.fails()) {
        return response.send({ status: 202, message: validation.messages() })

      }
      try {
        const evento = await User.query().where('email', email).update({
          password

        });
        return response.status(200).send({ status: 'ok', message: 'se ha cambiado la contraseña exitosamente' })
      } catch (error) {
        return response.send({status: "error", message: 'Hubo un error', error: error.message});
      }

    }






}

module.exports = SesionController
