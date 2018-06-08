var jsonfile = require('jsonfile')
var file = './token.json'
jsonfile.readFile(file, function(err, obj) {
  console.dir(obj.token)
})
var obj = {token: 'JPpp'}

jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
})

jsonfile.readFile(file, function(err, obj) {
  console.dir(obj.token)
})