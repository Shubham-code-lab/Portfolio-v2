import{j as r,d as t,b as p,e as k,u as y,a as T,c as M,r as C,C as g,N as u,T as f,m as z,H as S}from"./index-Co0rEqmU.js";function L(){return r.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":!0,children:r.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})})}function P({currentLabel:e,onBack:s}){return r.jsxs(R,{children:[r.jsxs(_,{"aria-label":"breadcrumb",children:[r.jsx(h,{onClick:s,children:"Home"}),r.jsx(x,{children:"/"}),r.jsx(h,{onClick:s,children:"Projects"}),r.jsx(x,{children:"/"}),r.jsx(N,{children:e})]}),r.jsx(A,{onClick:s,"aria-label":"Close",children:r.jsx(L,{})})]})}const R=t.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`,_=t.nav`
  display: flex;
  align-items: center;
  gap: 6px;
`,h=t.button`
  ${p};
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({theme:e})=>e.textMuted};
  letter-spacing: 0.01em;
  transition: color 0.15s;
  &:hover { color: ${({theme:e})=>e.text}; }
`,x=t.span`
  font-size: 1.1rem;
  color: ${({theme:e})=>e.textMuted};
  opacity: 0.4;
  user-select: none;
  margin: 0 1px;
`,N=t.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({theme:e})=>e.primary[500]};
  letter-spacing: 0.01em;
  max-width: 20rem;
  ${k};
`,A=t.button`
  ${p};
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  border: 1px solid ${({theme:e})=>e.border};
  background: transparent;
  color: ${({theme:e})=>e.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  svg { width: 1.2rem; height: 1.2rem; fill: currentColor; }

  &:hover {
    background: ${({theme:e})=>e.surfaceElevated};
    border-color: ${({theme:e})=>e.borderStrong};
    color: ${({theme:e})=>e.text};
  }
`,b=36,E=u+b,I=60,O=80,H=e=>{const s=Number(e??0);return Number.isFinite(s)?Math.max(0,Math.min(g.length-1,s)):0};function ee(){const{id:e}=y(),s=T(),{card:j,phase:$,setPhase:l}=M(),v=H(e),n=j??g[v],d=$==="landed",w=C.useCallback(()=>{l("flying-out"),s(-1)},[s,l]);return r.jsxs(B,{children:[r.jsx(D,{$visible:d,children:r.jsx(P,{currentLabel:n.title,onBack:w})}),r.jsxs(F,{$visible:d,children:[r.jsx(W,{children:n.title}),r.jsxs(q,{children:[r.jsx(G,{children:n.status??`★ ${n.rating}`}),r.jsx(U,{children:n.year}),n.tags.map(i=>r.jsx(V,{children:i},i))]}),r.jsxs(o,{children:[r.jsx(a,{children:"Overview"}),r.jsx(m,{children:n.desc})]}),r.jsxs(o,{children:[r.jsx(a,{children:"My role"}),n.role?r.jsx(m,{children:n.role}):r.jsx(c,{children:"— coming soon —"})]}),r.jsxs(o,{children:[r.jsx(a,{children:"What I built"}),n.highlights?.length?r.jsx(X,{children:n.highlights.map(i=>r.jsx("li",{children:i},i))}):r.jsx(c,{children:"— coming soon —"})]}),r.jsxs(o,{children:[r.jsx(a,{children:"Tech stack"}),n.techStack?.length?r.jsx(Y,{children:n.techStack.map(i=>r.jsx(J,{children:i},i))}):r.jsx(c,{children:"— coming soon —"})]}),r.jsxs(o,{children:[r.jsx(a,{children:"Links"}),n.links?.length?r.jsx(K,{children:n.links.map(i=>r.jsxs(Q,{href:i.href,target:"_blank",rel:"noreferrer",children:[i.label,r.jsx("span",{"aria-hidden":!0,children:"↗"})]},i.href))}):r.jsx(c,{children:"— coming soon —"})]})]})]})}const B=t.div`
  min-height: 100vh;
  background: ${({theme:e})=>e.background};
`,D=t.div`
  position: fixed;
  top: ${u}px;
  left: 0;
  right: 0;
  height: ${b}px;
  z-index: 250;
  display: flex;
  align-items: center;
  padding: 0 2.2rem;
  background: ${({theme:e})=>e.surface};
  border-bottom: 1px solid ${({theme:e})=>e.border};
  opacity: ${({$visible:e})=>e?1:0};
  transition: opacity 0.3s ease ${({$visible:e})=>e?`${f+I}ms`:"0ms"};
`,F=t.div`
  margin-left: 50vw;
  min-height: 100vh;
  padding: ${E+36}px 5.2rem 12rem 4.4rem;
  opacity: ${({$visible:e})=>e?1:0};
  transition: opacity 0.4s ease ${({$visible:e})=>e?`${f+O}ms`:"0ms"};

  ${z.mobile} {
    margin-left: 0;
    margin-top: calc(${S}px + 50vh);
    padding: 2.8rem 2.4rem 8rem;
  }
`,W=t.h1`
  font-size: clamp(2.6rem, 4vw, 4.8rem);
  font-weight: 800;
  color: ${({theme:e})=>e.text};
  line-height: 1.08;
  margin: 0 0 1.4rem;
`,q=t.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`,G=t.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({theme:e})=>e.accent};
`,U=t.span`
  font-size: 1.3rem;
  color: ${({theme:e})=>e.textMuted};
`,V=t.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({theme:e})=>e.textMuted};
  border: 1px solid ${({theme:e})=>e.border};
  border-radius: 4px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`,o=t.div`
  border-top: 1px solid ${({theme:e})=>e.border};
  padding: 2.8rem 0;
`,a=t.div`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({theme:e})=>e.textMuted};
  margin-bottom: 1.2rem;
`,m=t.p`
  font-size: 1.5rem;
  line-height: 1.8;
  color: ${({theme:e})=>e.text};
  margin: 0;
`,X=t.ul`
  display: grid;
  gap: 1.2rem;
  margin: 0;
  padding-left: 2rem;
  color: ${({theme:e})=>e.text};
  font-size: 1.4rem;
  line-height: 1.7;

  li::marker {
    color: ${({theme:e})=>e.accent};
  }
`,Y=t.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`,J=t.span`
  padding: 0.7rem 1rem;
  border: 1px solid ${({theme:e})=>e.border};
  border-radius: 999px;
  background: ${({theme:e})=>e.surface};
  color: ${({theme:e})=>e.text};
  font-size: 1.1rem;
  font-weight: 600;
`,K=t.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`,Q=t.a`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1rem 1.4rem;
  border: 1px solid ${({theme:e})=>e.accent};
  border-radius: 6px;
  color: ${({theme:e})=>e.accent};
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover,
  &:focus-visible {
    color: ${({theme:e})=>e.onAccent};
    background: ${({theme:e})=>e.accent};
  }
`,c=t.div`
  height: 9rem;
  border-radius: 10px;
  background: ${({theme:e})=>e.surface};
  border: 1px dashed ${({theme:e})=>e.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${({theme:e})=>e.textMuted};
  letter-spacing: 0.05em;
`;export{ee as default};
