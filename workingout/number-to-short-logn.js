const alphabet = 'abc defghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'//-._$~`
const l = alphabet.length


function findsizes(options, maxcharlength) {
  // return length of number of combinations
  var arr = [options]
  var i = 1
  while(i < maxcharlength) {
    i++
    arr.push( Math.pow(options, i)+arr[arr.length-1] )
  }
  return arr
}

var scale = findsizes(l, 50)

function n2shortLogn(n) {
  console.time('n2shortlogn')
  var ans = []
  // 1. simple return
  if (n <= l) {
    ans.push(n)
    return ans
  }
  // lvl denotes the str length
  var lvl_count = 0
  var cond = true
  while (cond) {
    cond = n > scale[lvl_count] && n <= scale[lvl_count+1]
    cond = !cond
    if (lvl_count === scale.length-2) {cond = false}
    lvl_count++
  }
  console.log('lvl_count', lvl_count)
  const exclude_num = scale[lvl_count-1]
  // 2. two chars
  var dividor = scale[lvl_count] - scale[lvl_count-1]
  console.log('n', n)
  console.log('dividor', dividor)
  console.log('exclude_num', exclude_num)

  var temp1 = (n - exclude_num)
  var temp2 = temp1 / dividor
  var temp3 = Math.ceil(temp2 * l)
  ans.push(temp3)
  while (lvl_count !== 1){
    lvl_count--
    dividor = scale[lvl_count] - scale[lvl_count-1]
    var ntemp0 = ans[ans.length-1]
    var ntemp1 = temp1 - (dividor * (ntemp0-1))
    var ntemp2 = ntemp1 / dividor
    var ntemp3 = Math.ceil(ntemp2 * l) % l
    if (ntemp3 === 0) {ntemp3 = l}
    console.log(lvl_count, ntemp3)
    ans.push(ntemp3)
  }
  if (lvl_count === 1) {
    var temp4 = temp1 - l*(temp3-1)
    temp4 = temp4 % l
    if (temp4 === 0) {temp4 = l}
    ans.push(temp4)
  }
  console.timeEnd('n2shortlogn')
  return ans
}

function inverseStrToN(arr){
  return arr.reverse().reduce(function(ans, n, i){
    ans += n*Math.pow(l,i)
    return ans
  }, 0)
}




function remainder(n, dividor) {
  var count = 0
  while (n >= dividor) {
    count++
    n -= dividor
  }
  return {
    answer: count,
    r: Math.abs(n) // remainder
  }
}
