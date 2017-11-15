/**
 * 凯撒矩阵变化
 * Created by Yun on 2017/3/31.
 */
var KSCode = {
  /**
   * 编码
   */
  code: function(src) {
    var buffer = []
    var row = Math.floor(
      2 + Math.random() * (src.length - 2 > 8 ? 8 : src.length - 2)
    )
    // console.log(row)
    var pos = src.length % row //最后一列的行数
    var col = pos == 0 ? src.length / row : src.length / row + 1 //计算列数
    buffer[0] = row
    var bPos = 1
    for (var r = 0; r < row; r++) {
      //矩阵变换
      for (
        var c = 0;
        (c < col && pos == 0) ||
        (c < col && r < pos) ||
        (c < col - 1 && r >= pos);
        c++
      ) {
        buffer[bPos++] = src.charAt(c * row + r)
      }
    }
    return buffer.join('')
  },
  /**
   * 解码
   */
  deCode: function(coded) {
    var buffer = []
    var row = parseInt(coded.substring(0, 1))
    coded = coded.substring(1)
    var pos = coded.length % row //最后一列的行数
    var col = parseInt(pos == 0 ? coded.length / row : coded.length / row + 1) //计算列数
    var bPos = 0
    for (var r = 0; r < row; r++) {
      //举证变换
      for (
        var c = 0;
        (c < col && pos == 0) ||
        (c < col && r < pos) ||
        (c < col - 1 && r >= pos);
        c++
      ) {
        buffer[c * row + r] = coded.charAt(bPos++)
      }
    }
    return buffer.join('') 
  },
  /**
   * 对对象参数进行加密
   */
  codeObject: function(object) {
    return this.code(encodeURIComponent(JSON.stringify(object)))
  },
  /**
   * 对加密对象对象进行解密
   */
  deCodeObject: function(object) {
    return JSON.parse(decodeURIComponent(this.deCode(object)))
  }
}

module.exports = KSCode
