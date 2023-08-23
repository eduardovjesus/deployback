exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments("id")
    table.text("name").notNullable(); // não permite o valor nulo
    
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE")// se a nota for deletada, as tags tbm vão ser
    table.integer("user_id").references("id").inTable("users"); //cardinalidade
});

exports.down = knex => knex.schema.dropTable("tags")