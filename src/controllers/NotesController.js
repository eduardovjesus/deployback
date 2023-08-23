const knex = require("../database/knex")

// Junto com a nota é criado o LINK e as TAGS
class NotesController {
    async create(request, response) { // criar notas
        const { title , description, tags, links } = request.body; 
        const user_id = request.user.id 
        
        const [note_id] = await knex("notes").insert({ // insere nova tabela usando knex
        title , 
        description, 
        user_id
        });

        const linksInsert = links.map(link => { // O método map é usado para percorrer o array de links e criar um novo array de objetos com as informações necessárias.
            return {
                note_id,
                url: link
            }
        });
        
        await knex("links").insert(linksInsert) // knex é usado para inserir o array linksInsert na tabela "links" do banco de dados.

        const tagsInsert = tags.map(name => {  //map é usado para percorrer o array de tags e criar um novo array de objetos com as informações necessárias.
            return {
                note_id,
                name,
                user_id
            }
        });
        
        await knex("tags").insert(tagsInsert)

        return response.json();
    }

    async show(request, response) { // carregar uma nota especifica através do params
        const { id } = request.params;

        const note = await knex("notes").where({ id }).first(); //busca a nota baseado no ID
        //first() é usado para retornar apenas o primeiro registro encontrado na consulta
        
        const tags = await knex("tags").where({ note_id: id }).orderBy("name"); //busca a tags da nota e ordena por nome
        const links = await knex("links").where({ note_id: id }).orderBy("create_at"); //busca os links da nota e ordena por data


        return response.json({ //retorna um objeto JSON contendo a nota, as tags e os links encontrados nas consultas anteriores.
            ...note,
            tags,
            links
        });
    }

    async delete(request, response) { // deletar notas
        const { id } = request.params;

        await knex("notes").where({ id }).delete();
        return response.json();
    }

    async index(request, response) { //filtro de pesquisa através do query
        const { title, tags } = request.query;
        const user_id = request.user.id 

        let notes;
        if(tags){
        const filterTags = tags.split(',').map(tag => tag.trim())

        notes = await knex("tags")
        .select([
            'notes.id', 
            'notes.title', 
            'notes.user_id'
        ])
        .where('notes.user_id', user_id)
        .whereLike('notes.title', `%${title}%`)
        .whereIn('name', filterTags)
        .innerJoin('notes', 'notes.id', 'tags.note_id')  
        .groupBy("notes.id")
        .orderBy("title");      
        }else {
        notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
        }

        const userTags = await knex("tags").where({ user_id })
        const notesWithTags = notes.map(note => { // é feito um mapeamento das notas retornadas da busca inicial, armazenando em notesWithTags
            const noteTags = userTags.filter(tag => tag.note_id === note.id) // Para cada nota em notesWithTags, é feita uma filtragem em userTags
            return{ // retornando somente as tags que possuem o mesmo note_id da nota em questão
                ...note,
                tags:noteTags //Essas tags filtradas (noteTags) são então adicionadas na propriedade tags
            }
        })

        return response.json(notesWithTags);
    }
}

module.exports = NotesController;
