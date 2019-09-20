/*
    ## Color

    http://llllll.li/randomColor/
        A color generator for JavaScript.
        randomColor generates attractive colors by default. More specifically, randomColor produces bright colors with a reasonably high saturation. This makes randomColor particularly useful for data visualizations and generative art.

    http://randomcolour.com/
        var bg_colour = Math.floor(Math.random() * 16777215).toString(16);
        bg_colour = "#" + ("000000" + bg_colour).slice(-6);
        document.bgColor = bg_colour;
    
    http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
        Creating random colors is actually more difficult than it seems. The randomness itself is easy, but aesthetically pleasing randomness is more difficult.
        https://github.com/devongovett/color-generator

    http://www.paulirish.com/2009/random-hex-color-code-snippets/
        Random Hex Color Code Generator in JavaScript

    http://chancejs.com/#color
        chance.color()
        // => '#79c157'
        chance.color({format: 'hex'})
        // => '#d67118'
        chance.color({format: 'shorthex'})
        // => '#60f'
        chance.color({format: 'rgb'})
        // => 'rgb(110,52,164)'

    http://tool.c7sky.com/webcolor
        網頁設計常用色彩搭配表
    
    https://github.com/One-com/one-color
        An OO-based JavaScript color parser/computation toolkit with support for RGB, HSV, HSL, CMYK, and alpha channels.
        API 很讚

    https://github.com/harthur/color
        JavaScript color conversion and manipulation library

    https://github.com/leaverou/css-colors
        Share & convert CSS colors
    http://leaverou.github.io/css-colors/#slategray
        Type a CSS color keyword, #hex, hsl(), rgba(), whatever:

    色調 hue
        http://baike.baidu.com/view/23368.htm
        色調指的是一幅畫中畫面色彩的總體傾向，是大的色彩效果。
    飽和度 saturation
        http://baike.baidu.com/view/189644.htm
        飽和度是指色彩的鮮艷程度，也稱色彩的純度。飽和度取決於該色中含色成分和消色成分（灰色）的比例。含色成分越大，飽和度越大；消色成分越大，飽和度越小。
    亮度 brightness
        http://baike.baidu.com/view/34773.htm
        亮度是指發光體（反光體）表面發光（反光）強弱的物理量。
    照度 luminosity
        物體被照亮的程度,采用單位面積所接受的光通量來表示,表示單位為勒[克斯](Lux,lx) ,即 1m / m2 。

    http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
        var letters = '0123456789ABCDEF'.split('')
        var color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    
        // 隨機生成一個無腦的顏色，格式為 '#RRGGBB'。
        // _brainlessColor()
        var color = Math.floor(
            Math.random() *
            (16 * 16 * 16 * 16 * 16 * 16 - 1)
        ).toString(16)
        color = "#" + ("000000" + color).slice(-6)
        return color.toUpperCase()
*/

var Convert = require('./color_convert')
var DICT = require('./color_dict')

module.exports = {
    // 隨機生成一個有吸引力的顏色，格式為 '#RRGGBB'。
    color: function (name) {
        if (name || DICT[name]) return DICT[name].nicer
        return this.hex()
    },
    // #DAC0DE
    hex: function () {
        var hsv = this._goldenRatioColor()
        var rgb = Convert.hsv2rgb(hsv)
        var hex = Convert.rgb2hex(rgb[0], rgb[1], rgb[2])
        return hex
    },
    // rgb(128,255,255)
    rgb: function () {
        var hsv = this._goldenRatioColor()
        var rgb = Convert.hsv2rgb(hsv)
        return 'rgb(' +
            parseInt(rgb[0], 10) + ', ' +
            parseInt(rgb[1], 10) + ', ' +
            parseInt(rgb[2], 10) + ')'
    },
    // rgba(128,255,255,0.3)
    rgba: function () {
        var hsv = this._goldenRatioColor()
        var rgb = Convert.hsv2rgb(hsv)
        return 'rgba(' +
            parseInt(rgb[0], 10) + ', ' +
            parseInt(rgb[1], 10) + ', ' +
            parseInt(rgb[2], 10) + ', ' +
            Math.random().toFixed(2) + ')'
    },
    // hsl(300,80%,90%)
    hsl: function () {
        var hsv = this._goldenRatioColor()
        var hsl = Convert.hsv2hsl(hsv)
        return 'hsl(' +
            parseInt(hsl[0], 10) + ', ' +
            parseInt(hsl[1], 10) + ', ' +
            parseInt(hsl[2], 10) + ')'
    },
    // http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
    // https://github.com/devongovett/color-generator/blob/master/index.js
    // 隨機生成一個有吸引力的顏色。
    _goldenRatioColor: function (saturation, value) {
        this._goldenRatio = 0.618033988749895
        this._hue = this._hue || Math.random()
        this._hue += this._goldenRatio
        this._hue %= 1

        if (typeof saturation !== "number") saturation = 0.5;
        if (typeof value !== "number") value = 0.95;

        return [
            this._hue * 360,
            saturation * 100,
            value * 100
        ]
    }
}