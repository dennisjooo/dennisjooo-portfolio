const PAPER_LIGHT = "#fafafa";
const PAPER_DARK = "#1f1f1f";
const INK_LIGHT = "#000000";
const INK_DARK = "#f5f5f5";

export const SSR_CRITICAL_CSS = [
  `html,body{background-color:${PAPER_LIGHT}}`,
  `@media(prefers-color-scheme:dark){html,body{background-color:${PAPER_DARK}}}`,
  `html.dark,html.dark body{background-color:${PAPER_DARK}!important}`,
  `html.light,html.light body{background-color:${PAPER_LIGHT}!important}`,
  `html:has(#__ssr_cover:not(.hidden)),html:has(#__ssr_cover:not(.hidden)) body,html:not([data-scroll-ready]),html:not([data-scroll-ready]) body{overflow-y:hidden;overscroll-behavior:none}`,
  `#__ssr_cover{position:fixed;inset:0;z-index:99999;background:${PAPER_LIGHT};transition:opacity var(--dur-long,420ms) var(--ease-out,ease);display:flex;flex-direction:column;align-items:center;justify-content:center;overscroll-behavior:none;touch-action:none}`,
  `@media(prefers-color-scheme:dark){#__ssr_cover{background:${PAPER_DARK}}}`,
  `html.dark #__ssr_cover{background:${PAPER_DARK}!important}`,
  `html.light #__ssr_cover{background:${PAPER_LIGHT}!important}`,
  "#__ssr_cover.hidden{opacity:0;pointer-events:none;visibility:hidden}",
  "#__ssr_loader{display:flex;align-items:center;justify-content:center}",
  `#__ssr_loader .ssr-mark{color:${INK_LIGHT};font-family:var(--font-geist-serif),Georgia,'Times New Roman',serif;font-weight:400;font-size:3rem;letter-spacing:-.05em;line-height:1;animation:ssr-pulse 1.4s var(--ease-in-out,ease) infinite}`,
  "@media(min-width:768px){#__ssr_loader .ssr-mark{font-size:4rem}}",
  `@media(prefers-color-scheme:dark){#__ssr_loader .ssr-mark{color:${INK_DARK}}}`,
  `html.dark #__ssr_loader .ssr-mark{color:${INK_DARK}!important}`,
  `html.light #__ssr_loader .ssr-mark{color:${INK_LIGHT}!important}`,
  "@keyframes ssr-pulse{0%,100%{transform:scale(.92);opacity:.5}50%{transform:scale(1);opacity:1}}",
  "@media(prefers-reduced-motion:reduce){#__ssr_loader .ssr-mark{animation:none}}",
].join("");

export const SSR_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme'),d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches),c=d?'${PAPER_DARK}':'${PAPER_LIGHT}',h=document.documentElement;h.style.backgroundColor=c;h.style.colorScheme=d?'dark':'light';if(d)h.classList.add('dark');else h.classList.add('light');var v=document.getElementById('__ssr_cover');if(v){v.style.background=c;if(sessionStorage.getItem('portfolio-has-visited')==='true')v.classList.add('hidden')}}catch(e){}})()`;

export const SSR_SCROLL_LOCK_SCRIPT = `(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';var v=document.getElementById('__ssr_cover');if(!v)return;try{if(sessionStorage.getItem('portfolio-has-visited')==='true')v.classList.add('hidden')}catch(e){}function locked(){return !document.documentElement.hasAttribute('data-scroll-ready')}function block(e){if(locked())e.preventDefault()}document.addEventListener('wheel',block,{passive:false,capture:true});document.addEventListener('touchmove',block,{passive:false,capture:true});document.addEventListener('keydown',function(e){if(!locked())return;var k=e.key;if(k==='ArrowUp'||k==='ArrowDown'||k==='PageUp'||k==='PageDown'||k==='Home'||k==='End'||k===' ')e.preventDefault()},true)}catch(e){}})()`;
