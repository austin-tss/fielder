// Fielder mic icon: navy circle, white mic, green ring. While listening (.on / .red on the button, or .fdmic.on)
// it gets a pulsing green glow and a small animated sound wave. Used everywhere a mic/talk emoji used to be.
// Fielder mic icon (Miller cf0bd01): a clean outline mic in Fielder green, like a chat text-box mic. While recording
// (.on / .red / .rec on the button, or FDMIC(true)) the button goes solid red and the icon becomes a white stop square.
(function(){
const css=document.createElement('style');css.textContent=`.fdmic{width:1.4em;height:1.4em;vertical-align:-.32em;flex:none;display:inline-block}
.fdmic .s{display:none}.on>.fdmic .m,.red>.fdmic .m,.rec>.fdmic .m,.fdmic.on .m{display:none}.on>.fdmic .s,.red>.fdmic .s,.rec>.fdmic .s,.fdmic.on .s{display:inline}
.btn .fdmic{margin-right:4px}.btn.mic{display:inline-flex;align-items:center;justify-content:center;gap:2px}.btn.mic.on{background:#c0392b!important;border-color:#c0392b!important;color:#fff!important}
.cmic,.tbdict,#vhfab{background:#eef5e4!important;color:#78a22f!important;border:2px solid #78a22f!important}
.cmic.on,.tbdict.rec,#vhfab.on{background:#c0392b!important;color:#fff!important;border-color:#c0392b!important}
.cmic .fdmic{width:26px!important;height:26px!important}.tbdict .fdmic,.tbdict svg{width:26px!important;height:26px!important}#vhfab .fdmic{width:30px!important;height:30px!important}
#vhfab{display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(17,35,55,.25)!important}#vhfab[hidden]{display:none!important}
.vh.on #vhmic{background:#c0392b!important}.vh.on #vhmic .fdmic .m{display:none}.vh.on #vhmic .fdmic .s{display:inline}`;document.head.appendChild(css);
window.FDMIC=function(on){return `<svg class="fdmic${on?' on':''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g class="m" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5 10.5a7 7 0 0 0 14 0"/><path d="M12 17.5V21"/></g><rect class="s" x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor"/></svg>`};
window.FDSTOP=function(){return FDMIC(true)};
})();
// form.js is shared with Code.gs verbatim, so its two buttons keep the emoji in source; swap it for the icon here.
(function(){const fix=()=>document.querySelectorAll('#aibtn,#mb').forEach(b=>{const t=b.firstChild;if(t&&t.nodeType===3&&/^[\u{1F399}\u{1F3A4}]\uFE0F?\s*/u.test(t.nodeValue)){t.nodeValue=' '+t.nodeValue.replace(/^[\u{1F399}\u{1F3A4}]\uFE0F?\s*/u,'');b.insertAdjacentHTML('afterbegin',FDMIC())}});
 const go=()=>{fix();new MutationObserver(fix).observe(document.body,{childList:true,subtree:true})};if(document.body)go();else document.addEventListener('DOMContentLoaded',go)})();
