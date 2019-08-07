
//never match globally, want the first match
const tokens_types = [
    //(?!([^\s\(\)\[\]\*-\/]))
    { regex: /^(select|where|is|from|group|by|having|like|and|between|case|when|then|end|else|create|delete|alter|table|insert|into|values|update|while|if|in)(?![\w])/i, type: 'KEYWORD'},
    { regex: /^--(.*)[\n\r]?/, type: 'COMMENT'},
    { regex: /^\/\*((.|\n)*)\*\//, type: 'COMMENT'},
    { regex: /^(\*|=|\+|-|<|>)/, type: 'OPERATOR'},
    { regex: /^\n+/, type: 'RETURN'},
    { regex: /^\s+/, type: 'SPACE'},
    { regex: /^(\(|\))/, type: 'PT'},
    { regex: /^(\[|\])/, type: 'SQBRACKET'},
    { regex: /^([^\s\)\(\[\]]+)/,  type: 'USERDEFINED'},
    
]



export default function lexer(input_string) {
    let temp = input_string
    let tokens = []
    let isMatch = true
    while(temp.length && isMatch) {
        let match;
        for(let t of tokens_types) {
            match = temp.match(t.regex)
            if(match) {
                tokens.push(
                    {
                        type: t.type,
                        value: match[0]
                    }
                )
                temp = temp.substring((match.index+match[0].length))
                break;
            }
        }
        if (match) {
             match = null
             continue
        }
        tokens.push({type: 'NOTTRACKED', value: temp})
        isMatch = false
   }
   console.log(tokens)
   return tokens
}