/* 
    ## Handler

    處理數據模板。
    
    * Handler.gen( template, name?, context? )

        入口方法。

    * Data Template Definition, DTD
        
        處理數據模板定義。

        * Handler.array( options )
        * Handler.object( options )
        * Handler.number( options )
        * Handler.boolean( options )
        * Handler.string( options )
        * Handler.function( options )
        * Handler.regexp( options )
        
        處理路徑（相對和絕對）。

        * Handler.getValueByKeyPath( key, options )

    * Data Placeholder Definition, DPD

        處理數據占位符定義

        * Handler.placeholder( placeholder, context, templateContext, options )

*/

var Constant = require('./constant')
var Util = require('./util')
var Parser = require('./parser')
var Random = require('./random/')
var RE = require('./regexp')

var Handler = {
    extend: Util.extend
}

/*
    template        屬性值（即數據模板）
    name            屬性名
    context         數據上下文，生成後的數據
    templateContext 模板上下文，

    Handle.gen(template, name, options)
    context
        currentContext, templateCurrentContext, 
        path, templatePath
        root, templateRoot
*/
Handler.gen = function (template, name, context) {
    /* jshint -W041 */
    name = name == undefined ? '' : (name + '')

    context = context || {}
    context = {
        // 當前訪問路徑，只有屬性名，不包括生成規則
        path: context.path || [Constant.GUID],
        templatePath: context.templatePath || [Constant.GUID++],
        // 最終屬性值的上下文
        currentContext: context.currentContext,
        // 屬性值模板的上下文
        templateCurrentContext: context.templateCurrentContext || template,
        // 最終值的根
        root: context.root || context.currentContext,
        // 模板的根
        templateRoot: context.templateRoot || context.templateCurrentContext || template
    }
    // console.log('path:', context.path.join('.'), template)

    var rule = Parser.parse(name)
    var type = Util.type(template)
    var data

    if (Handler[type]) {
        data = Handler[type]({
            // 屬性值類型
            type: type,
            // 屬性值模板
            template: template,
            // 屬性名 + 生成規則
            name: name,
            // 屬性名
            parsedName: name ? name.replace(Constant.RE_KEY, '$1') : name,

            // 解析後的生成規則
            rule: rule,
            // 相關上下文
            context: context
        })

        if (!context.root) context.root = data
        return data
    }

    return template
}

