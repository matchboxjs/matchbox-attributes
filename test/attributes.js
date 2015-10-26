var assert = require("chai").assert
var Attribute = require("../Attribute")

function test (name, fn) {
  it(name, function () {
    function Test () {
      this.values = {
        'test-string': "string",
        'prefixed-value': "prefixed"
      }
    }
    fn.call(this, Test)
  })
}

function getContext(test) {
  return test.values
}

describe("attributes", function () {

  describe("Attribute", function () {

    test("getter", function (Test) {
      var attr = new Attribute()
      attr.name = "test-string"
      attr.defineProperty(Test.prototype, "testProperty", getContext)
      var test = new Test()
      assert.equal(test.testProperty, "string")
    })
    test("setter", function (Test) {
      var attr = new Attribute()
      attr.name = "test-string"
      attr.defineProperty(Test.prototype, "testProperty", getContext)
      var test = new Test()
      test.testProperty = "test"
      assert.equal(test.values["test-string"], "test")
      assert.equal(test.testProperty, "test")
    })
    test("remove", function (Test) {
      var attr = new Attribute()
      attr.name = "test-string"
      attr.defineProperty(Test.prototype, "testProperty", getContext)
      var test = new Test()
      test.testProperty = null
      assert.isFalse(test.values.hasOwnProperty(["test-string"]))
      assert.isNull(test.testProperty)
    })
    test("prefixed", function (Test) {
      var attr = new Attribute()
      attr.name = "value"
      attr.prefix = "prefixed-"
      attr.defineProperty(Test.prototype, "testProperty", getContext)
      var test = new Test()
      test.testProperty = "test"
      assert.equal(test.values["prefixed-value"], "test")
      assert.equal(test.testProperty, "test")
    })
    test("camelcase property", function (Test) {
      var attr = new Attribute()
      attr.name = "value"
      attr.prefix = "prefixed-"
      attr.defineProperty(Test.prototype, "test-property", getContext)
      var test = new Test()
      test.testProperty = "test"
      assert.equal(test.values["prefixed-value"], "test")
      assert.equal(test.testProperty, "test")
    })
  })
})
