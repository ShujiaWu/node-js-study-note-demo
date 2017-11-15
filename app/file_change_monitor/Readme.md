# 文件变化监测

监测文件变化，并发邮件通知用户

* 支持定时发送和监测到变化延迟发送两种方式
* 数据暂存在Redis中

## 使用说明

复制 `config.base.js` 为 `config.js`, 根据实际修改配置。

```js
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
    service: '', // 邮箱类型
    user: '', // 邮箱地址
    pass: '', // 邮箱密码
    from: '', // 发送的邮箱
    to: '', // 目标邮箱，支持多个
    subject: '' //邮件标题
  },
  task: {
    updateType: 1, // 监视的类型，0，定时监视 1：文件更改后定时发送
    interval: 0.5 * 60 * 1000 // 时间
  },
  ignore: [/\.DS_Store/, /Thumbs.db/] // 忽略列表
}
```