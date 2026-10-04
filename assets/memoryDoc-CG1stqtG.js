var s="## What Blaine learned";function l(n){const t=n.indexOf(s);return t===-1?[n,""]:[n.slice(0,t),n.slice(t+22)]}function u(n,t){return`${n.trimEnd()}${n.trim()?`

`:""}${s}${t}`}function a(n,t,r){const[e,i]=l(n);if(t==="notes")return(r+(i?`

${s}${i}`:"")).trim()+`
`;const o=i.split(`
`),c=Number(t.slice(1));return o[c]=`- ${r}${(o[c]??"").match(/ \(source: [^)]*\)$/)?.[0]??""}`,u(e,o.join(`
`))}function $(n,t){const[r,e]=l(n);if(t==="notes")return e?`${s}${e}`:"";const i=e.split(`
`);return i.splice(Number(t.slice(1)),1),u(r,i.join(`
`))}export{$ as n,a as t};
