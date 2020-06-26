// through, through2
const { Transform } = require('stream')
const path = require('path')

const log = console.log.bind(console)

/**
 * 是否为驼峰
 * @param { 字符串 } s 
 */
const isCamelCase = (s) => {
    let start = s.slice(0, 1)
    let end = s.slice(s.length - 1)
    let lower = 'qwertyuioplkjhgfdsazxcvbnm'
    let r = false
    let r2 = 0
    if (lower.includes(start) && lower.includes(end)) {
        for (let i = 1; i < s.length - 1; i++) {
            if (lower.toUpperCase().includes(s[i])) {
                r = true
                r2 += 1
                if (lower.includes(s[i+1])) {
                    r2 -= 1
                } else if (lower.toUpperCase().includes(s[i+1])) {
                    r2 += 1

                }
            } else if (!lower.includes(s[i])) {
                r = false
            }
        }
    }
    return r && (r2 === 0)
}

/**
 * 处理驼峰
 * @param { 字符串 } s 
 */
const camelCaseToHyphen = (s) => {
    let upper = 'QWERTYUIOPLKJHGFDSAZXCVBNM'
    let r = ''
    if (!isCamelCase(s)) {
        return s
    } else {
        for(let i = 0; i < s.length; i++) {
            if (upper.includes(s[i])) {
                r = r + `-${s[i].toLowerCase()}`
            } else {
                r = r + s[i]
            }
        }
        return r
    }
}

const parsedDeclarations = (object) => {
    let s = Object.entries(object).map(([k, v]) => {
        let property = camelCaseToHyphen(k)
        return `${property}: ${v}`
    }).join(';\n    ')
        let r = `{
        ${s};
    }`
    return r
}

/**
 * json 转为 css
 * @param {字符串} s 
 */
const jsonToCSS = (s) => {
    let json = JSON.parse(s)
    let entries = Object.entries(json)
    let ruleSet = []
    for (let i = 0; i < entries.length; i++) {
        let [k, v] = entries[i]
        let declarations = parsedDeclarations(v)
        let rule = `${k} ${declarations}`
        ruleSet.push(rule)
    }
    let css = ruleSet.join('\n\n')
    return css
}

const gulpJsonCss = () => {
    let t = new Transform({
        objectMode: true,
        transform: (...args) => {
            let [file, encoding, callback] = args

            // 先读取内容
            let content = jsonToCSS(file.contents.toString('utf8'))
            // 处理内容

            file.contents = Buffer.from(content)
            file.path = 'index.css'
            file.base = path.resolve(file.base, '..')
            let error = null
            return callback(error, file)
        }
    })
    return t
}

module.exports = gulpJsonCss
