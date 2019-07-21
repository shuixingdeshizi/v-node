
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
// const qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')'
const startTagOpen = new RegExp('^<(' + ncname + ')')
// const startTagClose = /^\s*(\/?)>/
const startTagClose = new RegExp('^>')
const attribute = new RegExp('\\s*([^\\s]+)=\"([^\\s>]+)\"')
const endTag = new RegExp('^<\\/(' + ncname + ')>')

let currentParent
let root

let index = 0
let html = '<div id="box1" class="box"><span class="tips">hello world</span></div>'
const stack = new Stack()
parseHtml()
stack.print()
console.log(html, 'html')

function Stack () {
  let data = []
  this.push = function (item) {
    data.push(item)
  }
  this.print = function () {
    data.forEach(item => {
      console.log(item)
    })
  }
}


function makeAttrsMap (attrs) {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}


function parseStartTag () {
  const start = html.match(startTagOpen)
  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
      start: index
    }
    advance(start[0].length)
    console.log(html)
    let end, attr
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      console.log(end)
      console.log(attr)
      advance(attr[0].length)
      console.log(html)
      match.attrs.push({
        name: attr[1],
        value: attr[2]
      })
    }
    if (end) {
      advance(end[0].length)
      return match
    }
  }
}

function parseEndTag (tagName) {
  let pos
  for (pos = stack.length - 1; pos >= 0; pos--) {
    if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
      break
    }
  }

  if (pos >= 0) {
    stack.length = pos
    currentParent = stack[pos]
  }
}

function parseHtml () {
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      if (html.match(endTag)) {
        debugger
        const endTagMatch = html.match(endTag)
        if (endTagMatch) {
          advance(endTagMatch[0].length)
          parseEndTag(endTagMatch[1])
          continue
        }
      }
      if (html.match(startTagOpen)) {
        debugger
        const startTagMatch = parseStartTag()
        const element = {
          type: 1,
          tag: startTagMatch.tagName,
          lowerCasedTag: startTagMatch.tagName.toLowerCase(),
          attrsList: startTagMatch.attrs,
          attrsMap: makeAttrsMap(startTagMatch.attrs),
          parent: currentParent,
          children: []
        }
        if (!root) {
          root = element
        }
    
        if (currentParent) {
          currentParent.children.push(element)
        }
        stack.push(element)
        currentParent = element
        continue
      } else {
        alert(1)
        break
      }
    } else {
      // ...process text
      text = html.substring(0, textEnd)
      advance(textEnd)
      let expression
      if (expression = parseText(text)) {
        currentParent.children.push({
          type: 2,
          text,
          expression
        })
      } else {
        currentParent.children.push({
          type: 3,
          text
        })
      }
      continue
    }
  }
}

function parseText (text) {
  return text
}

function advance (n) {
  index += n
  html = html.substring(n)
}
