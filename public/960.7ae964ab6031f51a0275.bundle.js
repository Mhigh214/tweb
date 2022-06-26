"use strict";(this.webpackChunktweb=this.webpackChunktweb||[]).push([[960],{410:(e,t,s)=>{s.d(t,{GO:()=>i,ZP:()=>o});const n=s(1267).Z.debug,i="undefined"!=typeof window?window:self,o=n},1267:(e,t,s)=>{s.d(t,{Z:()=>i});const n={test:location.search.indexOf("test=1")>0,debug:location.search.indexOf("debug=1")>0,http:!1,ssl:!0,multipleConnections:!0,asServiceWorker:!1,transport:"websocket"};n.http=location.search.indexOf("http=1")>0,n.http&&(n.transport="https");const i=n},6761:(e,t,s)=>{s.d(t,{Z:()=>n});const n="undefined"!=typeof window?window:self},4064:(e,t,s)=>{function n(e,t){const s=e.findIndex(t);return-1!==s?e.splice(s,1)[0]:void 0}s.d(t,{Z:()=>n})},1655:(e,t,s)=>{function n(e,t){const s=e.indexOf(t),n=-1!==s&&e.splice(s,1);return n&&n[0]}s.d(t,{Z:()=>n})},4903:(e,t,s)=>{function n(...e){const t=e.reduce(((e,t)=>e+(t.byteLength||t.length)),0),s=new Uint8Array(t);let n=0;return e.forEach((e=>{s.set(e instanceof ArrayBuffer?new Uint8Array(e):e,n),n+=e.byteLength||e.length})),s}s.d(t,{Z:()=>n})},1352:(e,t,s)=>{s.d(t,{N5:()=>i,SU:()=>n,kC:()=>o,sj:()=>c});const n="undefined"!=typeof ServiceWorkerGlobalScope&&self instanceof ServiceWorkerGlobalScope,i="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope&&!n,o=i||n,r=(e,...t)=>{try{e.postMessage(...t)}catch(e){console.error("[worker] postMessage error:",e,t)}},a=(e,...t)=>{self.clients.matchAll({includeUncontrolled:!1,type:"window"}).then((s=>{s.length&&s.slice(e?0:-1).forEach((e=>{r(e,...t)}))}))},c=(n&&a.bind(null,!1),n?a.bind(null,!0):i?(...e)=>{r(self,...e)}:()=>{})},5289:(e,t,s)=>{s.d(t,{Z:()=>i});const n=Date.now();function i(){return"["+((Date.now()-n)/1e3).toFixed(3)+"]"}},3241:(e,t,s)=>{s.d(t,{Z:()=>i});var n=s(4064);class i{constructor(e){this._constructor(e)}_constructor(e=!1){this.reuseResults=e,this.listeners={},this.listenerResults={}}addEventListener(e,t,s){var n;(null!==(n=this.listeners[e])&&void 0!==n?n:this.listeners[e]=[]).push({callback:t,options:s}),this.listenerResults.hasOwnProperty(e)&&(t(...this.listenerResults[e]),null==s?void 0:s.once)&&this.listeners[e].pop()}addMultipleEventsListeners(e){for(const t in e)this.addEventListener(t,e[t])}removeEventListener(e,t,s){this.listeners[e]&&(0,n.Z)(this.listeners[e],(e=>e.callback===t))}invokeListenerCallback(e,t,...s){var n;let i;try{i=t.callback(...s)}catch(e){console.error(e)}return(null===(n=t.options)||void 0===n?void 0:n.once)&&this.removeEventListener(e,t.callback),i}_dispatchEvent(e,t,...s){this.reuseResults&&(this.listenerResults[e]=s);const n=t&&[],i=this.listeners[e];return i&&i.slice().forEach((t=>{if(-1===i.findIndex((e=>e.callback===t.callback)))return;const o=this.invokeListenerCallback(e,t,...s);n&&n.push(o)})),n}dispatchResultableEvent(e,...t){return this._dispatchEvent(e,!0,...t)}dispatchEvent(e,...t){this._dispatchEvent(e,!1,...t)}cleanup(){this.listeners={},this.listenerResults={}}}},8630:(e,t,s)=>{s.d(t,{Z:()=>c});var n=s(153),i=s(410),o=s(1352);class r extends n.Z{invokeCrypto(e,...t){const s={method:e,args:t},n=this.listeners.invoke;if(null==n?void 0:n.length){let e=n[0].callback(s);return o.kC||e instanceof Promise||(e=Promise.resolve(e)),e}return this.invoke("invoke",s)}}const a=new r;i.GO&&(i.GO.cryptoMessagePort=a);const c=a},153:(e,t,s)=>{s.d(t,{Z:()=>h});var n=s(410),i=s(6761),o=s(1655),r=s(1352),a=s(3241),c=s(5003);class h extends a.Z{constructor(){super(!1),this.onMessage=e=>{const t=e.data,s=e.source||e.currentTarget;this.processTaskMap[t.type](t,s,e)},this.processResultTask=e=>{const{taskId:t,result:s,error:n}=e.payload,i=this.awaiting[t];i&&(this.debug&&this.log.debug("done",i.taskType,s,n),"error"in e.payload?i.reject(n):i.resolve(s),delete this.awaiting[t])},this.processAckTask=e=>{const t=e.payload,s=this.awaiting[t.taskId];s&&(0,s.resolve)({cached:t.cached,result:t.cached?"result"in t?Promise.resolve(t.result):Promise.reject(t.error):new Promise(((e,t)=>{s.resolve=e,s.reject=t}))})},this.processPingTask=(e,t,s)=>{this.pushTask(this.createTask("pong",void 0),s.source)},this.processPongTask=(e,t,s)=>{const n=this.pingResolves.get(t);n&&(this.pingResolves.delete(t),n())},this.processCloseTask=(e,t,s)=>{this.detachPort(t)},this.processInvokeTask=(e,t,s)=>{return n=this,i=void 0,r=function*(){const n=e.id,i=e.payload;let o,r,a,c;i.void||(o={taskId:n},r=this.createTask("result",o)),i.withAck&&(a=this.createTask("ack",{taskId:n,cached:!0}));try{const e=this.listeners[i.type];if(!(null==e?void 0:e.length))throw new Error("no listener");const n=e[0];let r=this.invokeListenerCallback(i.type,n,i.payload,t,s);if(i.void)return;if(c=r instanceof Promise,a){const e=!c;if(a.payload.cached=e,e&&(a.payload.result=r),this.pushTask(a,t),e)return}c&&(r=yield r),o.result=r}catch(s){if(this.log.error("worker task error:",s,e),i.void)return;if(a&&a.payload.cached)return a.payload.error=s,void this.pushTask(a,t);o.error=s}this.pushTask(r,t)},new((o=void 0)||(o=Promise))((function(e,t){function s(e){try{c(r.next(e))}catch(e){t(e)}}function a(e){try{c(r.throw(e))}catch(e){t(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof o?n:new o((function(e){e(n)}))).then(s,a)}c((r=r.apply(n,i||[])).next())}));var n,i,o,r},this.processTaskMap={result:this.processResultTask,ack:this.processAckTask,invoke:this.processInvokeTask,ping:this.processPingTask,pong:this.processPongTask,close:this.processCloseTask}}_constructor(){super._constructor(!1),this.listenPorts=[],this.sendPorts=[],this.pingResolves=new Map,this.taskId=0,this.awaiting={},this.pending=new Map,this.log=(0,c.kg)("MP"),this.debug=n.ZP,"undefined"!=typeof window&&window.addEventListener("beforeunload",(()=>{const e=this.createTask("close",void 0);this.postMessage(void 0,e)}))}setOnPortDisconnect(e){this.onPortDisconnect=e}attachPort(e){this.attachListenPort(e),this.attachSendPort(e)}attachListenPort(e){this.listenPorts.push(e),e.addEventListener("message",this.onMessage)}attachSendPort(e){this.log.warn("attaching port"),e.start&&e.start(),this.sendPorts.push(e)}detachPort(e){this.log.warn("disconnecting port"),e.removeEventListener("message",this.onMessage),(0,o.Z)(this.listenPorts,e),(0,o.Z)(this.sendPorts,e),e.close&&e.close(),this.onPortDisconnect&&this.onPortDisconnect(e)}postMessage(e,t){(Array.isArray(e)?e:e?[e]:this.sendPorts).forEach((e=>{e.postMessage(t,t.transfer)}))}releasePending(){this.listenPorts.length&&!this.releasingPending&&(this.releasingPending=!0,this.debug&&this.log.debug("releasing tasks, length:",this.pending.size),this.pending.forEach(((e,t)=>{e.forEach((e=>{try{r.SU?(0,r.sj)(e):this.postMessage(t,e)}catch(s){this.log.error("postMessage error:",s,e,t)}}))})),this.debug&&this.log.debug("released tasks"),this.pending.clear(),this.releasingPending=!1)}createTask(e,t,s){return{type:e,payload:t,id:this.taskId++,transfer:s}}createInvokeTask(e,t,s,n,i){return this.createTask("invoke",{type:e,payload:t,withAck:s,void:n},i)}pushTask(e,t){let s=this.pending.get(t);s||this.pending.set(t,s=[]),s.push(e),this.releasePending()}invokeVoid(e,t,s,n){const i=this.createInvokeTask(e,t,void 0,!0,n);this.pushTask(i,s)}invoke(e,t,s,n,o){let a;this.debug&&this.log.debug("start",e,t);const c=new Promise(((i,r)=>{a=this.createInvokeTask(e,t,s,void 0,o),this.awaiting[a.id]={resolve:i,reject:r,taskType:e},this.pushTask(a,n)}));if(r.kC){c.finally((()=>{clearInterval(e)}));const e=i.Z.setInterval((()=>{this.log.error("task still has no result",a,n)}),5e3)}return c}invokeExceptSource(e,t,s){const n=this.sendPorts.slice();(0,o.Z)(n,s),n.forEach((s=>{this.invokeVoid(e,t,s)}))}}},690:(e,t,s)=>{var n=s(4903);Uint8Array.prototype.concat=function(...e){return(0,n.Z)(this,...e)},Uint8Array.prototype.toJSON=function(){return[...this]},Promise.prototype.finally=Promise.prototype.finally||function(e){const t=t=>Promise.resolve(e()).then(t);return this.then((e=>t((()=>e))),(e=>t((()=>Promise.reject(e)))))}}}]);
//# sourceMappingURL=960.7ae964ab6031f51a0275.bundle.js.map