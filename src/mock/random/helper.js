/*
    ## Helpers
*/

var Util = require('../util')

module.exports = {
	// 把字符串的第一個字母轉換為大寫。
	capitalize: function (word) {
		return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
	},
	// 把字符串轉換為大寫。
	upper: function (str) {
		return (str + '').toUpperCase()
	},
	// 把字符串轉換為小寫。
	lower: function (str) {
		return (str + '').toLowerCase()
	},
	// 從數組中隨機選取一個元素，並返回。
	pick: function pick(arr, min, max) {
		// pick( item1, item2 ... )
		if (!Util.isArray(arr)) {
			arr = [].slice.call(arguments)
			min = 1
			max = 1
		} else {
			// pick( [ item1, item2 ... ] )
			if (min === undefined) min = 1

			// pick( [ item1, item2 ... ], count )
			if (max === undefined) max = min
		}

		if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)]

		// pick( [ item1, item2 ... ], min, max )
		return this.shuffle(arr, min, max)

		// 通過參數個數判斷方法簽名，擴展性太差！#90
		// switch (arguments.length) {
		// 	case 1:
		// 		// pick( [ item1, item2 ... ] )
		// 		return arr[this.natural(0, arr.length - 1)]
		// 	case 2:
		// 		// pick( [ item1, item2 ... ], count )
		// 		max = min
		// 			/* falls through */
		// 	case 3:
		// 		// pick( [ item1, item2 ... ], min, max )
		// 		return this.shuffle(arr, min, max)
		// }
	},
	/*
	    打亂數組中元素的順序，並返回。
	    Given an array, scramble the order and return it.

	    其他的實現思路：
	        // https://code.google.com/p/jslibs/wiki/JavascriptTips
	        result = result.sort(function() {
	            return Math.random() - 0.5
	        })
	*/
	shuffle: function shuffle(arr, min, max) {
		arr = arr || []
		var old = arr.slice(0),
			result = [],
			index = 0,
			length = old.length;
		for (var i = 0; i < length; i++) {
			index = this.natural(0, old.length - 1)
			result.push(old[index])
			old.splice(index, 1)
		}
		switch (arguments.length) {
			case 0:
			case 1:
				return result
			case 2:
				max = min
			/* falls through */
			case 3:
				min = parseInt(min, 10)
				max = parseInt(max, 10)
				return result.slice(0, this.natural(min, max))
		}
	},
	/*
	    * Random.order(item, item)
	    * Random.order([item, item ...])

	    順序獲取數組中的元素

	    [JSON導入數組支持數組數據錄入](https://github.com/thx/RAP/issues/22)

	    不支持單獨調用！
	*/
	order: function order(array) {
		order.cache = order.cache || {}

		if (arguments.length > 1) array = [].slice.call(arguments, 0)

		// options.context.path/templatePath
		var options = order.options
		var templatePath = options.context.templatePath.join('.')

		var cache = (
			order.cache[templatePath] = order.cache[templatePath] || {
				index: 0,
				array: array
			}
		)

		return cache.array[cache.index++ % cache.array.length]
	}
}