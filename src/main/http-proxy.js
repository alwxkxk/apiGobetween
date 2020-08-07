
const httpProxy = require('http-proxy')
const http = require('http')
const connect = require('connect')
const queryString = require('querystring')
const Datastore = require('nedb')
const dataDb = new Datastore({ filename: 'dataDB', autoload: true })
const proxy = httpProxy.createProxyServer({})

proxy.on('proxyReq', function (proxyReq, req, res, options) {
  var contentType = proxyReq.getHeader('Content-Type')
  var bodyData

  if (contentType === 'application/json') {
    bodyData = JSON.stringify(req.body)
  }

  if (contentType === 'application/x-www-form-urlencoded') {
    bodyData = queryString.stringify(req.body)
  }

  if (bodyData) {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
    proxyReq.write(bodyData)
  }
  console.log('proxy req', req.method, req.url, req.headers)
})

proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('proxy res', req.method, req.url, res.statusCode, proxyRes.headers)
})

proxy.on('error', (err) => {
  console.log('error', err)
})

function forwardProxy (req, res, options = {target: 'http://127.0.0.1:6688'}) {
  console.log('forward proxy')
  proxy.web(req, res, options)
}

const app = connect()
  .use(function (req, res) {
    const mock = true
    if (mock) {
      dataDb.findOne({url: req.url}, (err, doc) => {
        if (err) {
          console.error(err)
        }
        console.log('doc', doc)
        if (doc) {
          const headers = {
            ...doc.headers,
            'access-control-allow-origin': '*', // 允许任意头部信息
            'access-control-allow-headers': '*',
            'access-control-request-method': '*',
            'access-control-allow-methods': '*',
            'access-control-allow-credentials': 'true'
          }
          res.writeHead(200, headers)
          res.end(doc.body)
        } else {
          forwardProxy(req, res)
        }
      })
    } else {
      forwardProxy(req, res)
    }
  })

http.createServer(app).listen(3000, function () {
  console.log('proxy listen 3000')
})
