export const SSR_CRITICAL_CSS = [
  "html,body{background-color:#fff}",
  "@media(prefers-color-scheme:dark){html,body{background-color:#000}}",
  "html.dark,html.dark body{background-color:#000!important}",
  "html.light,html.light body{background-color:#fff!important}",
  "#__ssr_cover{position:fixed;inset:0;z-index:99999;background:#fff;transition:opacity .4s ease;display:flex;flex-direction:column;align-items:center;justify-content:center}",
  "@media(prefers-color-scheme:dark){#__ssr_cover{background:#000}}",
  "html.dark #__ssr_cover{background:#000!important}",
  "html.light #__ssr_cover{background:#fff!important}",
  "#__ssr_cover.hidden{opacity:0;pointer-events:none;visibility:hidden}",
  "#__ssr_loader{display:flex;align-items:center;justify-content:center}",
  "#__ssr_loader .ssr-mark{color:#0a0a0a;font-family:var(--font-caslon),Georgia,'Times New Roman',serif;font-style:italic;font-weight:400;font-size:3rem;letter-spacing:-.05em;line-height:1;animation:ssr-pulse 1.4s ease-in-out infinite}",
  "@media(min-width:768px){#__ssr_loader .ssr-mark{font-size:4rem}}",
  "@media(prefers-color-scheme:dark){#__ssr_loader .ssr-mark{color:#fafafa}}",
  "html.dark #__ssr_loader .ssr-mark{color:#fafafa!important}",
  "html.light #__ssr_loader .ssr-mark{color:#0a0a0a!important}",
  "@keyframes ssr-pulse{0%,100%{transform:scale(.92);opacity:.5}50%{transform:scale(1);opacity:1}}",
  "@media(prefers-reduced-motion:reduce){#__ssr_loader .ssr-mark{animation:none}}",
].join("");

export const SSR_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme'),d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches),c=d?'#000':'#fff',h=document.documentElement;h.style.backgroundColor=c;h.style.colorScheme=d?'dark':'light';if(d)h.classList.add('dark');else h.classList.add('light');var v=document.getElementById('__ssr_cover');if(v){v.style.background=c;if(sessionStorage.getItem('portfolio-has-visited')==='true')v.classList.add('hidden')}}catch(e){}})()`;
