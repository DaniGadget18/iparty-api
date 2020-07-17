'use strict'
const { validate } = use("Validator");
const User = use("App/Models/User");
const Database = use("Database");
const Hash = use('Hash')
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
            const users = await User.all();
            return response.status(200).send({ 'message': "ok", data: { token, email, users } });
        } catch (error) {
            return response.status(400).send({ status: 'error', 'message': error });
        }
    }

    async registrar({ request, response }) {
        const {username,nombre,apellidoP, email,apellidoM,foto, fecha_nacimiento,password } = request.all();
        console.log(username,nombre,apellidoP, email,apellidoM,foto, fecha_nacimiento,password);
        const validation = await validate(request.all(), {
            username: 'required',
            email: 'required|email',
            nombre: 'required',
            apellidoP: 'required',
            apellidoM: 'required',
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
            username,
            email,
            nombre,
            apellidoP,
            apellidoM,
            foto,
            fecha_nacimiento,
            password
        });

        return this.sesion(...arguments);

        //return response.status(200).send({message:'Has creado tu usuario con exito.'})
    }

}

module.exports = SesionController