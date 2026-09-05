import{j as t,d as r,b as h,e as v,u as T,a as w,c as y,r as M,C as x,N as p,T as g,m as C,H as k}from"./index-KsLS4W8P.js";function S(){return t.jsx("svg",{viewBox:"0 0 24 24","aria-hidden":!0,children:t.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})})}function z({currentLabel:e,onBack:n}){return t.jsxs(N,{children:[t.jsxs(R,{"aria-label":"breadcrumb",children:[t.jsx(c,{onClick:n,children:"Home"}),t.jsx(l,{children:"/"}),t.jsx(c,{onClick:n,children:"Projects"}),t.jsx(l,{children:"/"}),t.jsx(P,{children:e})]}),t.jsx(_,{onClick:n,"aria-label":"Close",children:t.jsx(S,{})})]})}const N=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`,R=r.nav`
  display: flex;
  align-items: center;
  gap: 6px;
`,c=r.button`
  ${h};
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({theme:e})=>e.textMuted};
  letter-spacing: 0.01em;
  transition: color 0.15s;
  &:hover { color: ${({theme:e})=>e.text}; }
`,l=r.span`
  font-size: 1.1rem;
  color: ${({theme:e})=>e.textMuted};
  opacity: 0.4;
  user-select: none;
  margin: 0 1px;
`,P=r.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({theme:e})=>e.primary[500]};
  letter-spacing: 0.01em;
  max-width: 20rem;
  ${v};
`,_=r.button`
  ${h};
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
`,u=36,E=p+u,O=60,A=80,I=[{label:"Tech Stack",placeholder:"— coming soon —"},{label:"Gallery",placeholder:"— coming soon —"},{label:"Links",placeholder:"— coming soon —"}],L=e=>{const n=Number(e??0);return Number.isFinite(n)?Math.max(0,Math.min(x.length-1,n)):0};function J(){const{id:e}=T(),n=w(),{card:b,phase:f,setPhase:i}=y(),$=L(e),o=b??x[$],a=f==="landed",j=M.useCallback(()=>{i("flying-out"),n(-1)},[n,i]);return t.jsxs(B,{children:[t.jsx(D,{$visible:a,children:t.jsx(z,{currentLabel:o.title,onBack:j})}),t.jsxs(H,{$visible:a,children:[t.jsx(F,{children:o.title}),t.jsxs(G,{children:[t.jsxs(q,{children:["★ ",o.rating]}),t.jsx(U,{children:o.year}),o.tags.map(s=>t.jsx(V,{children:s},s))]}),t.jsxs(d,{children:[t.jsx(m,{children:"Overview"}),t.jsx(W,{children:o.desc})]}),I.map(s=>t.jsxs(d,{children:[t.jsx(m,{children:s.label}),t.jsx(X,{children:s.placeholder})]},s.label))]})]})}const B=r.div`
  min-height: 100vh;
  background: ${({theme:e})=>e.background};
`,D=r.div`
  position: fixed;
  top: ${p}px;
  left: 0;
  right: 0;
  height: ${u}px;
  z-index: 250;
  display: flex;
  align-items: center;
  padding: 0 2.2rem;
  background: ${({theme:e})=>e.surface};
  border-bottom: 1px solid ${({theme:e})=>e.border};
  opacity: ${({$visible:e})=>e?1:0};
  transition: opacity 0.3s ease ${({$visible:e})=>e?`${g+O}ms`:"0ms"};
`,H=r.div`
  margin-left: 50vw;
  min-height: 100vh;
  padding: ${E+36}px 5.2rem 12rem 4.4rem;
  opacity: ${({$visible:e})=>e?1:0};
  transition: opacity 0.4s ease ${({$visible:e})=>e?`${g+A}ms`:"0ms"};

  ${C.mobile} {
    margin-left: 0;
    margin-top: calc(${k}px + 50vh);
    padding: 2.8rem 2.4rem 8rem;
  }
`,F=r.h1`
  font-size: clamp(2.6rem, 4vw, 4.8rem);
  font-weight: 800;
  color: ${({theme:e})=>e.text};
  line-height: 1.08;
  margin: 0 0 1.4rem;
`,G=r.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`,q=r.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({theme:e})=>e.accent};
`,U=r.span`
  font-size: 1.3rem;
  color: ${({theme:e})=>e.textMuted};
`,V=r.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({theme:e})=>e.textMuted};
  border: 1px solid ${({theme:e})=>e.border};
  border-radius: 4px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`,d=r.div`
  border-top: 1px solid ${({theme:e})=>e.border};
  padding: 2.8rem 0;
`,m=r.div`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({theme:e})=>e.textMuted};
  margin-bottom: 1.2rem;
`,W=r.p`
  font-size: 1.5rem;
  line-height: 1.8;
  color: ${({theme:e})=>e.text};
  margin: 0;
`,X=r.div`
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
`;export{J as default};
