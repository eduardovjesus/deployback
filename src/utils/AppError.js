class AppError {
    message;
    statusCode;

    constructor(message, statusCode= 400){
        this.message = message
        this.statusCode = statusCode
    } // toda classse tem o método constructor, carregado automaticamente quando a class é intsenciada
}

module.exports = AppError;