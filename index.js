var Attribute = require("./Attribute")
var String = require("./String")
var Boolean = require("./Boolean")
var Number = require("./Number")
var Float = require("./Float")
var JSON = require("./JSON")

var attributes = module.exports = {}

attributes.create = function (def) {
  switch (Attribute.getType(def)) {
    case "string":
      return new String(def)
    case "boolean":
      return new Boolean(def)
    case "number":
      return new Number(def)
    case "float":
      return new Float(def)
    case "json":
      return new JSON(def)
  }
}

attributes.Attribute = Attribute
attributes.String = String
attributes.Boolean = Boolean
attributes.Number = Number
attributes.Float = Float
