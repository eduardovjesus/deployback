const path = require("path")

module.exports = {

  development: { // configuração do knex com o banco de dados
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db") // para ser acessivel com diversos sistemas operacionais
    },
    pool:{
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations") // Isso irá entrar na pasta src, em seguida na pasta database, depois na pasta database.db e, por fim, na pasta knex, onde você encontrará a pasta migrations.
    },
    useNullAsDefault: true
  },

};