Handler.extend({
    array: function (options) {
        var result = [],
            i, ii;

        // 'name|1': []
        // 'name|count': []
        // 'name|min-max': []
        if (options.template.length === 0) return result

        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
        if (!options.rule.parameters) {
            for (i = 0; i < options.template.length; i++) {
                options.context.path.push(i)
                options.context.templatePath.push(i)
                result.push(
                    Handler.gen(options.template[i], i, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            }
        } else {
            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
            if (options.rule.min === 1 && options.rule.max === undefined) {
                // fix #17
                options.context.path.push(options.name)
                options.context.templatePath.push(options.name)
                result = Random.pick(
                    Handler.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })
                )
                options.context.path.pop()
                options.context.templatePath.pop()
            } else {
                // 'data|+1': [{}, {}]
                if (options.rule.parameters[2]) {
                    options.template.__order_index = options.template.__order_index || 0

                    options.context.path.push(options.name)
                    options.context.templatePath.push(options.name)
                    result = Handler.gen(options.template, undefined, {
                        path: options.context.path,
                        templatePath: options.context.templatePath,
                        currentContext: result,
                        templateCurrentContext: options.template,
                        root: options.context.root || result,
                        templateRoot: options.context.templateRoot || options.template
                    })[
                        options.template.__order_index % options.template.length
                    ]

                    options.template.__order_index += +options.rule.parameters[2]

                    options.context.path.pop()
                    options.context.templatePath.pop()

                } else {
                    // 'data|1-10': [{}]
                    for (i = 0; i < options.rule.count; i++) {
                        // 'data|1-10': [{}, {}]
                        for (ii = 0; ii < options.template.length; ii++) {
                            options.context.path.push(result.length)
                            options.context.templatePath.push(ii)
                            result.push(
                                Handler.gen(options.template[ii], result.length, {
                                    path: options.context.path,
                                    templatePath: options.context.templatePath,
                                    currentContext: result,
                                    templateCurrentContext: options.template,
                                    root: options.context.root || result,
                                    templateRoot: options.context.templateRoot || options.template
                                })
                            )
                            options.context.path.pop()
                            options.context.templatePath.pop()
                        }
                    }
                }
            }
        }
        return result
    },
    object: function (options) {
        var result = {},
            keys, fnKeys, key, parsedKey, inc, i;

        // 'obj|min-max': {}
        /* jshint -W041 */
        if (options.rule.min != undefined) {
            keys = Util.keys(options.template)
            keys = Random.shuffle(keys)
            keys = keys.slice(0, options.rule.count)
            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = Handler.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
            }

        } else {
            // 'obj': {}
            keys = []
            fnKeys = [] // #25 改變了非函數屬性的順序，查找起來不方便
            for (key in options.template) {
                (typeof options.template[key] === 'function' ? fnKeys : keys).push(key)
            }
            keys = keys.concat(fnKeys)

            /*
                會改變非函數屬性的順序
                keys = Util.keys(options.template)
                keys.sort(function(a, b) {
                    var afn = typeof options.template[a] === 'function'
                    var bfn = typeof options.template[b] === 'function'
                    if (afn === bfn) return 0
                    if (afn && !bfn) return 1
                    if (!afn && bfn) return -1
                })
            */

            for (i = 0; i < keys.length; i++) {
                key = keys[i]
                parsedKey = key.replace(Constant.RE_KEY, '$1')
                options.context.path.push(parsedKey)
                options.context.templatePath.push(key)
                result[parsedKey] = Handler.gen(options.template[key], key, {
                    path: options.context.path,
                    templatePath: options.context.templatePath,
                    currentContext: result,
                    templateCurrentContext: options.template,
                    root: options.context.root || result,
                    templateRoot: options.context.templateRoot || options.template
                })
                options.context.path.pop()
                options.context.templatePath.pop()
                // 'id|+1': 1
                inc = key.match(Constant.RE_KEY)
                if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
                    options.template[key] += parseInt(inc[2], 10)
                }
            }
        }
        return result
    },
    number: function (options) {
        var result, parts;
        if (options.rule.decimal) { // float
            options.template += ''
            parts = options.template.split('.')
            // 'float1|.1-10': 10,
            // 'float2|1-100.1-10': 1,
            // 'float3|999.1-10': 1,
            // 'float4|.3-10': 123.123,
            parts[0] = options.rule.range ? options.rule.count : parts[0]
            parts[1] = (parts[1] || '').slice(0, options.rule.dcount)
            while (parts[1].length < options.rule.dcount) {
                parts[1] += (
                    // 最後一位不能為 0：如果最後一位為 0，會被 JS 引擎忽略掉。
                    (parts[1].length < options.rule.dcount - 1) ? Random.character('number') : Random.character('123456789')
                )
            }
            result = parseFloat(parts.join('.'), 10)
        } else { // integer
            // 'grade1|1-100': 1,
            result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template
        }
        return result
    },
    boolean: function (options) {
        var result;
        // 'prop|multiple': false, 當前值是相反值的概率倍數
        // 'prop|probability-probability': false, 當前值與相反值的概率
        result = options.rule.parameters ? Random.bool(options.rule.min, options.rule.max, options.template) : options.template
        return result
    },
    string: function (options) {
        var result = '',
            i, placeholders, ph, phed;
        if (options.template.length) {

            //  'foo': '★',
            /* jshint -W041 */
            if (options.rule.count == undefined) {
                result += options.template
            }

            // 'star|1-5': '★',
            for (i = 0; i < options.rule.count; i++) {
                result += options.template
            }
            // 'email|1-10': '@EMAIL, ',
            placeholders = result.match(Constant.RE_PLACEHOLDER) || [] // A-Z_0-9 > \w_
            for (i = 0; i < placeholders.length; i++) {
                ph = placeholders[i]

                // 遇到轉義斜杠，不需要解析占位符
                if (/^\\/.test(ph)) {
                    placeholders.splice(i--, 1)
                    continue
                }

                phed = Handler.placeholder(ph, options.context.currentContext, options.context.templateCurrentContext, options)

                // 只有一個占位符，並且沒有其他字符
                if (placeholders.length === 1 && ph === result && typeof phed !== typeof result) { // 
                    result = phed
                    break

                    if (Util.isNumeric(phed)) {
                        result = parseFloat(phed, 10)
                        break
                    }
                    if (/^(true|false)$/.test(phed)) {
                        result = phed === 'true' ? true :
                            phed === 'false' ? false :
                                phed // 已經是布爾值
                        break
                    }
                }
                result = result.replace(ph, phed)
            }

        } else {
            // 'ASCII|1-10': '',
            // 'ASCII': '',
            result = options.rule.range ? Random.string(options.rule.count) : options.template
        }
        return result
    },
    'function': function (options) {
        // ( context, options )
        return options.template.call(options.context.currentContext, options)
    },
    'regexp': function (options) {
        var source = ''

        // 'name': /regexp/,
        /* jshint -W041 */
        if (options.rule.count == undefined) {
            source += options.template.source // regexp.source
        }

        // 'name|1-5': /regexp/,
        for (var i = 0; i < options.rule.count; i++) {
            source += options.template.source
        }

        return RE.Handler.gen(
            RE.Parser.parse(
                source
            )
        )
    }
})

