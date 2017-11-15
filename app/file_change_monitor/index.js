const chokidar = require('chokidar')
const redis = require('redis')
const config = require('./config')
const nodemailer = require('nodemailer')
const _ = require('lodash')
const datetime = require('../utils/datetime')

let client = redis.createClient(config.redis.port, config.redis.host, {
  password: config.redis.password,
  db: config.redis.db
})

client.on('ready', () => {
  console.log(`${getDatetime()}\tRedis连接成功：${config.redis.host}:${config.redis.port}`)
})

const transporter = nodemailer.createTransport({
  //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
  service: config.email.service,
  port: 465, // SMTP 端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: config.email.user,
    //这里密码不是qq密码，是你设置的smtp密码
    pass: config.email.pass
  }
})

let watcher = chokidar.watch(config.target, {
  ignored: config.ignore
})

// 准备工作是否完成
let isReadyForWatch = false
const fileType = {
  file: 1,
  dir: 2
}
const operationType = {
  add: 1,
  delete: 2,
  change: 3
}

watcher
  .on('ready', () => {
    isReadyForWatch = true
    console.log(`${getDatetime()}\t初始化完成，开始文件监听`)
  })
  // 文件
  .on('add', path => {
    if (isReadyForWatch) {
      console.log(`${getDatetime()}\t【添加】【文件】${path}`)
      saveToRedis(fileType['file'], operationType['add'], path)
    }
  })
  .on('change', path => {
    if (isReadyForWatch) {
      console.log(`${getDatetime()}\t【修改】【文件】${path}`)
      saveToRedis(fileType['file'], operationType['change'], path)
    }
  })
  .on('unlink', path => {
    if (isReadyForWatch) {
      console.log(`${getDatetime()}\t【删除】【文件】${path}`)
      saveToRedis(fileType['file'], operationType['delete'], path)
    }
  })
  // 文件夹
  .on('addDir', path => {
    if (isReadyForWatch) {
      console.log(`${getDatetime()}\t【添加】【目录】${path}`)
      saveToRedis(fileType['dir'], operationType['add'], path)
    }
  })
  .on('unlinkDir', path => {
    if (isReadyForWatch) {
      console.log(`${getDatetime()}\t【删除】【目录】${path}`)
      saveToRedis(fileType['dir'], operationType['delete'], path)
    }
  })
  .on('error', error => {
    console.log(`${getDatetime()}\t【错误】${error}`)
  })

/**
   * 添加到Redis数据库
   * @param { Number } type 文件类型
   * @param { Number } operation 操作类型
   * @param { String } path 路径
   */
function saveToRedis(type, operation, path) {
  let obj = {
    type: type,
    operation: operation,
    path: path,
    datetime: getDatetime()
  }
  client.rpush(config.redis.key, JSON.stringify(obj))
  // 延迟模式
  if (config.task.updateType == 1) {
    task()
  }
}

/**
 * 发送邮件
 */
function sendMail(mailHtml) {
  var mailOptions = {
    from: config.email.from, // 发件地址
    to: config.email.to, // 收件列表
    subject: config.email.subject, // 标题
    //text和html两者只支持一种
    html: mailHtml // html 内容
  }
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(info)
      console.log(error)
    } else {
      console.log(`${getDatetime()}\t邮件发送成功`)
    }
  })
}

/**
 * 获取当前时间
 */
function getDatetime() {
  return datetime(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

// 不同的任务类型
if (config.task.updateType == 1) {
  console.log(`${getDatetime()}\t当前模式为：文件更改后定时发送`)
  var task = _.debounce(sendTask, config.task.interval)
}
//定时任务
if (config.task.updateType == 0) {
  console.log(`${getDatetime()}\t当前模式为：定时监视`)
  setInterval(function () {
    console.log(`${getDatetime()}\t启动定时任务`)
    sendTask()
  }, config.task.interval)
}

/**
 * 运行任务
 */
function sendTask() {
  client.llen(config.redis.key, (error, result) => {
    if (!error && result > 0) {
      //没有错误并且有值
      client.lrange(config.redis.key, 0, -1, (error, result) => {
        if (!error) {
          // 移除并发送邮件
          client.ltrim(config.redis.key,result.length, -1, (error) => {
            if (!error) {
              sendMail(getMailHtml(result))
            }
          })
        }
      })
    }
  })
}

/**
 * 生成邮件的html
 * @param {Array} result 改变了的文件列表
 */
function getMailHtml(result) {
  let html = ''
  result.forEach(element => {
    let file = JSON.parse(element)
    let type
    let color
    let operation
    switch (file.type) {
    case fileType['file']:
      type = '文件'
      break
    case fileType['dir']:
      type = '文件夹'
      break
    }
    switch (file.operation) {
    case operationType['add']:
      color = 'green'
      operation = '添加'
      break
    case operationType['delete']:
      color = 'red'
      operation = '删除'
      break
    case operationType['change']:
      color = 'orange'
      operation = '修改'
      break
    }
    html += `<p style="color:${color}">${file.datetime} ${operation} ${type} ${file.path}</p>`
  })
  return html
}
