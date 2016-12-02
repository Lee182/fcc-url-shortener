window.postJSON = require('./lib/postJSON')
window.url_validation = require('../url-validation')

function insert_borrow_url(url, cb) {
  postJSON({
    url: '/',
    data: {url},
    cb
  })
}

insert_borrow_url('https://www.whatismyreferer.com/',  function(res){
  console.log(res)
})
