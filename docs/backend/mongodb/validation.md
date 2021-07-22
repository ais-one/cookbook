# Schema Validation

- https://developer.mongodb.com/article/mongoose-versus-nodejs-driver
- https://stackoverflow.com/questions/36439780/mongoose-schema-vs-mongo-validator
- https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
- https://docs.mongodb.com/manual/core/schema-validation/

```js
db.createCollection( "contacts2", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: [ "phone" ],
    properties: {
      phone: {
          bsonType: "string",
          description: "must be a string and is required"
      },
      email: {
          bsonType : "string",
          pattern : "@mongodb\.com$",
          description: "must be a string and match the regular expression pattern"
      },
      status: {
          enum: [ "Unknown", "Incomplete" ],
          description: "can only be one of the enum values"
      },

      name: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      year: {
        bsonType: "int",
        minimum: 2017,
        maximum: 3017,
        description: "must be an integer in [ 2017, 3017 ] and is required"
      },
      major: {
        enum: [ "Math", "English", "Computer Science", "History", null ],
        description: "can only be one of the enum values and is required"
      },
      gpa: {
        bsonType: [ "double" ],
        description: "must be a double if the field exists"
     },
     address: {
        bsonType: "object",
        required: [ "city" ],
        properties: {
           street: {
              bsonType: "string",
              description: "must be a string if the field exists"
           },
           city: {
              bsonType: "string",
              description: "must be a string and is required"
           }
        }
      }
    }
  } },
  validationAction: "error", // warn
  validationLevel: "strict" // moderate
})
```

```js
db.createCollection("recipes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "servings", "ingredients"],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: "string",
          description: "'name' is required and is a string"
        },
        servings: {
          bsonType: ["int", "double"],
          minimum: 0,
          description: "'servings' is required and must be an integer with a minimum of zero."
        },
        cooking_method: {
          enum: ["broil", "grill", "roast", "bake", "saute", "pan-fry", "deep-fry", "poach", "simmer", "boil", "steam", "braise", "stew"],
          description: "'cooking_method' is optional but, if used, must be one of the listed options."
        },
        ingredients: {
          bsonType: ["array"],
          minItems: 1,
          maxItems: 50,
          items: {
            bsonType: ["object"],
            required: ["quantity", "measure", "ingredient"],
            additionalProperties: false,
            description: "'ingredients' must contain the stated fields.",
            properties: {
              quantity: {
                bsonType: ["int", "double", "decimal"],
                description: "'quantity' is required and is of double or decimal type"
              },
              measure: {
                enum: ["tsp", "Tbsp", "cup", "ounce", "pound", "each"],
                description: "'measure' is required and can only be one of the given enum values"
              },
              ingredient: {
                bsonType: "string",
                description: "'ingredient' is required and is a string"
              },
              format: {
                bsonType: "string",
                description: "'format' is an optional field of type string, e.g. chopped or diced"
              }
            }
          }
        }
      }
    }
  }
});
```