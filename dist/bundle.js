(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../url-validation":5,"./lib/copy.js":2,"./lib/postJSON":3,"./lib/wait.js":4}],2:[function(require,module,exports){
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

module.exports = copyTextToClipboard

},{}],3:[function(require,module,exports){
module.exports = function postJSON({url, data, progresscb, cb, cookies}) {
  var req = new XMLHttpRequest()
  req.onreadystatechange = function(e) {
    if (req.readyState === 4) {
      if (typeof cb === 'function')
        cb(req.response)
    }
  }
  if (typeof progresscb === 'function')
    req.upload.addEventListener('progress', progresscb)
  // function(e){
  //   $progress.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
  // }, false);
  req.withCredentials = Boolean(cookies)
  req.open('POST', url, true)
  req.setRequestHeader('Content-Type', 'application/json')
  if (typeof data !== 'string') {
    data = JSON.stringify(data)
  }
  req.responseType = 'json'
  req.send(data)
}

},{}],4:[function(require,module,exports){
function wait(ms) {
  return new Promise(function(resolve){
    setTimeout(resolve,ms)
  })
}
module.exports = wait

},{}],5:[function(require,module,exports){
module.exports = function(url) {
  if (url === '' || typeof url !== 'string') {
    return false
  }
  // regex from http://stackoverflow.com/questions/1303872/trying-to-validate-url-using-javascript
  var rg = /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/;
  return rg.test(url)
}

},{}]},{},[1]);
