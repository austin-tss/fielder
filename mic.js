// Fielder mic icon: navy circle, white mic, green ring. While listening (.on / .red on the button, or .fdmic.on)
// it gets a pulsing green glow and a small animated sound wave. Used everywhere a mic/talk emoji used to be.
(function(){
const css=document.createElement('style');css.textContent=`.fdmic{width:1.5em;height:1.5em;vertical-align:-.4em;flex:none;display:inline-block;overflow:visible}
.fdmic .w{opacity:0;transition:opacity .2s}.fdmic .w path{transform-box:fill-box;transform-origin:center}
.on>.fdmic,.red>.fdmic,.fdmic.on{animation:fdmp 1.3s ease-in-out infinite}.on>.fdmic .w,.red>.fdmic .w,.fdmic.on .w{opacity:1}
.on>.fdmic .w path,.red>.fdmic .w path,.fdmic.on .w path{animation:fdmw .8s ease-in-out infinite}.fdmic .w path:nth-child(2),.fdmic .w path:nth-child(4){animation-delay:.25s}
@keyframes fdmp{0%,100%{filter:drop-shadow(0 0 3px rgba(120,162,47,.7))}50%{filter:drop-shadow(0 0 11px rgba(120,162,47,1))}}
@keyframes fdmw{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.35)}}
@media (prefers-reduced-motion:reduce){.fdmic,.fdmic .w path{animation:none!important}}`;document.head.appendChild(css);
window.FDMIC=function(on){return `<svg class="fdmic${on?' on':''}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="21.5" fill="#112337" stroke="#78a22f" stroke-width="3"/><rect x="19.6" y="11" width="8.8" height="16" rx="4.4" fill="#fff"/><path d="M15.5 23.5a8.5 8.5 0 0 0 17 0M24 32v4.5M20 36.5h8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><g class="w" stroke="#78a22f" stroke-width="2.4" stroke-linecap="round"><path d="M10.5 21v6"/><path d="M7 18.5v11"/><path d="M37.5 21v6"/><path d="M41 18.5v11"/></g></svg>`};
})();
// form.js is shared with Code.gs verbatim, so its two buttons keep the emoji in source; swap it for the icon here.
(function(){const fix=()=>document.querySelectorAll('#aibtn,#mb').forEach(b=>{const t=b.firstChild;if(t&&t.nodeType===3&&/^[\u{1F399}\u{1F3A4}]\uFE0F?\s*/u.test(t.nodeValue)){t.nodeValue=' '+t.nodeValue.replace(/^[\u{1F399}\u{1F3A4}]\uFE0F?\s*/u,'');b.insertAdjacentHTML('afterbegin',FDMIC())}});
 const go=()=>{fix();new MutationObserver(fix).observe(document.body,{childList:true,subtree:true})};if(document.body)go();else document.addEventListener('DOMContentLoaded',go)})();
