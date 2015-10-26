var inherit = require("matchbox-factory/inherit")
var Attribute = require("./Attribute")

module.exports = NumberAttribute

function NumberAttribute (def) {
  Attribute.call(this, def)
  this.type = "number"
}

inherit(NumberAttribute, Attribute)

NumberAttribute.prototype.parseValue = function(serializedValue){
  return serializedValue == null
      ? null
      : parseFloat(serializedValue)
}
