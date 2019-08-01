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
        if(colors[token.type]) {
            html += `<span style="color:${colors[token.type]}">${token.value}</span>`
        } else {
            html += `<span>${token.value}</span>`
        }
    }
    return html
}

const editor = document.getElementById('editor')
editor.addEventListener('input', e => {
    e.preventDefault()
    const innertext = editor.innerText
    editor.innerHTML = parse(innertext)
    const range = window.getSelection()
    range.selectAllChildren(editor)
    range.collapseToEnd()
})