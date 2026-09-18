const s="## What Blaine learned";function u(n){const t=n.indexOf(s);return t===-1?[n,""]:[n.slice(0,t),n.slice(t+s.length)]}function a(n,t){return`${n.trimEnd()}${n.trim()?`

`:""}${s}${t}`}function f(n,t,r){var l;const[i,e]=u(n);if(t==="notes")return(r+(e?`

${s}${e}`:"")).trim()+`
`;const c=e.split(`
`),o=Number(t.slice(1)),$=((l=(c[o]??"").match(/ \(source: [^)]*\)$/))==null?void 0:l[0])??"";return c[o]=`- ${r}${$}`,a(i,c.join(`
`))}function m(n,t){const[r,i]=u(n);if(t==="notes")return i?`${s}${i}`:"";const e=i.split(`
`);return e.splice(Number(t.slice(1)),1),a(r,e.join(`
`))}export{f as e,m as r};
