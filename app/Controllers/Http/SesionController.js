'use strict'
const User = use("App/Models/User");
const Database = use("Database");
class SesionController {

    async sesion({ request, auth, response }) {
        const { user, password } = request.all();


        const validation = await validate(request.all(), {
            user: "required",
            password: "required",
        });

        if (validation.fails()) {
            return response.status(400).send({ message: validation.messages() });
        }

        const userFound = await User.findBy("user", user);
        if (!userFound) {
            return response.status(400).send({ message: "No existe este usuario" });
        }


        const isSame = Hash.verify(password, userFound.password);
        if (!isSame) {
            return response.status(400).send("Contraseña incorrecta");
        }

        try {
            const token = await auth.attempt(user, password);
            const users = await User.all();
            return response.status(200).send({ 'message': "ok", data: { token, user, users } });
        } catch (error) {
            return response.status(400).send({ status: 'error', 'message': error });
        }
    }

    async registrar({ request, response }) {
        const { user, password } = request.all();
        console.log(user, password);
        const validation = await validate(request.all(), {
            user: 'required',
            password: 'required|min:5'
        });

        if (validation.fails()) {
            return response.status(400).send({ message: validation.messages() })
        }

        const userFound = await User.findBy("user", user);
        if (userFound) {
            return response.send({
                status: 'error', message: 'Ya existe un usuario creado con ese usuario.'
            });
        }

        const userBD = await User.create({
            user,
            password
        });

        return this.login(...arguments);

        //return response.status(200).send({message:'Has creado tu usuario con exito.'})
    }

}

module.exports = SesionController
