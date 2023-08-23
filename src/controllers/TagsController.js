const knex = require("../database/knex");

class TagsController {
  async index(request, response) {
    const user_id = request.user.id;

    const tags = await knex("tags")
      .select("name") // adicionado a coluna "name" na cláusula SELECT
      .where({ user_id })
      .groupBy("name");

    return response.json(tags);
  }
}

module.exports = TagsController;
