/**
 * 手机号码归属地查询
 * 
 * 使用的库：
 * request: https://github.com/request/request
 * iconv-lite: https://github.com/ashtuchkin/iconv-lite
 * line-by-line: https://github.com/Osterjour/line-by-line
 * line-reader(备选): https://github.com/nickewing/line-reader
 * 
 * 查询API 地址如下：
 * http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=13800138000
 * http://chongzhi.jd.com/json/order/search_searchPhone.action?mobile=13810088888
 * http://life.yhd.com/mobile/findMobileInfo.do?jsonpCallback=jsonp1432469203786&mobileNum=13810017175&chargePrice=100&source=1
 * http://api.k780.com:88/?app=phone.get&phone=13800138000&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json
 * 
 */

let request = require('request')
let iconv = require('iconv-lite')
let LineByLineReader = require('line-by-line')

let arr = []

// 查询
let query = (phoneNumber) => {
	request({
		url: `http://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=${phoneNumber}`,
		encoding : null,	// 直接输出 Buffer
		gzip: true
	}, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			try {
				let obj =  eval(iconv.decode(body, 'gb2312'))
				console.log(`${obj.telString} --- ${obj.catName} --- ${obj.carrier}`)
			} catch (e) {
				console.log(e)
			}
		}
	})
}

let lr = new LineByLineReader('phone.txt', {
	encoding: 'utf8',
	skipEmptyLines: false
})
lr.on('line', (line) => {
	arr.push(line)
})
lr.on('end', () => {
	// 输出测试
	arr.forEach(element => {
		query(element)
	}, this)
})



