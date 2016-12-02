window.postJSON = require('./lib/postJSON')
window.url_validation = require('../url-validation')

function insert_borrow_url(url, cb) {
  postJSON({
    url: '/',
    data: {url},
    cb: cb
  })
}
$form = document.querySelector('.url_form')
$input = document.querySelector('.url_input')
$input.addEventListener('keypress', function(e){
  setTimeout(function(e){
    var str = $input.value
    var valid = url_validation(str)
    if (str === '') {valid = true}
    if (valid === false){
      $form.classList.remove('valid')
      $form.classList.add('invalid')
    }
    if (valid === true){
      $form.classList.remove('invalid')
      $form.classList.add('valid')
    }
  }, 0)
})

insert_borrow_url('https://www.whatismyreferer.com/',  function(res){
  console.log(res)
})
