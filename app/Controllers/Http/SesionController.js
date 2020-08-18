'use strict'
const { validate } = use("Validator");
const User = use("App/Models/User");
const Manager = use("App/Controllers/Http/ManagerController");
const Root = use("App/Models/Root");
const Database = use("Database");
const Hash = use('Hash')
const Mail = use('Mail')
class SesionController {

    async sesion({ request, auth, response }) {
        const { email, password } = request.all();


        const validation = await validate(request.all(), {
            email: "required",
            password: "required",
        });

        if (validation.fails()) {
          return response.status(400).send({ status:'error', type: validation.message(), message:"Falta algun campo" });
        }

        const userFound = await User.findBy("email", email);
        if (!userFound) {
          return response.status(400).send({ status:'error', message: 'Usuario no existe' });
        }

        if(userFound){
          const isSame = await Hash.verify(password, userFound.password);
          if (!isSame) {
            return response.status(400).send({ status:'error', message: 'Contraseña incorrecta' });
          }
        }

        try {
          const accessOnline = await Manager.idNegocioOnline(email);
          const token = await auth.attempt(email, password);
          const root = await Manager.isRoot(email);
          if (root > 0){
            return response.status(200).send({status:'ok', data: { token, email, accessOnline}, isRoot: true });
          } else {
            return response.status(200).send({status:'ok', data: { token, email, accessOnline}, isRoot: false });
          }
        } catch (error) {
            return response.status(400).send({ status:'error', message: error.message });
        }
    }

    async registrar({ request, response }) {
        const {nombre, email, foto, fecha_nacimiento, password } = request.all();

        const validation = await validate(request.all(), {
            email: 'required|email',
            nombre: 'required',
            foto: 'required',
            fecha_nacimiento: 'required',
            password: 'required|min:5'
        });

        if (validation.fails()) {
            return response.send({status:202, message: validation.messages() })
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
    async editarusuario({request,response}){
        const { nombre, email, foto} = request.all()

        try {

          const user = await Database
          .table('users')
          .where('email',email)
          .update({
            nombre: nombre,
            foto: foto,
          })


          const editar = await Database.from('users').where('email', email)
          return response.status(200).send({message:'usuario editado con exito', data:editar})
        } catch (error) {
          return response.status(400).send({message:'Ocurrio un problema.', error:error.message})
        }

      }

      async usuario({ request,  response }) {
        const { email } = request.all();
        const userr =await User.findBy("email", email);
        if (!userr) {
            return response.send({status:400, message: "No existe este usuario" });
        }
        return response.status(200).send({message:'usuario encontrado', data:userr})
    }

    static async info(email) {

      const userr =await User.findBy("email", email);

      return userr;
    }

    async logout({auth, response}){
      await auth.logout()
      return response.status(200).send({message:'Hata la proxima.'})
    }

    async checkAuth({ response, request, auth }) {
      try {
        await auth.check();
        const nowUser = await auth.getUser();
        const root = await Manager.isRoot(nowUser.email);
        if (root > 0) {
          return response.status(200).send({status:'ok', data: nowUser, role:{ isRoot: true, role: 'root' } });
        } else {
          return response.status(200).send({status:'ok', data: nowUser, role: { isRoot: false, role: 'admin'} });
        }
      } catch (error) {
        response.status(200).send({status:'error', error: error.message, type:'token', message: 'Ocurrio un problema con el token'})
      }
    }

    async newToken({ request, response, auth }) {
      const { refresh } = request.all();
      console.log('se genero nuevo token')
      return await auth.generateForRefreshToken(refresh, false)
    }

    async enviarMailderecuperacion ({ request, response, }) {

      const {email} = request.all()

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

        return response.status(200).send({ message: 'correo enviado', data: email })
      }
      catch(ex) {
        return response.status(400).send({ message: 'ERROR', data: ex.message })
      }
    }

}

module.exports = SesionController
