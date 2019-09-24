/*
    ## Name

    [Beyond the Top 1000 Names](http://www.ssa.gov/oact/babynames/limits.html)
*/
module.exports = {
	// 隨機生成一個常見的英文名。
	first: function () {
		var names = [
			// male
			"James", "John", "Robert", "Michael", "William",
			"David", "Richard", "Charles", "Joseph", "Thomas",
			"Christopher", "Daniel", "Paul", "Mark", "Donald",
			"George", "Kenneth", "Steven", "Edward", "Brian",
			"Ronald", "Anthony", "Kevin", "Jason", "Matthew",
			"Gary", "Timothy", "Jose", "Larry", "Jeffrey",
			"Frank", "Scott", "Eric"
		].concat([
			// female
			"Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
			"Jennifer", "Maria", "Susan", "Margaret", "Dorothy",
			"Lisa", "Nancy", "Karen", "Betty", "Helen",
			"Sandra", "Donna", "Carol", "Ruth", "Sharon",
			"Michelle", "Laura", "Sarah", "Kimberly", "Deborah",
			"Jessica", "Shirley", "Cynthia", "Angela", "Melissa",
			"Brenda", "Amy", "Anna"
		])
		return this.pick(names)
		// or this.capitalize(this.word())
	},
	// 隨機生成一個常見的英文姓。
	last: function () {
		var names = [
			"Smith", "Johnson", "Williams", "Brown", "Jones",
			"Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
			"Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
			"Moore", "Martin", "Jackson", "Thompson", "White",
			"Lopez", "Lee", "Gonzalez", "Harris", "Clark",
			"Lewis", "Robinson", "Walker", "Perez", "Hall",
			"Young", "Allen"
		]
		return this.pick(names)
		// or this.capitalize(this.word())
	},
	// 隨機生成一個常見的英文姓名。
	name: function (middle) {
		return this.first() + ' ' +
			(middle ? this.first() + ' ' : '') +
			this.last()
	},
	/*
	    隨機生成一個常見的中文姓。
	    [世界常用姓氏排行](http://baike.baidu.com/view/1719115.htm)
	    [玄派網 - 網絡小說創作輔助平台](http://xuanpai.sinaapp.com/)
	 */
	cfirst: function () {
		var names = (
			'王 李 張 劉 陳 楊 趙 黃 周 吳 ' +
			'徐 孫 胡 朱 高 林 何 郭 馬 羅 ' +
			'梁 宋 鄭 謝 韓 唐 馮 於 董 蕭 ' +
			'程 曹 袁 鄧 許 傅 沈 曾 彭 呂 ' +
			'蘇 盧 蔣 蔡 賈 丁 魏 薛 葉 閻 ' +
			'余 潘 杜 戴 夏 鍾 汪 田 任 姜 ' +
			'範 方 石 姚 譚 廖 鄒 熊 金 陸 ' +
			'郝 孔 白 崔 康 毛 邱 秦 江 史 ' +
			'顧 侯 邵 孟 龍 萬 段 雷 錢 湯 ' +
			'尹 黎 易 常 武 喬 賀 賴 龔 文'
		).split(' ')
		return this.pick(names)
	},
	/*
	    隨機生成一個常見的中文名。
	    [中國最常見名字前50名_三九算命網](http://www.name999.net/xingming/xingshi/20131004/48.html)
	 */
	clast: function () {
		var names = (
			'家豪 淑芬 承恩 秀英 宥廷 詠晴 俊傑 強 磊 建宏 ' +
			'俊宏 志強 美玲 喬 娟 雅婷 美惠 超 秀蘭 霞 ' +
			'羽 怡君 麗華 語彤 柏翰 欣妤 品睿 品妍 思妤 宇翔'
		).split(' ')
		return this.pick(names)
	},
	// 隨機生成一個常見的中文姓名。
	cname: function () {
		return this.cfirst() + this.clast()
	}
}