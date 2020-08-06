const express = require('express')
// const bodyParser = require('body-parser')
const { httpServerHost, httpServerPort } = require('../config.js')
// const multer = require('multer')
// const upload = multer()

const app = express()
const successResponse = { code: 200, msg: '已接收命令' }
// const failResResponse = { code: 400, msg: '异常' }

// app.use(bodyParser.json()) // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 处理跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')// 允许任意头部信息
  res.header('Access-Control-Request-Method', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  // 记录所有请求
  // console.info(req.method, req.originalUrl)
  next()
})

// app.options('*', (req, res) => {
//   res.send({ ...successResponse, msg: '所有options通过' })
// })

// 获取打印机信息
app.get('/test', (req, res) => {
  // 打印机名称，可选择的配置列表
  res.send({ ...successResponse })
})

/**
 * 启动HTTP服务器
 *
 */
function init () {
  return app.listen(httpServerPort, httpServerHost, () => {
    console.log(`http server listening on port ${httpServerPort}`)
  }).on('error', (err) => {
    console.error(err)
  })
  // exit
  // var server = app.listen('http://localhost:5000/');
  // server.close();
}
export default {
  init: init
}

//  使用nedb保存数据

// var Datastore = require('nedb')
// const db = new Datastore({ filename: 'dataDB', autoload: true })

// var doc = { hello: 'world',
//   n: 5,
//   today: new Date(),
//   nedbIsAwesome: true,
//   notthere: null,
//   notToBeSaved: undefined, // Will not be saved
//   fruits: [ 'apple', 'orange', 'pear' ],
//   infos: { name: 'nedb' }
// }

// db.insert(doc, function (err, newDoc) { // Callback is optional
//   console.log(err, newDoc)
//   // newDoc is the newly inserted document, including its _id
//   // newDoc has no key called notToBeSaved since its value was undefined
// })

// db.find({ hello: 'world' }, function (err, docs) {
//   console.log('find:', err, docs)
//   // docs is an array containing documents Mars, Earth, Jupiter
//   // If no document is found, docs is equal to []
// })
