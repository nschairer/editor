import lexer from './lexer.js'
const colors = {
    KEYWORD: 'yellow',
    OPERATOR: 'orange',
    COMMENT: 'green',
    USERDEFINED: 'white'
}

export default function parse(input) {
    const tokens = lexer(input)
    let html = ''
    for (let token of tokens) {
        if(token.type === 'RETURN') {
            html += `<span style="color:${colors[token.type]}; display: block;">${token.value}</span>`
            continue
        }

        if(colors[token.type]) {
            html += `<span style="color:${colors[token.type]}">${token.value}</span>`
        } else {
            html += `<span>${token.value}</span>`
        }
    }
    return html
}

let initial = 0;
const editor = document.getElementById('editor')
editor.addEventListener('input', e => {
    e.preventDefault()
    const p = getCaretPosition(editor)
    //const data = getCaretData(editor,getCaretPosition(editor))
    const innertext = editor.innerText
    editor.innerHTML = parse(innertext)
    const data = getCaretData(editor, p)
    setCaretPosition(data)
})


function getCaretPosition(el){
    var caretOffset = 0
    if (typeof window.getSelection !== "undefined") {
      var range = window.getSelection().getRangeAt(0);
      console.log(range)
      var selected = range.toString().length;
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(el);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length - selected;
    }
    console.log(caretOffset)
    return caretOffset;
  }


function textNodes(el) {
    let n, a=[]
    let walk = document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false)
    while(n=walk.nextNode()) {
        a.push(n)
    }
    return a
}

function getCaretData(el, position){
    var node, nodes = textNodes(el);
    console.log(nodes, position)
    for(var n = 0; n < nodes.length; n++) {
      if (position > nodes[n].nodeValue.length && nodes[n+1]) {
        // remove amount from the position, go to next node
        position -= nodes[n].nodeValue.length;
      } else {
        node = nodes[n];
        break;
      }
    }
    // you'll need the node and the position (offset) to set the caret
    return { node: node, position: position, index: n };
  }

  function setCaretPosition(d){
      console.log(d)
      console.log(d.node.data)
    let sel = window.getSelection();
    sel.selectAllChildren(editor)
    let range = document.createRange();
    range.setStart(editor.childNodes[d.index].firstChild, adjust_enter(d.node.data, d.position))
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function adjust_enter(string, p) {
      if(string.match(/\n+/)) {
          return p + 1
      } else {
          return p
      }
  }