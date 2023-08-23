const { Router } = require("express") // nativo do express

const TagsController = require("../controllers/TagsController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const tagsRoutes = Router()

const tagsController = new TagsController(); 

tagsRoutes.get("/",ensureAuthenticated, tagsController.index); 

module.exports = tagsRoutes;