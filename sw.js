if(!self.define){let s,e={};const i=(i,l)=>(i=new URL(i+".js",l).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(l,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const t=s=>i(s,r),o={module:{uri:r},exports:u,require:t};e[r]=Promise.all(l.map((s=>o[s]||t(s)))).then((s=>(n(...s),u)))}}define(["./workbox-e28e86ca"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/focus-visible-legacy-CdO5cX4I.js",revision:null},{url:"assets/focus-visible-supuXXMI.js",revision:null},{url:"assets/index-DlPkjdOU.js",revision:null},{url:"assets/index-legacy-BAjpazzZ.js",revision:null},{url:"assets/index-TO8XaBo-.css",revision:null},{url:"assets/index9-DVGYQJZT.js",revision:null},{url:"assets/index9-legacy-DSVtlWmx.js",revision:null},{url:"assets/input-shims-BGDCRnUv.js",revision:null},{url:"assets/input-shims-legacy-jLUup9f0.js",revision:null},{url:"assets/ios.transition-legacy-DVizJrMC.js",revision:null},{url:"assets/ios.transition-znmZdPY7.js",revision:null},{url:"assets/md.transition-CRXpxb3C.js",revision:null},{url:"assets/md.transition-legacy-D3Vhe_Kp.js",revision:null},{url:"assets/polyfills-legacy-C2MaGguQ.js",revision:null},{url:"assets/status-tap-CB2kMsVr.js",revision:null},{url:"assets/status-tap-legacy-BnXwPZin.js",revision:null},{url:"assets/swipe-back-BVjkuSlS.js",revision:null},{url:"assets/swipe-back-legacy-B4s4PgIp.js",revision:null},{url:"favicon.png",revision:"95a4ce6ec74daaec4ec45b5b512896c9"},{url:"index.html",revision:"6d0531277139864f5be3e9905e15b47d"},{url:"registerSW.js",revision:"62f41007d074ca3a9635d5ee62b19fb1"},{url:"manifest.json",revision:"7d13a85ff8e15eb27a45f3039eb8b37c"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute((({url:s})=>"/_config"===s.pathname),new s.StaleWhileRevalidate,"GET")}));
