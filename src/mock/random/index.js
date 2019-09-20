/*
    ## Mock.Random
    
    工具類，用於生成各種隨機數據。
*/

var Util = require('../util')

var Random = {
    extend: Util.extend
}

Random.extend(require('./basic'))
Random.extend(require('./date'))
Random.extend(require('./image'))
Random.extend(require('./color'))
Random.extend(require('./text'))
Random.extend(require('./name'))
Random.extend(require('./web'))
Random.extend(require('./address'))
Random.extend(require('./helper'))
Random.extend(require('./misc'))

module.exports = Random