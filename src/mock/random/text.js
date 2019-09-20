/*
    ## Text

    http://www.lipsum.com/
*/
var Basic = require('./basic')
var Helper = require('./helper')

function range(defaultMin, defaultMax, min, max) {
    return min === undefined ? Basic.natural(defaultMin, defaultMax) : // ()
        max === undefined ? min : // ( len )
            Basic.natural(parseInt(min, 10), parseInt(max, 10)) // ( min, max )
}

module.exports = {
    // 隨機生成一段文本。
    paragraph: function (min, max) {
        var len = range(3, 7, min, max)
        var result = []
        for (var i = 0; i < len; i++) {
            result.push(this.sentence())
        }
        return result.join(' ')
    },
    // 
    cparagraph: function (min, max) {
        var len = range(3, 7, min, max)
        var result = []
        for (var i = 0; i < len; i++) {
            result.push(this.csentence())
        }
        return result.join('')
    },
    // 隨機生成一個句子，第一個單詞的首字母大寫。
    sentence: function (min, max) {
        var len = range(12, 18, min, max)
        var result = []
        for (var i = 0; i < len; i++) {
            result.push(this.word())
        }
        return Helper.capitalize(result.join(' ')) + '.'
    },
    // 隨機生成一個中文句子。
    csentence: function (min, max) {
        var len = range(12, 18, min, max)
        var result = []
        for (var i = 0; i < len; i++) {
            result.push(this.cword())
        }

        return result.join('') + '。'
    },
    // 隨機生成一個單詞。
    word: function (min, max) {
        var len = range(3, 10, min, max)
        var result = '';
        for (var i = 0; i < len; i++) {
            result += Basic.character('lower')
        }
        return result
    },
    // 隨機生成一個或多個漢字。
    cword: function (pool, min, max) {
        // 最常用的 500 個漢字 http://baike.baidu.com/view/568436.htm
        var DICT_KANZI = '的一是在不了有和人這中大為上個國我以要他時來用們生到作地於出就分對成會可主發年動同工也能下過子說產種面而方後多定行學法所民得經十三之進著等部度家電力裏如水化高自二理起小物現實加量都兩體制機當使點從業本去把性好應開它合還因由其些然前外天政四日那社義事平形相全表間樣與關各重新線內數正心反你明看原又麽利比或但質氣第向道命此變條只沒結解問意建月公無系軍很情者最立代想已通並提直題黨程展五果料象員革位入常文總次品式活設及管特件長求老頭基資邊流路級少圖山統接知較將組見計別她手角期根論運農指幾九區強放決西被幹做必戰先回則任取據處隊南給色光門即保治北造百規熱領七海口東導器壓志世金增爭濟階油思術極交受聯什認六共權收證改清己美再采轉更單風切打白教速花帶安場身車例真務具萬每目至達走積示議聲報鬥完類八離華名確才科張信馬節話米整空元況今集溫傳土許步群廣石記需段研界拉林律叫且究觀越織裝影算低持音眾書布覆容兒須際商非驗連斷深難近礦千周委素技備半辦青省列習響約支般史感勞便團往酸歷市克何除消構府稱太準精值號率族維劃選標寫存候毛親快效斯院查江型眼王按格養易置派層片始卻專狀育廠京識適屬圓包火住調滿縣局照參紅細引聽該鐵價嚴龍飛'

        var len
        switch (arguments.length) {
            case 0: // ()
                pool = DICT_KANZI
                len = 1
                break
            case 1: // ( pool )
                if (typeof arguments[0] === 'string') {
                    len = 1
                } else {
                    // ( length )
                    len = pool
                    pool = DICT_KANZI
                }
                break
            case 2:
                // ( pool, length )
                if (typeof arguments[0] === 'string') {
                    len = min
                } else {
                    // ( min, max )
                    len = this.natural(pool, min)
                    pool = DICT_KANZI
                }
                break
            case 3:
                len = this.natural(min, max)
                break
        }

        var result = ''
        for (var i = 0; i < len; i++) {
            result += pool.charAt(this.natural(0, pool.length - 1))
        }
        return result
    },
    // 隨機生成一句標題，其中每個單詞的首字母大寫。
    title: function (min, max) {
        var len = range(3, 7, min, max)
        var result = []
        for (var i = 0; i < len; i++) {
            result.push(this.capitalize(this.word()))
        }
        return result.join(' ')
    },
    // 隨機生成一句中文標題。
    ctitle: function (min, max) {
        var len = range(3, 7, min, max)
        var result = []
        for (var i = 0; i < len; i++) {
            result.push(this.cword())
        }
        return result.join('')
    }
}