Handler.extend({
    _all: function () {
        var re = {};
        for (var key in Random) re[key.toLowerCase()] = key
        return re
    },
    // 處理占位符，轉換為最終值
    placeholder: function (placeholder, obj, templateContext, options) {
        // console.log(options.context.path)
        // 1 key, 2 params
        Constant.RE_PLACEHOLDER.exec('')
        var parts = Constant.RE_PLACEHOLDER.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            okey = this._all()[lkey],
            params = parts && parts[2] || ''
        var pathParts = this.splitPathToArray(key)

        // 解析占位符的參數
        try {
            // 1. 嘗試保持參數的類型
            /*
                #24 [Window Firefox 30.0 引用 占位符 拋錯](https://github.com/nuysoft/Mock/issues/24)
                [BX9056: 各瀏覽器下 window.eval 方法的執行上下文存在差異](http://www.w3help.org/zh-cn/causes/BX9056)
                應該屬於 Window Firefox 30.0 的 BUG
            */
            /* jshint -W061 */
            params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
        } catch (error) {
            // 2. 如果失敗，只能解析為字符串
            // console.error(error)
            // if (error instanceof ReferenceError) params = parts[2].split(/,\s*/);
            // else throw error
            params = parts[2].split(/,\s*/)
        }

        // 占位符優先引用數據模板中的屬性
        if (obj && (key in obj)) return obj[key]

        // @index @key
        // if (Constant.RE_INDEX.test(key)) return +options.name
        // if (Constant.RE_KEY.test(key)) return options.name

        // 絕對路徑 or 相對路徑
        if (
            key.charAt(0) === '/' ||
            pathParts.length > 1
        ) return this.getValueByKeyPath(key, options)

        // 遞歸引用數據模板中的屬性
        if (templateContext &&
            (typeof templateContext === 'object') &&
            (key in templateContext) &&
            (placeholder !== templateContext[key]) // fix #15 避免自己依賴自己
        ) {
            // 先計算被引用的屬性值
            templateContext[key] = Handler.gen(templateContext[key], key, {
                currentContext: obj,
                templateCurrentContext: templateContext
            })
            return templateContext[key]
        }

        // 如果未找到，則原樣返回
        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder

        // 遞歸解析參數中的占位符
        for (var i = 0; i < params.length; i++) {
            Constant.RE_PLACEHOLDER.exec('')
            if (Constant.RE_PLACEHOLDER.test(params[i])) {
                params[i] = Handler.placeholder(params[i], obj, templateContext, options)
            }
        }

        var handle = Random[key] || Random[lkey] || Random[okey]
        switch (Util.type(handle)) {
            case 'array':
                // 自動從數組中取一個，例如 @areas
                return Random.pick(handle)
            case 'function':
                // 執行占位符方法（大多數情況）
                handle.options = options
                var re = handle.apply(Random, params)
                if (re === undefined) re = '' // 因為是在字符串中，所以默認為空字符串。
                delete handle.options
                return re
        }
    },
    getValueByKeyPath: function (key, options) {
        var originalKey = key
        var keyPathParts = this.splitPathToArray(key)
        var absolutePathParts = []

        // 絕對路徑
        if (key.charAt(0) === '/') {
            absolutePathParts = [options.context.path[0]].concat(
                this.normalizePath(keyPathParts)
            )
        } else {
            // 相對路徑
            if (keyPathParts.length > 1) {
                absolutePathParts = options.context.path.slice(0)
                absolutePathParts.pop()
                absolutePathParts = this.normalizePath(
                    absolutePathParts.concat(keyPathParts)
                )

            }
        }

        key = keyPathParts[keyPathParts.length - 1]
        var currentContext = options.context.root
        var templateCurrentContext = options.context.templateRoot
        for (var i = 1; i < absolutePathParts.length - 1; i++) {
            currentContext = currentContext[absolutePathParts[i]]
            templateCurrentContext = templateCurrentContext[absolutePathParts[i]]
        }
        // 引用的值已經計算好
        if (currentContext && (key in currentContext)) return currentContext[key]

        // 尚未計算，遞歸引用數據模板中的屬性
        if (templateCurrentContext &&
            (typeof templateCurrentContext === 'object') &&
            (key in templateCurrentContext) &&
            (originalKey !== templateCurrentContext[key]) // fix #15 避免自己依賴自己
        ) {
            // 先計算被引用的屬性值
            templateCurrentContext[key] = Handler.gen(templateCurrentContext[key], key, {
                currentContext: currentContext,
                templateCurrentContext: templateCurrentContext
            })
            return templateCurrentContext[key]
        }
    },
    // https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
    normalizePath: function (pathParts) {
        var newPathParts = []
        for (var i = 0; i < pathParts.length; i++) {
            switch (pathParts[i]) {
                case '..':
                    newPathParts.pop()
                    break
                case '.':
                    break
                default:
                    newPathParts.push(pathParts[i])
            }
        }
        return newPathParts
    },
    splitPathToArray: function (path) {
        var parts = path.split(/\/+/);
        if (!parts[parts.length - 1]) parts = parts.slice(0, -1)
        if (!parts[0]) parts = parts.slice(1)
        return parts;
    }
})

module.exports = Handler