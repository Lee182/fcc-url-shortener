window.postJSON = require('./lib/postJSON')
window.url_validation = require('../url-validation')
window.copy = require('./lib/copy.js')
window.wait = require('./lib/wait.js')

function insert_borrow_url(url, cb) {
  if ( url_validation(url) === false ) {
    return null
  }
  postJSON({
    url: '/',
    data: {url},
    cb: cb
  })
}


$app = document.querySelector('#app')
$url_form = document.querySelector('.url_form')
$url_result = document.querySelector('.url_result')
$url_long = document.querySelector('.url_long')
$url_short = document.querySelector('.url_short')
$url_submit = document.querySelector('.url_submit')
$url_copy = document.querySelector('.url_copy')
$url_reset = document.querySelector('.url_reset')

$input = document.querySelector('.url_input')
$input.addEventListener('keypress', function(e){
  setTimeout(function(){
    check_input(e)
  }, 0)
})

function check_input(e){
  var str = $input.value
  var valid = url_validation(str)
  if (e && e.keyCode === 13) {
    ui_post_url()
  }
  if (str === '') {valid = true}
  if (valid === false){
    $url_form.classList.remove('valid')
    $url_form.classList.add('invalid')
  }
  if (valid === true){
    $url_form.classList.remove('invalid')
    $url_form.classList.add('valid')
  }
}

function flash_err() {
  $app.classList.add('err-flash')
  wait(500).then(function(){
    $app.classList.remove('err-flash')
  })
}
function ui_post_url() {
  var a = insert_borrow_url($input.value, function(res){
    console.log('result', res)
    if (res.url === $input.value) {
      $url_short.textContent = document.URL + res._id
      $url_long.textContent = res.url
      switcheroo().then(function(){
        $input.value = ''
      })
    }
  })
  if (a === null) {
    flash_err()
  }
}


function tog_hiddeness($el) {
  if ($el.classList.contains('hide') === false){
    $el.classList.add('hide')
  } else {
    $el.classList.remove('hidden')
    return wait(16).then(function(){
      $el.classList.remove('hide')
    })
  }
  return wait(300).then(function(){
    if ($el.classList.contains('hide')){
      $el.classList.add('hidden')
    }
  })
}
var transition_active = false
function switcheroo(){
  // switches from form to results by fade animation
  if (transition_active) {return Promise.reject()}
  var order = [$url_form, $url_result]
  transition_active = true
  if (order[0].classList.contains('hide') === true) {
    order = order.reverse()
  }
  return tog_hiddeness(order[0]).then(function(){
    return tog_hiddeness(order[1])
  }).then(function(){
    transition_active = false
    return true
  })
}


$url_submit.addEventListener('click', ui_post_url)

$url_copy.addEventListener('click', function(){
  copy($url_short.textContent)
})

$url_reset.addEventListener('click', function(){
  switcheroo()
})


function handlePaste (e) {
  //http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser#6804718
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    // Do whatever with pasteddata
    $input.value = pastedData
    check_input()
}

document.addEventListener('paste', handlePaste)
