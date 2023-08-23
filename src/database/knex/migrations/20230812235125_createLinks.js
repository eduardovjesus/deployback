exports.up = knex => knex.schema.createTable("links", table => {
    table.increments("id")
    table.text("url").notNullable(); // não permite o valor nulo
    
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE")// se a nota for deletada, os links tbm vão ser
    table.timestamp("create_at").default(knex.fn.now()); // fn.now() vai criar o time
});

exports.down = knex => knex.schema.dropTable("links")