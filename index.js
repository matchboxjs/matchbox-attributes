var camelcase = require("camelcase")
var defaults = require("matchbox-util/defaults")

module.exports = function attributor( Class, options ){
  options = defaults(options, {
    camelCase: true,
    get: function( context, name ){},
    set: function( context, name, value ){},
    remove: function( context, name ){}
  })

  var attributes = new Set()

  return function define( name, def ){
    if( attributes.has(name) ){
      return Class
    }

    var attribute = new Attribute(def, options.get, options.set, options.remove)
    attributes.set(name, attribute)

    var property = options.camelCase ? camelcase(name) : name
    Object.defineProperty(Class.prototype, property, {
      get: function(){
        return attribute.get(this)
      },
      set: function( value ){
        attribute.set(this, value)
      }
    })

    return Class
  }
}

function Attribute( def, getAttribute, setAttribute, removeAttribute ){
  var typeOfDef = typeof def
  var type
  var defaultValue
  var hasDefault

  switch( typeOfDef ){
    // primitive value
    case "boolean":
    case "number":
    case "string":
      type = typeOfDef
      defaultValue = def
      hasDefault = true
      def = {}
      break
    // definition object
    case "object":
    case "undefined":
    default:
      def = def || {}
      defaultValue = def["default"]
      hasDefault = defaultValue != null

      if( typeof def["type"] == "undefined" ){
        type = hasDefault ? typeof defaultValue : "string";
      }
      else {
        type = def["type"]
      }
  }

  var shouldRemove = function( value ){ return value == null }
  var parseValue
  var stringifyValue

  switch( type ){
    case "boolean":
      shouldRemove = function( value ){ return value === false }
      parseValue = function( value ){ return value != null }
      stringifyValue = function(){ return "" }
      break
    case "number":
      parseValue = function( value ){ return value == null ? null : parseInt(value, 10) }
      break
    case "float":
      parseValue = function( value ){ return value == null ? null : parseFloat(value) }
      break
    case "string":
    default:
      stringifyValue = function( value ){ return value == null ? null : value ? "" + value : "" }
  }

  this.type = type
  this.defaultValue = defaultValue
  this.shouldRemove = shouldRemove
  this.hasDefault = hasDefault
  this.parseValue = parseValue
  this.stringifyValue = stringifyValue
  this.getter = def["get"]
  this.setter = def["set"]
  this.onchange = def["onchange"]
  if( getAttribute ) this.getAttribute = getAttribute.bind(this)
  if( setAttribute ) this.setAttribute = setAttribute.bind(this)
  if( removeAttribute ) this.removeAttribute = removeAttribute.bind(this)
}

Attribute.prototype.getAttribute = function( context, name ){}
Attribute.prototype.setAttribute = function( context, name, value ){}
Attribute.prototype.hasAttribute = function( context, name ){}
Attribute.prototype.removeAttribute = function( context, name ){}

Attribute.prototype.get = function( context, useDefault ){
  if( this.getter ){
    return this.getter.call(context)
  }

  var value = this.getAttribute(context, this.name)
  if( value == null && useDefault == true ){
    return this.defaultValue
  }
  return this.parseValue ? this.parseValue(value) : value
}

Attribute.prototype.set = function( context, value, callOnchange ){
  if( this.setter ){
    this.setter.call(context)
    return
  }

  var old = this.get(context, false)
  if( this.shouldRemove(value) ){
    this.removeAttribute(context, this.name)
  }
  else if( old === value ){
    return
  }
  else {
    var newValue = this.stringifyValue ? this.stringifyValue(value) : value
    this.setAttribute(context, this.name, newValue)
  }
  this.onchange && callOnchange != false && this.onchange.call(context, old, value)
}
