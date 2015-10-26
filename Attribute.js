var camelcase = require("camelcase")

module.exports = Attribute

function Attribute (def) {
  if (typeof def == "undefined" || def == null) {
    def = {}
  }
  this.type = def.type || this.defaultType
  this.name = def.name || ""
  this.prefix = def.prefix || this.defaultPrefix
  this.camelcase = def.camelcase == null ? this.defaultCamelcase : !!def.camelcase
  this.property = def.property || this.name
  this.onchange = def.onchange || null
  this.default = null

  if (Attribute.isPrimitive(def)) {
    this.default = def
  }
  else if (def != null && def.hasOwnProperty("default")) {
    this.default = def.default
  }
}

/**
 * Returns the type from a default value, or a definition object.
 * Note: that it fails to detect whole number floats as float.
 * */
Attribute.getType = function (def) {
  if (typeof def == "undefined" || def == null) {
    return null
  }

  var value
  if (Attribute.isPrimitive(def)) {
    value = def
  }
  else if (typeof def.type == "string") {
    return def.type
  }
  else if (def.hasOwnProperty("default")) {
    value = def.default
    if (typeof value == "object") {
      return "json"
    }
  }

  switch (typeof value) {
    case "number":
      // note: it fails for 1.0
      if (value === +value && value !== (value | 0)) {
        return "float"
      }
  }
  return typeof value
}

/**
 * Check if this value is primitive
 * */
Attribute.isPrimitive = function (value) {
  switch( typeof value ) {
    case "boolean":
    case "number":
    case "string":
      return true
    default:
      return false
  }
}

Attribute.prototype.defaultType = "string"
Attribute.prototype.defaultPrefix = ""
/** Controls if the property accessor is camelized. */
Attribute.prototype.defaultCamelcase = true

/**
 * Returns the prefixed name for this attribute
 * */
Object.defineProperty(Attribute.prototype, "prefixedName", {
  get: function () {
    return this.prefix + this.name
  }
})

/**
 * Called when retrieving a value from a context.
 * It should return a normalized form if a serialized value.
 * */
Attribute.prototype.parseValue = function (serializedValue) {
  return serializedValue
}
/**
 * Called when setting a value on a context.
 * It should return a serialized representation of a value.
 * */
Attribute.prototype.serializeValue = function (parsedValue) {
  return parsedValue
}
/**
 * Checks if a value should trigger an attribute removal.
 * */
Attribute.prototype.shouldRemove = function( parsedValue ){
  return parsedValue == null
}

/**
 * Returns a context for the attribute manager methods
 * */
Attribute.prototype.getContext = function (context) {
  return context
}

/**
 * Assign a property getter-setter to an object
 * which will proxy the attribute definition's `get` and `set` methods.
 * */
Attribute.prototype.defineProperty = function (obj, propertyName, getContext) {
  var attribute = this
  propertyName = this.camelcase ? camelcase(propertyName) : propertyName
  getContext = getContext || attribute.getContext

  Object.defineProperty(obj, propertyName, {
    get: function () {
      var context = getContext(this) || this
      return attribute.get(context)
    },
    set: function (value) {
      var context = getContext(this) || this
      attribute.set(context, value, true)
    }
  })
}

/**
 * It should return a serialized value from a context.
 * */
Attribute.prototype.getFromContext = function (context, prefixedName) {
  return context[prefixedName]
}
/**
 * It should set a serialized value on a context.
 * */
Attribute.prototype.setOnContext = function (context, prefixedName, serializedValue) {
  context[prefixedName] = serializedValue
}
/**
 * It should return whether or not an attribute exists on a context.
 * */
Attribute.prototype.hasOnContext = function (context, prefixedName) {
  return context.hasOwnProperty(prefixedName)
}
/**
 * It should remove an attribute value from a context.
 * */
Attribute.prototype.removeFromContext = function (context, prefixedName) {
  return delete context[prefixedName]
}

/**
 * Returns a parsed value from the context if it exists,
 * otherwise the default value.
 * */
Attribute.prototype.get = function( context ){
  if (this.hasOnContext(context, this.prefixedName)) {
    return this.parseValue(this.getFromContext(context, this.prefixedName))
  }
  else {
    return this.default
  }
}
/**
 * Serializes a parsed value and sets it on the context,
 * but only if it's not equal to the previous value.
 * If the value provided triggers a removal, it removes the attribute from the context.
 * */
Attribute.prototype.set = function( context, parsedValue, callOnchange ){
  var previousValue
  var newValue

  if (this.hasOnContext(context, this.prefixedName)) {
    previousValue = this.parseValue(this.getFromContext(context, this.prefixedName))

    // setting to the same value
    if( previousValue === parsedValue ){
      return
    }

    // removing existing value
    if( this.shouldRemove(parsedValue) ){
      this.removeFromContext(context, this.prefixedName)
      if (this.onchange && callOnchange != false) {
        this.onchange.call(context, previousValue, parsedValue)
      }
      return
    }
  }

  // don't need to remove which is not there
  if( this.shouldRemove(parsedValue) ){
    return
  }

  // setting a new value
  newValue = this.serializeValue(parsedValue)
  this.setOnContext(context, this.prefixedName, newValue)
  if (this.onchange && callOnchange != false) {
    this.onchange.call(context, previousValue, parsedValue)
  }
}
