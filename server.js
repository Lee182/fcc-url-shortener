const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dao = require('./dao.js') // data acess object
let port = process.env.PORT || 8080

app.use(bodyParser.json()) // populates 'req.body'

// serve static express files
app.use('/', express.static(__dirname + '/dist'))
// filenames must include a dot '.' so doesn't conflict with alphabet of urls

app.post('/', function(req,res){
  // insert or borrow a short string of url
  let url = req.body.url
  let date = new Date()
  console.log(url, date)
  if (!url) {
    return res.json({err: 'invalid url'})
  }
  dao.insert_url_borrow(url, date)
    .then(function(result){
      return res.json(result)
    })
    .catch(function(err){
      return res.json({err})
    })
})

app.get('/info/:short_url', function(req,res,next){
  let short = req.params.short_url
  dao.find_short(short)
    .then(function(result){
      return res.json(result)
    })
    .catch(function(err){
      return res.status(500).json({err})
    })
})

app.get('*', function(req,res,next){
  let short = req.path.substr(1)
  dao.find_short(short)
    .then(function(result){
      if (result === null) {
        return res.redirect(302, '/')
      }
      return res.redirect(301, result.url)
    })
    .catch(function(err){
      return res.status(500).json({err})
    })
})




app.listen(port, function(){
  console.log('server running at http://l:'+port)
})
