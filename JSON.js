var inherit = require("matchbox-factory/inherit")
var Attribute = require("./Attribute")

module.exports = JSONAttribute

function JSONAttribute (def) {
  Attribute.call(this, def)
  this.type = "json"
}

inherit(JSONAttribute, Attribute)

JSONAttribute.prototype.parseValue = function(serializedValue){
  return serializedValue == null
      ? null
      : JSON.parse(serializedValue)
}

JSONAttribute.prototype.serializeValue = function(prasedValue){
  return prasedValue == null
      ? null
      : JSON.stringify(prasedValue)
}
