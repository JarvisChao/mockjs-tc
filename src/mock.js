/* global require, module, window */
var Handler = require('./mock/handler')
var Util = require('./mock/util')
var Random = require('./mock/random')
var RE = require('./mock/regexp')
var toJSONSchema = require('./mock/schema')
var valid = require('./mock/valid')

var XHR
if (typeof window !== 'undefined') XHR = require('./mock/xhr')

/*!
    Mock - 模擬請求 & 模擬數據
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
var Mock = {
    Handler: Handler,
    Random: Random,
    Util: Util,
    XHR: XHR,
    RE: RE,
    toJSONSchema: toJSONSchema,
    valid: valid,
    heredoc: Util.heredoc,
    setup: function (settings) {
        return XHR.setup(settings)
    },
    _mocked: {}
}

Mock.version = '1.0.1-beta3'

// 避免循環依賴
if (XHR) XHR.Mock = Mock

/*
    * Mock.mock( template )
    * Mock.mock( function() )
    * Mock.mock( rurl, template )
    * Mock.mock( rurl, function(options) )
    * Mock.mock( rurl, rtype, template )
    * Mock.mock( rurl, rtype, function(options) )

    根據數據模板生成模擬數據。
*/
Mock.mock = function (rurl, rtype, template) {
    // Mock.mock(template)
    if (arguments.length === 1) {
        return Handler.gen(rurl)
    }
    // Mock.mock(rurl, template)
    if (arguments.length === 2) {
        template = rtype
        rtype = undefined
    }
    // 攔截 XHR
    if (XHR) window.XMLHttpRequest = XHR
    Mock._mocked[rurl + (rtype || '')] = {
        rurl: rurl,
        rtype: rtype,
        template: template
    }
    return Mock
}

module.exports = Mock