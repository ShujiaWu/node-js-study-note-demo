module.exports = (value, formater) => {
  if (value === undefined || value === '') {
    return ''
  }
  let dateTime = new Date(value)
  let fullYear = dateTime.getFullYear()
  if (isNaN(fullYear) && /^\d+$/.test(value)) {
    // 时间戳（字符串）
    dateTime = new Date(parseInt(value))
    fullYear = dateTime.getFullYear()
  }
  if (fullYear) {
    let month = dateTime.getMonth() + 1
    month = month < 10 ? '0' + month : month
    let day = dateTime.getDate()
    day = day < 10 ? '0' + day : day
    let hours = dateTime.getHours()
    hours = hours < 10 ? '0' + hours : hours
    let minutes = dateTime.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    let seconds = dateTime.getSeconds()
    seconds = seconds < 10 ? '0' + seconds : seconds
    if (formater) {
      return formater.replace('yyyy', fullYear)
        .replace('MM', month)
        .replace('dd', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
    } else {
      return value
    }
  } else {
    return value
  }
}
