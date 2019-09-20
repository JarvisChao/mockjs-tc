/*
    ## Address
*/

var DICT = require('./address_dict')
var REGION = ['東北', '華北', '華東', '華中', '華南', '西南', '西北']

module.exports = {
    // 隨機生成一個大區。
    region: function () {
        return this.pick(REGION)
    },
    // 隨機生成一個（中國）省（或直轄市、自治區、特別行政區）。
    province: function () {
        return this.pick(DICT).name
    },
    // 隨機生成一個（中國）市。
    city: function (prefix) {
        var province = this.pick(DICT)
        var city = this.pick(province.children)
        return prefix ? [province.name, city.name].join(' ') : city.name
    },
    // 隨機生成一個（中國）縣。
    county: function (prefix) {
        var province = this.pick(DICT)
        var city = this.pick(province.children)
        var county = this.pick(city.children) || {
            name: '-'
        }
        return prefix ? [province.name, city.name, county.name].join(' ') : county.name
    },
    // 隨機生成一個郵政編碼（六位數字）。
    zip: function (len) {
        var zip = ''
        for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9)
        return zip
    }

    // address: function() {},
    // phone: function() {},
    // areacode: function() {},
    // street: function() {},
    // street_suffixes: function() {},
    // street_suffix: function() {},
    // states: function() {},
    // state: function() {},
}