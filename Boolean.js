var inherit = require("matchbox-factory/inherit")
var Attribute = require("./Attribute")

module.exports = BooleanAttribute

function BooleanAttribute (def) {
  Attribute.call(this, def)
  this.type = "boolean"
}

inherit(BooleanAttribute, Attribute)

BooleanAttribute.prototype.parseValue = function(serializedValue){
  return serializedValue == null
    ? null
    : !!serializedValue
}
