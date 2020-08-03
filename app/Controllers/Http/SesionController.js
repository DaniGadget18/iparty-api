'use strict'
const { validate } = use("Validator");
const User = use("App/Models/User");
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
            return response.send({status:202, message: validation.messages() });
        }

        const userFound = await User.findBy("email", email);
        if (!userFound) {
            return response.send({status:400, message: "No existe este usuario" });
        }

        if(userFound){
          const isSame = Hash.verify(password, userFound.password);
          if (!isSame) {
              return response.send({status:201, message:"Contraseña incorrecta"});
          }
        }

        try {

            const token = await auth.attempt(email, password);
            const allData = await Database
                        .select('negocios.id as id','users.nombre', 'negocios.nombre as negocio', 'roles.rol', 'roots.id as root_id')
                        .table('users')
                        .where('users.email', email)
                        .leftJoin('administradores', 'users.id', 'administradores.id_usuario')
                        .leftJoin('negocios', 'administradores.id_negocio', 'negocios.id')
                        .leftJoin('roles', 'administradores.id_rol', 'roles.id')
                        .leftJoin('roots', 'users.id', 'roots.id_usuario');
                        console.log(allData);
            return response.send({status:200, 'message': "ok", data: { token, email, allData} });

        } catch (error) {
            return response.send({ status: 202, message: error });
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
        const { nombre, email, foto, fecha_nacimiento} = request.all()

        const user = await Database
          .table('users')
          .where('email',email)
          .update({
            nombre: nombre,
            foto: foto,
          })


        const editar = await Database.from('users').where('email', email)
        return response.status(200).send({message:'usuario editado con exito', data:editar})
      }

      async correo ({ request, response }) {
        const { email} = request.all()


        await Mail.raw('asda', (message) => {
            message.from(email)
            message.to('baz@bar.com')
          })

        return 'Registered successfully  stack'
      }

      async usuario({ request,  response }) {
        const { email } = request.all();
        const userr =await User.findBy("email", email);
        if (!userr) {
            return response.send({status:400, message: "No existe este usuario" });
        }
        return response.status(200).send({message:'usuario encontrado', data:userr})
    }

    async logout({auth, response}){
      await auth.logout()
      return response.status(200).send({message:'Hata la proxima.'})
    }

}

module.exports = SesionController
