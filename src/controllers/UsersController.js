const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError.js")
const knex = require("../database/knex")

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const checkUserExist = await knex("users").where({ email }).first();
        // vamos verificar se, por exemplo, existe

        if(checkUserExist){
            throw new AppError("Este email já está em uso")
        }

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
          name,
          email,
          password: hashedPassword,
        });

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id // pega o id que está dentro do user na requisição


        const user = await knex("users").where({ id: user_id }).first();

        if (!user) {
            throw new AppError("usuário não encontrado")
        }

        const userWithUpdateEmail = await knex("users").where({ email }).first()

        if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) { //verificar se o email já estar em uso
            throw new AppError("Esse email já está em uso")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Você precisa digitar a senha antiga para trocar a senha atual")
        }

        if (password && old_password) {
            const checkPassword = await compare(old_password, user.password)

            if(!checkPassword) {
            throw new AppError("A senha antiga não confere")
		        }

            user.password = await hash(password, 8)
        }

        await knex("users").where({ id: user_id }).update({
          name: user.name,
          email: user.email,
          password: user.password,
          update_at: knex.fn.now(),
        });

        return response.json();
    }
}

module.exports = UsersController;