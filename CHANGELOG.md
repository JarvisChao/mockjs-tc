# Changelog

## 2015.12.03 V0.2.0-alpha2

1. 改用 webpack 打包

### 2014.3.20 V0.2.0-alpha1

1. 增加網站

### 2014.12.23 V0.2.0 重構代碼

1. 改用 gulp 打包
2. 改用 mocha 重寫測試用例
3. 改用 requirejs 重構代碼

### 2014.6.24 V0.2.0 重構代碼

1. 支持 UMD，包括：
    * 未打包前的代碼
    * 打包後的代碼
2. random CLI
    * --help 增加方法和參數說明
3. 重構文檔站 @蘿素
    * 增加《入門》
    * 單列《文檔》
4. 測試用例
    * 重寫測試用例
    * 同時支持 nodeunit 和 qunit
    * 同時支持 jQuery、KISSY、Zepto
    * 同時支持 KMD、AMD、CMD
5. 覆寫 XHR @行列 @霍庸
6. 廢棄的功能
    * Mock.mockjax()
    * Mock.tpl()
    * Mock.xtpl()
7. Random.dateImage() 支持 node-canvas
8. Mock.valid(tpl, data)
9. Mock.toJOSNSchema()
10. Mock.mock(regexp) 
11. 完善地支持 node，代碼中的：
    * window
    * document
    * XHRHttpRequest
12. 支持相對路徑

### 2014.6.23 V0.1.5

1. [!] 修覆 #28 #29，因為 jQuery 每個版本在 Ajax 實現上有些差異，導致在攔截 Ajax 請求時出現了兼容性問題（例如，方法 `xhr.onload()` 訪問不到）。本次[測試](http://jsfiddle.net/8y8Fz/)並通過的 jQuery 版本有：

    * jQuery 2.1.0
    * jQuery 2.0.2
    * jQuery 1.11.0
    * jQuery 1.10.1
    * jQuery 1.9.1
    * jQuery 1.8.3
    * jQuery 1.7.2
    * jQuery 1.6.4

非常抱歉，這個問題一直困擾著 Mock.js 用戶，在後面的版本中，會通過攔截 XMLHttpRequest 的方法“一勞永逸”地解決攔截 Ajax 的兼容和適配問題。

### 2014.6.18 V0.1.4

1. [!] 修覆 #14 0.1.1版本試了好像jq1.10可以，1.11下$.ajax攔截沒反應
2. [!] 修覆 #22 異步加載js文件的時候發現問題
3. [!] 修覆 #23 Mock.mockjax 導致 $.getScript 不執行回調
4. [!] 修覆 #24 Window Firefox 30.0 引用 占位符 拋錯
5. [!] 修覆 #25 改變了非函數屬性的順序，查找起來不方便
6. [!] 修覆 #26 生成規則 支持 負數 number|-100-+100
7. [!] 修覆 #27 數據模板編輯器 格式化（Tidy） 時會丟掉 函數屬性
8. [+] 數據模板編輯器 增加了 編輯區 和 生成結果區 的同步滾動
9. [!] test/nodeuinit > test/nodeunit

### 2014.5.26 V0.1.3

1. [!] 修覆 #21

### 2014.5.26 V0.1.2

1. [!] 重構 Mock.mockjax()
2. [!] 更新 package.json/devDependencies
3. [+] 增加 懶懶交流會 PPT

### 2014.5.9 V0.1.2
1. [+] 支持 [`Mock.mock(rurl, rtype, template)`](http://mockjs.com/#mock)
2. [+] 支持 [`'name|min-max': {}`、`'name|count': {}`](http://mockjs.com/#語法規範)
3. [+] 支持 [`'name': function(){}`](http://mockjs.com/#語法規範)
4. [+] 新增占位符 [@NOW](http://mockjs.com/#now)
5. [+] 更新了 [語法規範](http://mockjs.com/#語法規範)

### 2013.9.6
1. 增加占位符 @DATAIMAGE
2. 解析占位符時**完全**忽略大小寫

### 2013.9.3
1. 文檔增加用法示例：Sea.js (CMD)、RequireJS (AMD)
2. 增加對 CMD 規範的支持
3. 生成 SourceMap 文件 `dist/mock-min.map`

### 2013.8.21
1. 100% 基於客戶端模板生成模擬數據，支持 KISSY XTemplate。
1. 調整文件結構。

### 2013.8.11
1. 80% 基於客戶端模板生成模擬數據。
1. 完善針對 KISSY XTemplate 的測試用例 [test/mock4tpl-xtpl-node.js](test/mock4tpl-xtpl-node.js)。
1. [Mock4Tpl](src/tpl/mock4tpl.js) 支持 Partials。
1. Mock 支持轉義 @。
1. 更新 README.md，增加對 Mock4Tpl 的說明。
1. 完善 [demo](demo/)。
1. 減少 Mock、Mock4Tpl 暴漏的 API。

### 2013.8.7
1. 75% 基於客戶端模板生成模擬數據。
1. 完善測試用例 [test/mock4tpl-node.js](test/mock4tpl-node.js)。
1. 重構文件和目錄結構，把代碼模塊化。
1. 參考 Handlebars.js，引入 Jison 生成模板解析器。

#### 2013.8.2
1. 60% 基於客戶端模板生成模擬數據。
1. 增加測試用例 [test/mock4tpl-node.js](test/mock4tpl-node.js)，參考自 <http://handlebarsjs.com/>。

#### 2013.7.31
1. 50% 基於客戶端模板生成模擬數據。

#### 2013.7.18
1. 增加占位符 @COLOR。
1. 完善對占位符的解析，過濾掉 `#%&()?/.`。
1. 對“支持的占位符”分組。

#### 2013.7.12
1. Mock.mock(rurl, template) 的參數 rurl 可以是字符串或正則。
1. 把產生隨機元數據的接口封裝到 Mock.Random 中。
1. 增加對日期的格式化。
1. 增加占位符 @IMG、@PARAGRAPH、@SENTENCE、@WORD、@FIRST、@LAST、@NAME、@DOMAIN、@EMAIL、@IP、@ID。
1. 支持嵌套的占位符，例如 `@IMG(@AD_SIZE)`。
1. 支持把普通屬性當作占位符使用，例如 `@IMG(@size)`。