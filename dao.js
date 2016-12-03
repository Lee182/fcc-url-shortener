const n2s = require('./number2str.js')
const url_validation = require('./url-validation.js')

const Mongo = require('mongodb')
let MongoClient = Mongo.MongoClient
console.log(process.env.MONGOURL)
let mongourl = process.env.MONGOURL || require('./keys.js').mongourl
let o = {}
o.ObjectId = Mongo.ObjectId
let count = 0

MongoClient.connect(mongourl).then(function(db){
  console.log('mongo connected') // setup db
  o.db = db
  // setup count
  o.resetCount()
}).catch(function(err){
  console.log('mongo connection error:', err)
  o.db = null
})
function ensureConnected(fn) {return function() {
  if (o.db === null) {return Promise.reject('db disconnected')}
  return fn.apply(o, arguments)
}}

o.resetCount = ensureConnected(function() {
  return o.db.collection('urls')
    .findOne({}, {sort: {creationDate:-1} })
    .then(function(result){
      if (result === null){ return 0 }
      console.log('reset', result)
      return count = n2s.reverse(result._id)
    })
})

o.insert_url = ensureConnected(function(url, date){
  // Schema
  //   _id: n2s.forward(count++)
  //   creationDate: date
  //   url: 'http://google.com'
  if (url_validation(url) === false) {
    return Promise.reject('invalid url')
  }
  count++
  var insert = {
    _id: n2s.forward(count),
    creationDate: date,
    url
  }
  return o.db.collection('urls')
    .insertOne(insert)
    .then(function(result){
      return Promise.resolve(insert)
    })
    .catch(function(err){
      count--
      if (err.code === 1100) {
        return resetCount().then(function(){
          return o.insert_url(url, date)
        })
      }
      return Promise.reject(err)
    })
})

o.insert_url_borrow = ensureConnected(function(url, date){
  return o.db.collection('urls')
    .findOne({url})
    .then(function(result){
      if (result === null) {
        return o.insert_url(url,date)
      }
      return result
    })
})

o.remove_url = ensureConnected(function(_id){
  return o.db.collection('urls')
    .remove({_id})
})

o.find_short = ensureConnected(function(short){
  return o.db.collection('urls')
    .findOne({_id: short})
})

module.exports = o
