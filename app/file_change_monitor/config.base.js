module.exports = {
  target: 'D:/FileTest', // 这里填写的是要监视的路径
  redis: {
    host: 'localhost',  // 数据库地址
    port: 6379, // 数据库端口
    key: 'file' // Key名称
    // password: '',  // 连接密码
    // db: 0  // 数据库
  },
  //邮件配置
  email: {
    service: '', // 邮箱类型 https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    user: '', // 邮箱地址
    pass: '', // 邮箱密码
    from: '', // 发送的邮箱
    to: '', // 目标邮箱，支持多个
    subject: '' // 邮件标题
  },
  task: {
    updateType: 1, // 监视的类型，0，定时监视 1：文件更改后定时发送
    interval: 0.5 * 60 * 1000 // 时间
  },
  ignore: [/\.DS_Store/, /Thumbs.db/] // 忽略列表
}
