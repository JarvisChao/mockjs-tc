/*
    ## valid(template, data)

    校驗真實數據 data 是否與數據模板 template 匹配。
    
    實現思路：
    1. 解析規則。
        先把數據模板 template 解析為更方便機器解析的 JSON-Schame
        name               屬性名 
        type               屬性值類型
        template           屬性值模板
        properties         對象屬性數組
        items              數組元素數組
        rule               屬性值生成規則
    2. 遞歸驗證規則。
        然後用 JSON-Schema 校驗真實數據，校驗項包括屬性名、值類型、值、值生成規則。

    提示信息 
    https://github.com/fge/json-schema-validator/blob/master/src/main/resources/com/github/fge/jsonschema/validator/validation.properties
    [JSON-Schama validator](http://json-schema-validator.herokuapp.com/)
    [Regexp Demo](http://demos.forbeslindesay.co.uk/regexp/)
*/
var Constant = require('../constant')
var Util = require('../util')
var toJSONSchema = require('../schema')

function valid(template, data) {
    var schema = toJSONSchema(template)
    var result = Diff.diff(schema, data)
    for (var i = 0; i < result.length; i++) {
        // console.log(template, data)
        // console.warn(Assert.message(result[i]))
    }
    return result
}

/*
    ## name
        有生成規則：比較解析後的 name
        無生成規則：直接比較
    ## type
        無類型轉換：直接比較
        有類型轉換：先試著解析 template，然後再檢查？
    ## value vs. template
        基本類型
            無生成規則：直接比較
            有生成規則：
                number
                    min-max.dmin-dmax
                    min-max.dcount
                    count.dmin-dmax
                    count.dcount
                    +step
                    整數部分
                    小數部分
                boolean 
                string  
                    min-max
                    count
    ## properties
        對象
            有生成規則：檢測期望的屬性個數，繼續遞歸
            無生成規則：檢測全部的屬性個數，繼續遞歸
    ## items
        數組
            有生成規則：
                `'name|1': [{}, {} ...]`            其中之一，繼續遞歸
                `'name|+1': [{}, {} ...]`           順序檢測，繼續遞歸
                `'name|min-max': [{}, {} ...]`      檢測個數，繼續遞歸
                `'name|count': [{}, {} ...]`        檢測個數，繼續遞歸
            無生成規則：檢測全部的元素個數，繼續遞歸
*/
var Diff = {
    diff: function diff(schema, data, name /* Internal Use Only */) {
        var result = []

        // 先檢測名稱 name 和類型 type，如果匹配，才有必要繼續檢測
        if (
            this.name(schema, data, name, result) &&
            this.type(schema, data, name, result)
        ) {
            this.value(schema, data, name, result)
            this.properties(schema, data, name, result)
            this.items(schema, data, name, result)
        }

        return result
    },
    /* jshint unused:false */
    name: function (schema, data, name, result) {
        var length = result.length

        Assert.equal('name', schema.path, name + '', schema.name + '', result)

        return result.length === length
    },
    type: function (schema, data, name, result) {
        var length = result.length

        switch (schema.type) {
            case 'string':
                // 跳過含有『占位符』的屬性值，因為『占位符』返回值的類型可能和模板不一致，例如 '@int' 會返回一個整形值
                if (schema.template.match(Constant.RE_PLACEHOLDER)) return true
                break
            case 'array':
                if (schema.rule.parameters) {
                    // name|count: array
                    if (schema.rule.min !== undefined && schema.rule.max === undefined) {
                        // 跳過 name|1: array，因為最終值的類型（很可能）不是數組，也不一定與 `array` 中的類型一致
                        if (schema.rule.count === 1) return true
                    }
                    // 跳過 name|+inc: array
                    if (schema.rule.parameters[2]) return true
                }
                break
            case 'function':
                // 跳過 `'name': function`，因為函數可以返回任何類型的值。
                return true
        }

        Assert.equal('type', schema.path, Util.type(data), schema.type, result)

        return result.length === length
    },
    value: function (schema, data, name, result) {
        var length = result.length

        var rule = schema.rule
        var templateType = schema.type
        if (templateType === 'object' || templateType === 'array' || templateType === 'function') return true

        // 無生成規則
        if (!rule.parameters) {
            switch (templateType) {
                case 'regexp':
                    Assert.match('value', schema.path, data, schema.template, result)
                    return result.length === length
                case 'string':
                    // 同樣跳過含有『占位符』的屬性值，因為『占位符』的返回值會通常會與模板不一致
                    if (schema.template.match(Constant.RE_PLACEHOLDER)) return result.length === length
                    break
            }
            Assert.equal('value', schema.path, data, schema.template, result)
            return result.length === length
        }

        // 有生成規則
        var actualRepeatCount
        switch (templateType) {
            case 'number':
                var parts = (data + '').split('.')
                parts[0] = +parts[0]

                // 整數部分
                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('value', schema.path, parts[0], Math.min(rule.min, rule.max), result)
                    // , 'numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})')
                    Assert.lessThanOrEqualTo('value', schema.path, parts[0], Math.max(rule.min, rule.max), result)
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('value', schema.path, parts[0], rule.min, result, '[value] ' + name)
                }

                // 小數部分
                if (rule.decimal) {
                    // |dmin-dmax
                    if (rule.dmin !== undefined && rule.dmax !== undefined) {
                        Assert.greaterThanOrEqualTo('value', schema.path, parts[1].length, rule.dmin, result)
                        Assert.lessThanOrEqualTo('value', schema.path, parts[1].length, rule.dmax, result)
                    }
                    // |dcount
                    if (rule.dmin !== undefined && rule.dmax === undefined) {
                        Assert.equal('value', schema.path, parts[1].length, rule.dmin, result)
                    }
                }

                break

            case 'boolean':
                break

            case 'string':
                // 'aaa'.match(/a/g)
                actualRepeatCount = data.match(new RegExp(schema.template, 'g'))
                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0

                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
                }

                break

            case 'regexp':
                actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ''), 'g'))
                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0

                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.min, result)
                    Assert.lessThanOrEqualTo('repeat count', schema.path, actualRepeatCount, rule.max, result)
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('repeat count', schema.path, actualRepeatCount, rule.min, result)
                }
                break
        }

        return result.length === length
    },
    properties: function (schema, data, name, result) {
        var length = result.length

        var rule = schema.rule
        var keys = Util.keys(data)
        if (!schema.properties) return

        // 無生成規則
        if (!schema.rule.parameters) {
            Assert.equal('properties length', schema.path, keys.length, schema.properties.length, result)
        } else {
            // 有生成規則
            // |min-max
            if (rule.min !== undefined && rule.max !== undefined) {
                Assert.greaterThanOrEqualTo('properties length', schema.path, keys.length, Math.min(rule.min, rule.max), result)
                Assert.lessThanOrEqualTo('properties length', schema.path, keys.length, Math.max(rule.min, rule.max), result)
            }
            // |count
            if (rule.min !== undefined && rule.max === undefined) {
                // |1, |>1
                if (rule.count !== 1) Assert.equal('properties length', schema.path, keys.length, rule.min, result)
            }
        }

        if (result.length !== length) return false

        for (var i = 0; i < keys.length; i++) {
            result.push.apply(
                result,
                this.diff(
                    function () {
                        var property
                        Util.each(schema.properties, function (item /*, index*/) {
                            if (item.name === keys[i]) property = item
                        })
                        return property || schema.properties[i]
                    }(),
                    data[keys[i]],
                    keys[i]
                )
            )
        }

        return result.length === length
    },
    items: function (schema, data, name, result) {
        var length = result.length

        if (!schema.items) return

        var rule = schema.rule

        // 無生成規則
        if (!schema.rule.parameters) {
            Assert.equal('items length', schema.path, data.length, schema.items.length, result)
        } else {
            // 有生成規則
            // |min-max
            if (rule.min !== undefined && rule.max !== undefined) {
                Assert.greaterThanOrEqualTo('items', schema.path, data.length, (Math.min(rule.min, rule.max) * schema.items.length), result,
                    '[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements')
                Assert.lessThanOrEqualTo('items', schema.path, data.length, (Math.max(rule.min, rule.max) * schema.items.length), result,
                    '[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements')
            }
            // |count
            if (rule.min !== undefined && rule.max === undefined) {
                // |1, |>1
                if (rule.count === 1) return result.length === length
                else Assert.equal('items length', schema.path, data.length, (rule.min * schema.items.length), result)
            }
            // |+inc
            if (rule.parameters[2]) return result.length === length
        }

        if (result.length !== length) return false

        for (var i = 0; i < data.length; i++) {
            result.push.apply(
                result,
                this.diff(
                    schema.items[i % schema.items.length],
                    data[i],
                    i % schema.items.length
                )
            )
        }

        return result.length === length
    }
}

