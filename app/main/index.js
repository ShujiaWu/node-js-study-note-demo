let KSCode = require('../utils/KSCode')

var result = KSCode.codeParams({
	target: 'userCenter.vipCenter',
	isReplace: true,
	params: {
		noMenu: true
	}
})

console.log(result)