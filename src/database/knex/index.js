const config = require("../../../knexfile")
const knex = require("knex");

const connection = knex(config.development) // configurar a conexão, que é o kenex - dentro do knex tem a configuração de development

module.exports = connection 