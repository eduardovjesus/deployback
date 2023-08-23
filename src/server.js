const express = require("express");
require("express-async-errors")
const routes = require("./routes");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

require("dotenv/config");

const cors = require("cors")
const app = express(); 
app.use(express.json()); // as requisições vim em json
app.use(cors());
app.use(routes)
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

/* AppError */
app.use((error, request, response, next) => {
    if(error instanceof AppError) { /* erro foi gerado pelo lado do cliente? */
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
    console.error(error);

    return response.status(500).json({ /* caso contrário me manda essa mensagem padrão */
        status: "error",
        message: "internal server error"
    });

});

const PORT = process.env.SERVER_PORT || 3000 ;
app.listen(PORT,() => console.log(`Server is running on Port ${PORT}`));