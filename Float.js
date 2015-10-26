var inherit = require("matchbox-factory/inherit")
var Attribute = require("./Attribute")

module.exports = FloatAttribute

function FloatAttribute (def) {
  Attribute.call(this, def)
  this.type = "float"
}

inherit(FloatAttribute, Attribute)

FloatAttribute.prototype.parseValue = function(serializedValue){
  return serializedValue == null
      ? null
      : parseFloat(serializedValue)
}
