const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, coerceTypes: true });


function RequestInvalidError (invalidProps) {
    this.name = "RequestInvalidError";
    this.invalidProps = invalidProps;
}
RequestInvalidError.prototype = Error.prototype;

function NoSchemaError () {
    this.name = "NoSchemaError";
}
NoSchemaError.prototype = Error.prototype;

function NoSchemaForMethodError (path, method) {
    this.name = "NoSchemaForMethodError";
    this.message = `${method} ${path}`;
}
NoSchemaForMethodError.prototype = Error.prototype;


const validate = schema => {
    return (req, _, next) => {
        if (!schema) return next(new NoSchemaError);
        if (!schema[req.method]) return next(new NoSchemaForMethodError(req.originalUrl, req.method));

        const test = ajv.compile(schema[req.method]);

        if (!test(req)) {
            return next(new RequestInvalidError(test.errors.map(error => ({
                ...error.params,
                occurence: error.instancePath,
                message: error.message,
            }))));
        }

        next();
    };
};

module.exports = validate;
