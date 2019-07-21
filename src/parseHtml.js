function parseHtml (html) {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      if (html.match(endTag)) {
        // ...process end tag
        continue
      }
      if (html.match(startTagOpen)) {
        // ...process start tag
        continue
      }
    } else {
      // ...process text
      continue
    }
  }
}

export default parseHtml
export {
  parseHtml
}