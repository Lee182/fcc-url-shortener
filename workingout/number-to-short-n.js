const alphabet = 'abc'// defghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'//-._$~`
const l = alphabet.length

function n2short(n) {
  console.time('nshort')
  if (n <= 0) {n = 1}
  let a = [0]
  while(n !== 0){
    // increment letters
    a = increment(a, l)
    n--
  }
  console.log(a)
  console.timeEnd('nshort')
  return translate2Letters(a)
}
function increment(arr, options) {
  var l = arr.length
  arr.reduceRight(function(prev, cur, i){
    if (i === l-1){
      arr[i]++
    }
    if (i !== 0 && arr[i] === options+1) {
      arr[i] = 1
      arr[i-1]++
    }
    if (i === 0 && arr[i] === options+1){
      arr[i] = 1
      arr.push(1)
    }
    return cur
  },true)
  return arr
}
function translate2Letters(arr) {
  return arr.reduce(function(str,n){
    return str += alphabet[n-1]
  },'')
}


// findlength(3, 10)
// [ 3, 12, 39, 120, 363, 1092, 3279, 9840, 29523, 88572 ]
function findlength(options, maxlength) {
  // return length of number of combinations
  var arr = [options]
  var i = 1
  while(i < maxlength) {
    i++
    arr.push( Math.pow(options, i)+arr[arr.length-1] )
  }
  return arr
}


module.exports = n2short