/*
    完善、友好的提示信息
    
    Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
    路徑 驗證類型 描述 

    Expect path.name is less than or equal to expected, but path.name is actual.

    Expect path.name is less than or equal to expected, but path.name is actual.
    Expect path.name is greater than or equal to expected, but path.name is actual.

*/
var Assert = {
    message: function (item) {
        return (item.message ||
            '[{utype}] Expect {path}\'{ltype} {action} {expected}, but is {actual}')
            .replace('{utype}', item.type.toUpperCase())
            .replace('{ltype}', item.type.toLowerCase())
            .replace('{path}', Util.isArray(item.path) && item.path.join('.') || item.path)
            .replace('{action}', item.action)
            .replace('{expected}', item.expected)
            .replace('{actual}', item.actual)
    },
    equal: function (type, path, actual, expected, result, message) {
        if (actual === expected) return true
        switch (type) {
            case 'type':
                // 正則模板 === 字符串最終值
                if (expected === 'regexp' && actual === 'string') return true
                break
        }

        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    // actual matches expected
    match: function (type, path, actual, expected, result, message) {
        if (expected.test(actual)) return true

        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'matches',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    notEqual: function (type, path, actual, expected, result, message) {
        if (actual !== expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is not equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    greaterThan: function (type, path, actual, expected, result, message) {
        if (actual > expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is greater than',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    lessThan: function (type, path, actual, expected, result, message) {
        if (actual < expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is less to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    greaterThanOrEqualTo: function (type, path, actual, expected, result, message) {
        if (actual >= expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is greater than or equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    lessThanOrEqualTo: function (type, path, actual, expected, result, message) {
        if (actual <= expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'is less than or equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    }
}

valid.Diff = Diff
valid.Assert = Assert

module.exports = valid