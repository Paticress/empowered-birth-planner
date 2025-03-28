var t,e,s,i,n,r,a,o,u,l,h,c,d,f,p,y,v,m,g,b,w,O,M,P,q,S,F,k,A,E,C,D,Q,R,x,K,W,T,j,U=t=>{throw TypeError(t)},H=(t,e,s)=>e.has(t)||U("Cannot "+s),G=(t,e,s)=>(H(t,e,"read from private field"),s?s.call(t):e.get(t)),L=(t,e,s)=>e.has(t)?U("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),I=(t,e,s,i)=>(H(t,e,"write to private field"),i?i.call(t,s):e.set(t,s),s),_=(t,e,s)=>(H(t,e,"access private method"),s),N=(t,e,s,i)=>({set _(i){I(t,e,i,s)},get _(){return G(t,e,i)}}),B=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(t){return this.listeners.add(t),this.onSubscribe(),()=>{this.listeners.delete(t),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}},$="undefined"==typeof window||"Deno"in globalThis;function z(){}function J(t,e){return"function"==typeof t?t(e):t}function V(t,e){const{type:s="all",exact:i,fetchStatus:n,predicate:r,queryKey:a,stale:o}=t;if(a)if(i){if(e.queryHash!==Y(a,e.options))return!1}else if(!tt(e.queryKey,a))return!1;if("all"!==s){const t=e.isActive();if("active"===s&&!t)return!1;if("inactive"===s&&t)return!1}return("boolean"!=typeof o||e.isStale()===o)&&((!n||n===e.state.fetchStatus)&&!(r&&!r(e)))}function X(t,e){const{exact:s,status:i,predicate:n,mutationKey:r}=t;if(r){if(!e.options.mutationKey)return!1;if(s){if(Z(e.options.mutationKey)!==Z(r))return!1}else if(!tt(e.options.mutationKey,r))return!1}return(!i||e.state.status===i)&&!(n&&!n(e))}function Y(t,e){return((null==e?void 0:e.queryKeyHashFn)||Z)(t)}function Z(t){return JSON.stringify(t,((t,e)=>it(e)?Object.keys(e).sort().reduce(((t,s)=>(t[s]=e[s],t)),{}):e))}function tt(t,e){return t===e||typeof t==typeof e&&(!(!t||!e||"object"!=typeof t||"object"!=typeof e)&&!Object.keys(e).some((s=>!tt(t[s],e[s]))))}function et(t,e){if(t===e)return t;const s=st(t)&&st(e);if(s||it(t)&&it(e)){const i=s?t:Object.keys(t),n=i.length,r=s?e:Object.keys(e),a=r.length,o=s?[]:{};let u=0;for(let l=0;l<a;l++){const n=s?l:r[l];(!s&&i.includes(n)||s)&&void 0===t[n]&&void 0===e[n]?(o[n]=void 0,u++):(o[n]=et(t[n],e[n]),o[n]===t[n]&&void 0!==t[n]&&u++)}return n===a&&u===n?t:o}return e}function st(t){return Array.isArray(t)&&t.length===Object.keys(t).length}function it(t){if(!nt(t))return!1;const e=t.constructor;if(void 0===e)return!0;const s=e.prototype;return!!nt(s)&&(!!s.hasOwnProperty("isPrototypeOf")&&Object.getPrototypeOf(t)===Object.prototype)}function nt(t){return"[object Object]"===Object.prototype.toString.call(t)}function rt(t,e,s){return"function"==typeof s.structuralSharing?s.structuralSharing(t,e):!1!==s.structuralSharing?et(t,e):e}function at(t,e,s=0){const i=[...t,e];return s&&i.length>s?i.slice(1):i}function ot(t,e,s=0){const i=[e,...t];return s&&i.length>s?i.slice(0,-1):i}var ut=Symbol();function lt(t,e){return!t.queryFn&&(null==e?void 0:e.initialPromise)?()=>e.initialPromise:t.queryFn&&t.queryFn!==ut?t.queryFn:()=>Promise.reject(new Error(`Missing queryFn: '${t.queryHash}'`))}var ht=new(i=class extends B{constructor(){super(),L(this,t),L(this,e),L(this,s),I(this,s,(t=>{if(!$&&window.addEventListener){const e=()=>t();return window.addEventListener("visibilitychange",e,!1),()=>{window.removeEventListener("visibilitychange",e)}}}))}onSubscribe(){G(this,e)||this.setEventListener(G(this,s))}onUnsubscribe(){var t;this.hasListeners()||(null==(t=G(this,e))||t.call(this),I(this,e,void 0))}setEventListener(t){var i;I(this,s,t),null==(i=G(this,e))||i.call(this),I(this,e,t((t=>{"boolean"==typeof t?this.setFocused(t):this.onFocus()})))}setFocused(e){G(this,t)!==e&&(I(this,t,e),this.onFocus())}onFocus(){const t=this.isFocused();this.listeners.forEach((e=>{e(t)}))}isFocused(){var e;return"boolean"==typeof G(this,t)?G(this,t):"hidden"!==(null==(e=globalThis.document)?void 0:e.visibilityState)}},t=new WeakMap,e=new WeakMap,s=new WeakMap,i),ct=new(o=class extends B{constructor(){super(),L(this,n,!0),L(this,r),L(this,a),I(this,a,(t=>{if(!$&&window.addEventListener){const e=()=>t(!0),s=()=>t(!1);return window.addEventListener("online",e,!1),window.addEventListener("offline",s,!1),()=>{window.removeEventListener("online",e),window.removeEventListener("offline",s)}}}))}onSubscribe(){G(this,r)||this.setEventListener(G(this,a))}onUnsubscribe(){var t;this.hasListeners()||(null==(t=G(this,r))||t.call(this),I(this,r,void 0))}setEventListener(t){var e;I(this,a,t),null==(e=G(this,r))||e.call(this),I(this,r,t(this.setOnline.bind(this)))}setOnline(t){G(this,n)!==t&&(I(this,n,t),this.listeners.forEach((e=>{e(t)})))}isOnline(){return G(this,n)}},n=new WeakMap,r=new WeakMap,a=new WeakMap,o);function dt(t){return Math.min(1e3*2**t,3e4)}function ft(t){return"online"!==(t??"online")||ct.isOnline()}var pt=class extends Error{constructor(t){super("CancelledError"),this.revert=null==t?void 0:t.revert,this.silent=null==t?void 0:t.silent}};function yt(t){return t instanceof pt}function vt(t){let e,s=!1,i=0,n=!1;const r=function(){let t,e;const s=new Promise(((s,i)=>{t=s,e=i}));function i(t){Object.assign(s,t),delete s.resolve,delete s.reject}return s.status="pending",s.catch((()=>{})),s.resolve=e=>{i({status:"fulfilled",value:e}),t(e)},s.reject=t=>{i({status:"rejected",reason:t}),e(t)},s}(),a=()=>ht.isFocused()&&("always"===t.networkMode||ct.isOnline())&&t.canRun(),o=()=>ft(t.networkMode)&&t.canRun(),u=s=>{var i;n||(n=!0,null==(i=t.onSuccess)||i.call(t,s),null==e||e(),r.resolve(s))},l=s=>{var i;n||(n=!0,null==(i=t.onError)||i.call(t,s),null==e||e(),r.reject(s))},h=()=>new Promise((s=>{var i;e=t=>{(n||a())&&s(t)},null==(i=t.onPause)||i.call(t)})).then((()=>{var s;e=void 0,n||null==(s=t.onContinue)||s.call(t)})),c=()=>{if(n)return;let e;const r=0===i?t.initialPromise:void 0;try{e=r??t.fn()}catch(o){e=Promise.reject(o)}Promise.resolve(e).then(u).catch((e=>{var r;if(n)return;const o=t.retry??($?0:3),u=t.retryDelay??dt,d="function"==typeof u?u(i,e):u,f=!0===o||"number"==typeof o&&i<o||"function"==typeof o&&o(i,e);var p;!s&&f?(i++,null==(r=t.onFail)||r.call(t,i,e),(p=d,new Promise((t=>{setTimeout(t,p)}))).then((()=>a()?void 0:h())).then((()=>{s?l(e):c()}))):l(e)}))};return{promise:r,cancel:e=>{var s;n||(l(new pt(e)),null==(s=t.abort)||s.call(t))},continue:()=>(null==e||e(),r),cancelRetry:()=>{s=!0},continueRetry:()=>{s=!1},canStart:o,start:()=>(o()?c():h().then(c),r)}}var mt=function(){let t=[],e=0,s=t=>{t()},i=t=>{t()},n=t=>setTimeout(t,0);const r=i=>{e?t.push(i):n((()=>{s(i)}))};return{batch:r=>{let a;e++;try{a=r()}finally{e--,e||(()=>{const e=t;t=[],e.length&&n((()=>{i((()=>{e.forEach((t=>{s(t)}))}))}))})()}return a},batchCalls:t=>(...e)=>{r((()=>{t(...e)}))},schedule:r,setNotifyFunction:t=>{s=t},setBatchNotifyFunction:t=>{i=t},setScheduler:t=>{n=t}}}(),gt=(l=class{constructor(){L(this,u)}destroy(){this.clearGcTimeout()}scheduleGc(){var t;this.clearGcTimeout(),"number"==typeof(t=this.gcTime)&&t>=0&&t!==1/0&&I(this,u,setTimeout((()=>{this.optionalRemove()}),this.gcTime))}updateGcTime(t){this.gcTime=Math.max(this.gcTime||0,t??($?1/0:3e5))}clearGcTimeout(){G(this,u)&&(clearTimeout(G(this,u)),I(this,u,void 0))}},u=new WeakMap,l),bt=(g=class extends gt{constructor(t){super(),L(this,v),L(this,h),L(this,c),L(this,d),L(this,f),L(this,p),L(this,y),I(this,y,!1),I(this,p,t.defaultOptions),this.setOptions(t.options),this.observers=[],I(this,d,t.cache),this.queryKey=t.queryKey,this.queryHash=t.queryHash,I(this,h,function(t){const e="function"==typeof t.initialData?t.initialData():t.initialData,s=void 0!==e,i=s?"function"==typeof t.initialDataUpdatedAt?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:s?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:s?"success":"pending",fetchStatus:"idle"}}(this.options)),this.state=t.state??G(this,h),this.scheduleGc()}get meta(){return this.options.meta}get promise(){var t;return null==(t=G(this,f))?void 0:t.promise}setOptions(t){this.options={...G(this,p),...t},this.updateGcTime(this.options.gcTime)}optionalRemove(){this.observers.length||"idle"!==this.state.fetchStatus||G(this,d).remove(this)}setData(t,e){const s=rt(this.state.data,t,this.options);return _(this,v,m).call(this,{data:s,type:"success",dataUpdatedAt:null==e?void 0:e.updatedAt,manual:null==e?void 0:e.manual}),s}setState(t,e){_(this,v,m).call(this,{type:"setState",state:t,setStateOptions:e})}cancel(t){var e,s;const i=null==(e=G(this,f))?void 0:e.promise;return null==(s=G(this,f))||s.cancel(t),i?i.then(z).catch(z):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(G(this,h))}isActive(){return this.observers.some((t=>{return!1!==(e=t.options.enabled,s=this,"function"==typeof e?e(s):e);var e,s}))}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===ut||this.state.dataUpdateCount+this.state.errorUpdateCount===0}isStale(){return!!this.state.isInvalidated||(this.getObserversCount()>0?this.observers.some((t=>t.getCurrentResult().isStale)):void 0===this.state.data)}isStaleByTime(t=0){return this.state.isInvalidated||void 0===this.state.data||!function(t,e){return Math.max(t+(e||0)-Date.now(),0)}(this.state.dataUpdatedAt,t)}onFocus(){var t;const e=this.observers.find((t=>t.shouldFetchOnWindowFocus()));null==e||e.refetch({cancelRefetch:!1}),null==(t=G(this,f))||t.continue()}onOnline(){var t;const e=this.observers.find((t=>t.shouldFetchOnReconnect()));null==e||e.refetch({cancelRefetch:!1}),null==(t=G(this,f))||t.continue()}addObserver(t){this.observers.includes(t)||(this.observers.push(t),this.clearGcTimeout(),G(this,d).notify({type:"observerAdded",query:this,observer:t}))}removeObserver(t){this.observers.includes(t)&&(this.observers=this.observers.filter((e=>e!==t)),this.observers.length||(G(this,f)&&(G(this,y)?G(this,f).cancel({revert:!0}):G(this,f).cancelRetry()),this.scheduleGc()),G(this,d).notify({type:"observerRemoved",query:this,observer:t}))}getObserversCount(){return this.observers.length}invalidate(){this.state.isInvalidated||_(this,v,m).call(this,{type:"invalidate"})}fetch(t,e){var s,i,n;if("idle"!==this.state.fetchStatus)if(void 0!==this.state.data&&(null==e?void 0:e.cancelRefetch))this.cancel({silent:!0});else if(G(this,f))return G(this,f).continueRetry(),G(this,f).promise;if(t&&this.setOptions(t),!this.options.queryFn){const t=this.observers.find((t=>t.options.queryFn));t&&this.setOptions(t.options)}const r=new AbortController,a=t=>{Object.defineProperty(t,"signal",{enumerable:!0,get:()=>(I(this,y,!0),r.signal)})},o={fetchOptions:e,options:this.options,queryKey:this.queryKey,state:this.state,fetchFn:()=>{const t=lt(this.options,e),s={queryKey:this.queryKey,meta:this.meta};return a(s),I(this,y,!1),this.options.persister?this.options.persister(t,s,this):t(s)}};a(o),null==(s=this.options.behavior)||s.onFetch(o,this),I(this,c,this.state),"idle"!==this.state.fetchStatus&&this.state.fetchMeta===(null==(i=o.fetchOptions)?void 0:i.meta)||_(this,v,m).call(this,{type:"fetch",meta:null==(n=o.fetchOptions)?void 0:n.meta});const u=t=>{var e,s,i,n;yt(t)&&t.silent||_(this,v,m).call(this,{type:"error",error:t}),yt(t)||(null==(s=(e=G(this,d).config).onError)||s.call(e,t,this),null==(n=(i=G(this,d).config).onSettled)||n.call(i,this.state.data,t,this)),this.scheduleGc()};return I(this,f,vt({initialPromise:null==e?void 0:e.initialPromise,fn:o.fetchFn,abort:r.abort.bind(r),onSuccess:t=>{var e,s,i,n;if(void 0!==t){try{this.setData(t)}catch(r){return void u(r)}null==(s=(e=G(this,d).config).onSuccess)||s.call(e,t,this),null==(n=(i=G(this,d).config).onSettled)||n.call(i,t,this.state.error,this),this.scheduleGc()}else u(new Error(`${this.queryHash} data is undefined`))},onError:u,onFail:(t,e)=>{_(this,v,m).call(this,{type:"failed",failureCount:t,error:e})},onPause:()=>{_(this,v,m).call(this,{type:"pause"})},onContinue:()=>{_(this,v,m).call(this,{type:"continue"})},retry:o.options.retry,retryDelay:o.options.retryDelay,networkMode:o.options.networkMode,canRun:()=>!0})),G(this,f).start()}},h=new WeakMap,c=new WeakMap,d=new WeakMap,f=new WeakMap,p=new WeakMap,y=new WeakMap,v=new WeakSet,m=function(t){this.state=(e=>{switch(t.type){case"failed":return{...e,fetchFailureCount:t.failureCount,fetchFailureReason:t.error};case"pause":return{...e,fetchStatus:"paused"};case"continue":return{...e,fetchStatus:"fetching"};case"fetch":return{...e,...(s=e.data,i=this.options,{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:ft(i.networkMode)?"fetching":"paused",...void 0===s&&{error:null,status:"pending"}}),fetchMeta:t.meta??null};case"success":return{...e,data:t.data,dataUpdateCount:e.dataUpdateCount+1,dataUpdatedAt:t.dataUpdatedAt??Date.now(),error:null,isInvalidated:!1,status:"success",...!t.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};case"error":const n=t.error;return yt(n)&&n.revert&&G(this,c)?{...G(this,c),fetchStatus:"idle"}:{...e,error:n,errorUpdateCount:e.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:e.fetchFailureCount+1,fetchFailureReason:n,fetchStatus:"idle",status:"error"};case"invalidate":return{...e,isInvalidated:!0};case"setState":return{...e,...t.state}}var s,i})(this.state),mt.batch((()=>{this.observers.forEach((t=>{t.onQueryUpdate()})),G(this,d).notify({query:this,type:"updated",action:t})}))},g);var wt=(w=class extends B{constructor(t={}){super(),L(this,b),this.config=t,I(this,b,new Map)}build(t,e,s){const i=e.queryKey,n=e.queryHash??Y(i,e);let r=this.get(n);return r||(r=new bt({cache:this,queryKey:i,queryHash:n,options:t.defaultQueryOptions(e),state:s,defaultOptions:t.getQueryDefaults(i)}),this.add(r)),r}add(t){G(this,b).has(t.queryHash)||(G(this,b).set(t.queryHash,t),this.notify({type:"added",query:t}))}remove(t){const e=G(this,b).get(t.queryHash);e&&(t.destroy(),e===t&&G(this,b).delete(t.queryHash),this.notify({type:"removed",query:t}))}clear(){mt.batch((()=>{this.getAll().forEach((t=>{this.remove(t)}))}))}get(t){return G(this,b).get(t)}getAll(){return[...G(this,b).values()]}find(t){const e={exact:!0,...t};return this.getAll().find((t=>V(e,t)))}findAll(t={}){const e=this.getAll();return Object.keys(t).length>0?e.filter((e=>V(t,e))):e}notify(t){mt.batch((()=>{this.listeners.forEach((e=>{e(t)}))}))}onFocus(){mt.batch((()=>{this.getAll().forEach((t=>{t.onFocus()}))}))}onOnline(){mt.batch((()=>{this.getAll().forEach((t=>{t.onOnline()}))}))}},b=new WeakMap,w),Ot=(F=class extends gt{constructor(t){super(),L(this,q),L(this,O),L(this,M),L(this,P),this.mutationId=t.mutationId,I(this,M,t.mutationCache),I(this,O,[]),this.state=t.state||{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0},this.setOptions(t.options),this.scheduleGc()}setOptions(t){this.options=t,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(t){G(this,O).includes(t)||(G(this,O).push(t),this.clearGcTimeout(),G(this,M).notify({type:"observerAdded",mutation:this,observer:t}))}removeObserver(t){I(this,O,G(this,O).filter((e=>e!==t))),this.scheduleGc(),G(this,M).notify({type:"observerRemoved",mutation:this,observer:t})}optionalRemove(){G(this,O).length||("pending"===this.state.status?this.scheduleGc():G(this,M).remove(this))}continue(){var t;return(null==(t=G(this,P))?void 0:t.continue())??this.execute(this.state.variables)}async execute(t){var e,s,i,n,r,a,o,u,l,h,c,d,f,p,y,v,m,g,b,w;I(this,P,vt({fn:()=>this.options.mutationFn?this.options.mutationFn(t):Promise.reject(new Error("No mutationFn found")),onFail:(t,e)=>{_(this,q,S).call(this,{type:"failed",failureCount:t,error:e})},onPause:()=>{_(this,q,S).call(this,{type:"pause"})},onContinue:()=>{_(this,q,S).call(this,{type:"continue"})},retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>G(this,M).canRun(this)}));const O="pending"===this.state.status,F=!G(this,P).canStart();try{if(!O){_(this,q,S).call(this,{type:"pending",variables:t,isPaused:F}),await(null==(s=(e=G(this,M).config).onMutate)?void 0:s.call(e,t,this));const r=await(null==(n=(i=this.options).onMutate)?void 0:n.call(i,t));r!==this.state.context&&_(this,q,S).call(this,{type:"pending",context:r,variables:t,isPaused:F})}const f=await G(this,P).start();return await(null==(a=(r=G(this,M).config).onSuccess)?void 0:a.call(r,f,t,this.state.context,this)),await(null==(u=(o=this.options).onSuccess)?void 0:u.call(o,f,t,this.state.context)),await(null==(h=(l=G(this,M).config).onSettled)?void 0:h.call(l,f,null,this.state.variables,this.state.context,this)),await(null==(d=(c=this.options).onSettled)?void 0:d.call(c,f,null,t,this.state.context)),_(this,q,S).call(this,{type:"success",data:f}),f}catch(k){try{throw await(null==(p=(f=G(this,M).config).onError)?void 0:p.call(f,k,t,this.state.context,this)),await(null==(v=(y=this.options).onError)?void 0:v.call(y,k,t,this.state.context)),await(null==(g=(m=G(this,M).config).onSettled)?void 0:g.call(m,void 0,k,this.state.variables,this.state.context,this)),await(null==(w=(b=this.options).onSettled)?void 0:w.call(b,void 0,k,t,this.state.context)),k}finally{_(this,q,S).call(this,{type:"error",error:k})}}finally{G(this,M).runNext(this)}}},O=new WeakMap,M=new WeakMap,P=new WeakMap,q=new WeakSet,S=function(t){this.state=(e=>{switch(t.type){case"failed":return{...e,failureCount:t.failureCount,failureReason:t.error};case"pause":return{...e,isPaused:!0};case"continue":return{...e,isPaused:!1};case"pending":return{...e,context:t.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:t.isPaused,status:"pending",variables:t.variables,submittedAt:Date.now()};case"success":return{...e,data:t.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...e,data:void 0,error:t.error,failureCount:e.failureCount+1,failureReason:t.error,isPaused:!1,status:"error"}}})(this.state),mt.batch((()=>{G(this,O).forEach((e=>{e.onMutationUpdate(t)})),G(this,M).notify({mutation:this,type:"updated",action:t})}))},F);var Mt=(E=class extends B{constructor(t={}){super(),L(this,k),L(this,A),this.config=t,I(this,k,new Map),I(this,A,Date.now())}build(t,e,s){const i=new Ot({mutationCache:this,mutationId:++N(this,A)._,options:t.defaultMutationOptions(e),state:s});return this.add(i),i}add(t){const e=Pt(t),s=G(this,k).get(e)??[];s.push(t),G(this,k).set(e,s),this.notify({type:"added",mutation:t})}remove(t){var e;const s=Pt(t);if(G(this,k).has(s)){const i=null==(e=G(this,k).get(s))?void 0:e.filter((e=>e!==t));i&&(0===i.length?G(this,k).delete(s):G(this,k).set(s,i))}this.notify({type:"removed",mutation:t})}canRun(t){var e;const s=null==(e=G(this,k).get(Pt(t)))?void 0:e.find((t=>"pending"===t.state.status));return!s||s===t}runNext(t){var e;const s=null==(e=G(this,k).get(Pt(t)))?void 0:e.find((e=>e!==t&&e.state.isPaused));return(null==s?void 0:s.continue())??Promise.resolve()}clear(){mt.batch((()=>{this.getAll().forEach((t=>{this.remove(t)}))}))}getAll(){return[...G(this,k).values()].flat()}find(t){const e={exact:!0,...t};return this.getAll().find((t=>X(e,t)))}findAll(t={}){return this.getAll().filter((e=>X(t,e)))}notify(t){mt.batch((()=>{this.listeners.forEach((e=>{e(t)}))}))}resumePausedMutations(){const t=this.getAll().filter((t=>t.state.isPaused));return mt.batch((()=>Promise.all(t.map((t=>t.continue().catch(z))))))}},k=new WeakMap,A=new WeakMap,E);function Pt(t){var e;return(null==(e=t.options.scope)?void 0:e.id)??String(t.mutationId)}function qt(t){return{onFetch:(e,s)=>{var i,n,r,a,o;const u=e.options,l=null==(r=null==(n=null==(i=e.fetchOptions)?void 0:i.meta)?void 0:n.fetchMore)?void 0:r.direction,h=(null==(a=e.state.data)?void 0:a.pages)||[],c=(null==(o=e.state.data)?void 0:o.pageParams)||[];let d={pages:[],pageParams:[]},f=0;const p=async()=>{let s=!1;const i=lt(e.options,e.fetchOptions),n=async(t,n,r)=>{if(s)return Promise.reject();if(null==n&&t.pages.length)return Promise.resolve(t);const a={queryKey:e.queryKey,pageParam:n,direction:r?"backward":"forward",meta:e.options.meta};var o;o=a,Object.defineProperty(o,"signal",{enumerable:!0,get:()=>(e.signal.aborted?s=!0:e.signal.addEventListener("abort",(()=>{s=!0})),e.signal)});const u=await i(a),{maxPages:l}=e.options,h=r?ot:at;return{pages:h(t.pages,u,l),pageParams:h(t.pageParams,n,l)}};if(l&&h.length){const t="backward"===l,e={pages:h,pageParams:c},s=(t?Ft:St)(u,e);d=await n(e,s,t)}else{const e=t??h.length;do{const t=0===f?c[0]??u.initialPageParam:St(u,d);if(f>0&&null==t)break;d=await n(d,t),f++}while(f<e)}return d};e.options.persister?e.fetchFn=()=>{var t,i;return null==(i=(t=e.options).persister)?void 0:i.call(t,p,{queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},s)}:e.fetchFn=p}}}function St(t,{pages:e,pageParams:s}){const i=e.length-1;return e.length>0?t.getNextPageParam(e[i],e,s[i],s):void 0}function Ft(t,{pages:e,pageParams:s}){var i;return e.length>0?null==(i=t.getPreviousPageParam)?void 0:i.call(t,e[0],e,s[0],s):void 0}var kt=(j=class{constructor(t={}){L(this,C),L(this,D),L(this,Q),L(this,R),L(this,x),L(this,K),L(this,W),L(this,T),I(this,C,t.queryCache||new wt),I(this,D,t.mutationCache||new Mt),I(this,Q,t.defaultOptions||{}),I(this,R,new Map),I(this,x,new Map),I(this,K,0)}mount(){N(this,K)._++,1===G(this,K)&&(I(this,W,ht.subscribe((async t=>{t&&(await this.resumePausedMutations(),G(this,C).onFocus())}))),I(this,T,ct.subscribe((async t=>{t&&(await this.resumePausedMutations(),G(this,C).onOnline())}))))}unmount(){var t,e;N(this,K)._--,0===G(this,K)&&(null==(t=G(this,W))||t.call(this),I(this,W,void 0),null==(e=G(this,T))||e.call(this),I(this,T,void 0))}isFetching(t){return G(this,C).findAll({...t,fetchStatus:"fetching"}).length}isMutating(t){return G(this,D).findAll({...t,status:"pending"}).length}getQueryData(t){var e;const s=this.defaultQueryOptions({queryKey:t});return null==(e=G(this,C).get(s.queryHash))?void 0:e.state.data}ensureQueryData(t){const e=this.getQueryData(t.queryKey);if(void 0===e)return this.fetchQuery(t);{const s=this.defaultQueryOptions(t),i=G(this,C).build(this,s);return t.revalidateIfStale&&i.isStaleByTime(J(s.staleTime,i))&&this.prefetchQuery(s),Promise.resolve(e)}}getQueriesData(t){return G(this,C).findAll(t).map((({queryKey:t,state:e})=>[t,e.data]))}setQueryData(t,e,s){const i=this.defaultQueryOptions({queryKey:t}),n=G(this,C).get(i.queryHash),r=function(t,e){return"function"==typeof t?t(e):t}(e,null==n?void 0:n.state.data);if(void 0!==r)return G(this,C).build(this,i).setData(r,{...s,manual:!0})}setQueriesData(t,e,s){return mt.batch((()=>G(this,C).findAll(t).map((({queryKey:t})=>[t,this.setQueryData(t,e,s)]))))}getQueryState(t){var e;const s=this.defaultQueryOptions({queryKey:t});return null==(e=G(this,C).get(s.queryHash))?void 0:e.state}removeQueries(t){const e=G(this,C);mt.batch((()=>{e.findAll(t).forEach((t=>{e.remove(t)}))}))}resetQueries(t,e){const s=G(this,C),i={type:"active",...t};return mt.batch((()=>(s.findAll(t).forEach((t=>{t.reset()})),this.refetchQueries(i,e))))}cancelQueries(t={},e={}){const s={revert:!0,...e},i=mt.batch((()=>G(this,C).findAll(t).map((t=>t.cancel(s)))));return Promise.all(i).then(z).catch(z)}invalidateQueries(t={},e={}){return mt.batch((()=>{if(G(this,C).findAll(t).forEach((t=>{t.invalidate()})),"none"===t.refetchType)return Promise.resolve();const s={...t,type:t.refetchType??t.type??"active"};return this.refetchQueries(s,e)}))}refetchQueries(t={},e){const s={...e,cancelRefetch:(null==e?void 0:e.cancelRefetch)??!0},i=mt.batch((()=>G(this,C).findAll(t).filter((t=>!t.isDisabled())).map((t=>{let e=t.fetch(void 0,s);return s.throwOnError||(e=e.catch(z)),"paused"===t.state.fetchStatus?Promise.resolve():e}))));return Promise.all(i).then(z)}fetchQuery(t){const e=this.defaultQueryOptions(t);void 0===e.retry&&(e.retry=!1);const s=G(this,C).build(this,e);return s.isStaleByTime(J(e.staleTime,s))?s.fetch(e):Promise.resolve(s.state.data)}prefetchQuery(t){return this.fetchQuery(t).then(z).catch(z)}fetchInfiniteQuery(t){return t.behavior=qt(t.pages),this.fetchQuery(t)}prefetchInfiniteQuery(t){return this.fetchInfiniteQuery(t).then(z).catch(z)}ensureInfiniteQueryData(t){return t.behavior=qt(t.pages),this.ensureQueryData(t)}resumePausedMutations(){return ct.isOnline()?G(this,D).resumePausedMutations():Promise.resolve()}getQueryCache(){return G(this,C)}getMutationCache(){return G(this,D)}getDefaultOptions(){return G(this,Q)}setDefaultOptions(t){I(this,Q,t)}setQueryDefaults(t,e){G(this,R).set(Z(t),{queryKey:t,defaultOptions:e})}getQueryDefaults(t){const e=[...G(this,R).values()];let s={};return e.forEach((e=>{tt(t,e.queryKey)&&(s={...s,...e.defaultOptions})})),s}setMutationDefaults(t,e){G(this,x).set(Z(t),{mutationKey:t,defaultOptions:e})}getMutationDefaults(t){const e=[...G(this,x).values()];let s={};return e.forEach((e=>{tt(t,e.mutationKey)&&(s={...s,...e.defaultOptions})})),s}defaultQueryOptions(t){if(t._defaulted)return t;const e={...G(this,Q).queries,...this.getQueryDefaults(t.queryKey),...t,_defaulted:!0};return e.queryHash||(e.queryHash=Y(e.queryKey,e)),void 0===e.refetchOnReconnect&&(e.refetchOnReconnect="always"!==e.networkMode),void 0===e.throwOnError&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),!0!==e.enabled&&e.queryFn===ut&&(e.enabled=!1),e}defaultMutationOptions(t){return(null==t?void 0:t._defaulted)?t:{...G(this,Q).mutations,...(null==t?void 0:t.mutationKey)&&this.getMutationDefaults(t.mutationKey),...t,_defaulted:!0}}clear(){G(this,C).clear(),G(this,D).clear()}},C=new WeakMap,D=new WeakMap,Q=new WeakMap,R=new WeakMap,x=new WeakMap,K=new WeakMap,W=new WeakMap,T=new WeakMap,j);export{kt as Q};
//# sourceMappingURL=vendor-tanstack.WQnJHhgX.js.map
