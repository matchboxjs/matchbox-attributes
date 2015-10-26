var inherit = require("matchbox-factory/inherit")
var Attribute = require("./Attribute")

module.exports = StringAttribute

function StringAttribute (def) {
  Attribute.call(this, def)
  this.type = "string"
}

inherit(StringAttribute, Attribute)

StringAttribute.prototype.parseValue = function(serializedValue){
  return serializedValue == null
      ? null
      : "" + serializedValue
}
