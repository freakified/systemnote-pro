if(!self.define){let s,e={};const i=(i,l)=>(i=new URL(i+".js",l).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(l,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const t=s=>i(s,r),o={module:{uri:r},exports:u,require:t};e[r]=Promise.all(l.map((s=>o[s]||t(s)))).then((s=>(n(...s),u)))}}define(["./workbox-e28e86ca"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/focus-visible-legacy-CdO5cX4I.js",revision:null},{url:"assets/focus-visible-supuXXMI.js",revision:null},{url:"assets/index-Cl05a4YN.css",revision:null},{url:"assets/index-gSmQ-HPc.js",revision:null},{url:"assets/index-legacy-CeaR1StZ.js",revision:null},{url:"assets/index9-b1hZvbgi.js",revision:null},{url:"assets/index9-legacy-CUh6G_yG.js",revision:null},{url:"assets/input-shims-Hs7eBguL.js",revision:null},{url:"assets/input-shims-legacy-Cdnhs-wS.js",revision:null},{url:"assets/ios.transition-DzkMUqr7.js",revision:null},{url:"assets/ios.transition-legacy-CkHKY2RB.js",revision:null},{url:"assets/md.transition-D-1Najrk.js",revision:null},{url:"assets/md.transition-legacy-BzQLg-0x.js",revision:null},{url:"assets/polyfills-legacy-C2MaGguQ.js",revision:null},{url:"assets/status-tap-C6GdY42q.js",revision:null},{url:"assets/status-tap-legacy-cMZOIg-6.js",revision:null},{url:"assets/swipe-back-CBZuC9SU.js",revision:null},{url:"assets/swipe-back-legacy-DuCcb7pA.js",revision:null},{url:"favicon.png",revision:"95a4ce6ec74daaec4ec45b5b512896c9"},{url:"index.html",revision:"7f25b53d733015e5c000c05932f31249"},{url:"registerSW.js",revision:"62f41007d074ca3a9635d5ee62b19fb1"},{url:"manifest.json",revision:"7d13a85ff8e15eb27a45f3039eb8b37c"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute((({url:s})=>"/_config"===s.pathname),new s.StaleWhileRevalidate,"GET")}));
