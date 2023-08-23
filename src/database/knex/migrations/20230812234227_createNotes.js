exports.up = knex => knex.schema.createTable("notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("user_id").references("id").inTable("users"); //Precisa de um user para criar um nota

    table.timestamp("create_at").default(knex.fn.now()); // fn.now() vai criar o time
    table.timestamp("uptade_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.droptable("notes")