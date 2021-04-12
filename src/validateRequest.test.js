const schema = {
    "POST": {
        "type": "object",
        "properties": {
            "params": {
                "type": "object",
                "additionalProperties": false
            },
            "body": {
                "type": "object",
                "additionalProperties": false,
                "required": ["name"],
                "properties": {
                    "name": {
                        "type": "string",
                        "minLength": 1,
                        "maxLength": 255
                    },
                },
            },
            "query": {
                "type": "object",
                "additionalProperties": false
            },
        }
    }
};



describe("validateRequest", () => {
    it("is a function", () => {
        const val = require("./validateRequest")(schema);
        expect(typeof val).toBe("function");
    });

    it("requires a schema", () => {
        const val = require("./validateRequest")();
        const req = {
            method: "GET",
            originalUrl: "/test",
        };

        let result;

        val(req, null, error => result = error);
        expect(result.name).toBe("NoSchemaError");
    });

    it("calls next() callback with an error when method is not in schema", () => {
        const val = require("./validateRequest")(schema);
        const req = {
            method: "GET",
            originalUrl: "/test",
        };

        let result;

        val(req, null, error => result = error);
        expect(result.name).toBe("NoSchemaForMethodError");
    });

    it("calls next() callback with a RequestInvalidError when request does not match schema", () => {
        const val = require("./validateRequest")(schema);
        const req = {
            method: "POST",
            originalUrl: "/test",
            params: {
                id: 1,
            },
        };

        let result;

        val(req, null, error => result = error);
        expect(result.name).toBe("RequestInvalidError");
    });

    it("returns details on invalid data in request", () => {
        const val = require("./validateRequest")(schema);
        const req = {
            method: "POST",
            originalUrl: "/test",
            params: {
                id: 1,
            },
        };

        let result;

        val(req, null, error => result = error);
        expect(Array.isArray(result.invalidProps)).toBe(true);
    });

    it("RequestInvalidError details contain keys 'occurence' and 'message'", () => {
        const val = require("./validateRequest")(schema);
        const req = {
            method: "POST",
            originalUrl: "/test",
            params: {
                id: 1,
            },
        };

        let result;

        val(req, null, error => result = error);

        expect(result.invalidProps).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    occurence: expect.any(String),
                    message: expect.any(String),
                }),
            ])
            );
        });

        it("calls next() when request is valid", () => {
        const val = require("./validateRequest")(schema);
        const req = {
            method: "POST",
            originalUrl: "/test",
            body: {
                name: "valid value",
            },
        };

        let result;

        val(req, null, error => result = error);
        expect(result).toBe(undefined);
    });
});
