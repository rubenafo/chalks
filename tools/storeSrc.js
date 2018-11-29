#!/usr/bin/nodejs

var png = require('png-metadata');
let fs = require ("fs")

function usage() {
  console.log("Usage: storeSrc.js src_file image.png")
  console.log("       storeSrc.js view image.png")
  process.exit()
}

if (process.argv.length != 4) {
  usage()
}
if (!process.argv[3].endsWith(".png"))
  usage()

else {
  if (process.argv[2] == "view") {
    var s = png.readFileSync(process.argv[3])
    var list = png.splitChunk(s)
    let srcData = list[list.length-2]
    if (srcData && srcData.type === "aaAa")
      console.log(srcData.data)
    else {
      console.log(process.argv[3] + " does not contain src data")
    }
  }
  else {
    let content = fs.readFileSync(process.argv[2])
    console.log ("Src file: " + content.length + " bytes")
    var s = png.readFileSync(process.argv[3])
    var list = png.splitChunk(s)
    var iend = list.pop() // remove IEND
    var newchunk = png.createChunk("aaAa", content)
    list.push(newchunk)
    list.push(iend)
    var newpng = png.joinChunk(list)
    fs.writeFileSync(process.argv[3], newpng, 'binary')
    console.log("Data successfully appended to " + process.argv[3])
  }
}
