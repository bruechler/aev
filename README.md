# aev - Another Express Validator

aev makes use of [Ajv JSON schema validator](https://www.npmjs.com/package/ajv) to provide a fast and easy to use request validation middleware for your express application.

The Ajv documentation can be found on the official website: https://ajv.js.org

## Installation
```
npm i aev
```

## Usage

### 1. Create JSON schema

Create a schema file that contains all methods you want to validate. Since aev finds the definition by `req.method` you have to name your properties accordingly.

For each method aev can validate all properties in the express request object like `params`, `query` and `body`. However, they are optional in your definition.
```
// requests.schema.json

{
    "GET": {
        "type": "object",
        "properties": {
            "params": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "id": {
                        "type": "integer",
                    },
                }
            },
            "query": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "search": {
                        "type": "string",
                    }
                }
            }
        }
    },

    "POST": {
        ...
    },
    "PUT": {
        ...
    }
    ...
}
```


### 2. Require aev
Require your schema file, require aev and pass in that schema. This is all we need.
```
const schema = require("requests.schema");
const validateRequest = require("aev")(schema);
```


### 3. Use middleware
Just use it like every other middleware. aev identifies the required schema by request method, so we do not have to worry about it when calling it:
```
// exampleRouter.js

router.get("/example", validateRequest, (req, res, next) => {
    // ...
}
```


### 4. Handle errors
aev calls next() with one of three custom errors. You can handle them in an error handler middleware like so:

```
// app.js

app.use(async (error, req, res, next) => {
    if (error.name === "RequestInvalidError") {
        // ...
    }
});
```

### RequestInvalidError
When validation fails, RequestInvalidError provides additional information as an Array `error.invalidProps` with all invalid request properties as Objects. Each contains the `occurence` and `message` as well as `error.params` from Ajv test errors. For more details please see Ajv documentation.

### NoSchemaError
NoSchemaError will be thrown when aev middleware is called but no schema is set.

### NoSchemaForMethodError
aev throws NoSchemaForMethodError when its middleware is called but the provided schema file does not contain definitions for the request method.
