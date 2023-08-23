const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename; // recebendo arquivo do user

    const diskStorage = new DiskStorage();

    const updateDoUser = await knex("users")
		.where({id: user_id }).first(); // pega todos os dados do usuário

    if (!updateDoUser) {
      throw new AppError("Somente usuarios autenticados podem mudar o avatar", 401);
    }

    if (updateDoUser.avatar) {
      await diskStorage.deleteFile(updateDoUser.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);
    updateDoUser.avatar = filename; // user é o conjunto de colunas, ele pega a coluna avatar e define o filename

    await knex("users").update(updateDoUser).where({ id: user_id }); // pega as informações salva o

    return response.json(updateDoUser);
  }
}

module.exports = UserAvatarController;

// verifica se o usuário está autenticado
// verifica se o usuário já tinha uma imagem de avatar
// Se o usuário já tinha uma imagem de avatar, o controlador a deleta para que ela possa ser substituída.
// ele salva a nova imagem de avatar no disco e atualiza o registro do usuário no banco de dados com o nome do arquivo da nova imagem.