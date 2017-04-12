export function b64ToBlob (b64image) {
  var byteCharacters = atob(b64image.split(',')[1])
  var byteArrays = []

  for (var offset = 0; offset < byteCharacters.length; offset += 512) {
    var slice = byteCharacters.slice(offset, offset + 512)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }
  var blob = new Blob(byteArrays, {type: 'application/octet-stream'})
  return blob
}
