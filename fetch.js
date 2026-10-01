fetch('https://vsmov.com/api-document').then(r=>r.text()).then(t=>{console.log([...new Set(t.match(/https?:\/\/[a-zA-Z0-9.\/-]+/g))].join('\n'))})
