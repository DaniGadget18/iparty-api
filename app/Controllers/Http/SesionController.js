'use strict'
const { validate } = use("Validator");
const User = use("App/Models/User");
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
            return response.status(400).send({ message: validation.messages() });
        }

        const userFound = await User.findBy("email", email);
        if (!userFound) {
            return response.status(400).send({ message: "No existe este usuario" });
        }


        const isSame = Hash.verify(password, userFound.password);
        if (!isSame) {
            return response.status(400).send("Contraseña incorrecta");
        }

        try {
            const token = await auth.attempt(email, password);
            const data = await Database
                        .table('users')
                        .where('users.email', email)
                        .innerJoin('administradores', 'users.id', 'administradores.id_usuario');
            if(typeof data.foo !== 'undefined'){
              return response.status(200).send({ 'message': "ok", data: { token, email, data } });
            }else{
              return response.status(200).send({ 'message': "ok", data: { token, email } });
            }

        } catch (error) {
            return response.status(400).send({ status: 'error', 'message': error });
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
            return response.status(400).send({ message: validation.messages() })
        }

        const userFound = await User.findBy("email", email);
        if (userFound) {
            return response.send({
                status: 'error', message: 'Ya existe un usuario creado con ese correo.'
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
        const {username, nombre, email, foto, fecha_nacimiento} = request.all()

        const user = await Database
          .table('users')
          .where('email',email)
          .update({
            username: username,
            email:email ,
            nombre: nombre,
            foto: foto,
            fecha_nacimiento: fecha_nacimiento,
          })

        console.log(nombre)
        const editar = await Database.from('users').where('email', email)
        return response.status(200).send({message:'usuario editado con exito', data:editar})
      }

      async correo ({ request, response }) {
        const { email} = request.all()
        console.log(email)

        await Mail.raw('asda', (message) => {
            message.from(email)
            message.to('baz@bar.com')
          })

        return 'Registered successfully  stack'
      }



}

module.exports = SesionController
