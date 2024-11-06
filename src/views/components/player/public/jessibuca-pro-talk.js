!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self)["jessibuca-talk"]=t()}(this,(function(){"use strict";class e{on(e,t,i){const s=this.e||(this.e={});return(s[e]||(s[e]=[])).push({fn:t,ctx:i}),this}once(e,t,i){const s=this;function r(){s.off(e,r);for(var o=arguments.length,n=new Array(o),a=0;a<o;a++)n[a]=arguments[a];t.apply(i,n)}return r._=t,this.on(e,r,i)}emit(e){const t=((this.e||(this.e={}))[e]||[]).slice();for(var i=arguments.length,s=new Array(i>1?i-1:0),r=1;r<i;r++)s[r-1]=arguments[r];for(let e=0;e<t.length;e+=1)t[e].fn.apply(t[e].ctx,s);return this}off(e,t){const i=this.e||(this.e={});if(!e)return Object.keys(i).forEach((e=>{delete i[e]})),void delete this.e;const s=i[e],r=[];if(s&&t)for(let e=0,i=s.length;e<i;e+=1)s[e].fn!==t&&s[e].fn._!==t&&r.push(s[e]);return r.length?i[e]=r:delete i[e],this}}const t="debug",i="warn",s="talkGetUserMediaSuccess",r="talkGetUserMediaFail",o="talkGetUserMediaTimeout",n="talkStreamStart",a="talkStreamOpen",l="talkStreamClose",h="talkStreamError",u="talkStreamInactive",c="talkFailedAndStop",d={talkStreamClose:l,talkStreamError:h,talkStreamInactive:u,talkGetUserMediaTimeout:o,talkFailedAndStop:c},p={playError:"playIsNotPauseOrUrlIsNull",fetchError:"fetchError",websocketError:"websocketError",webcodecsH265NotSupport:"webcodecsH265NotSupport",webcodecsDecodeError:"webcodecsDecodeError",webcodecsUnsupportedConfigurationError:"webcodecsUnsupportedConfigurationError",webcodecsDecodeConfigureError:"webcodecsDecodeConfigureError",mediaSourceH265NotSupport:"mediaSourceH265NotSupport",mediaSourceAudioG711NotSupport:"mediaSourceAudioG711NotSupport",mediaSourceAudioInitTimeout:"mediaSourceAudioInitTimeout",mediaSourceAudioNoDataTimeout:"mediaSourceAudioNoDataTimeout",mediaSourceDecoderConfigurationError:"mediaSourceDecoderConfigurationError",mediaSourceFull:"mseSourceBufferFull",mseSourceBufferError:"mseSourceBufferError",mseAddSourceBufferError:"mseAddSourceBufferError",mediaSourceAppendBufferError:"mediaSourceAppendBufferError",mediaSourceTsIsMaxDiff:"mediaSourceTsIsMaxDiff",mediaSourceUseCanvasRenderPlayFailed:"mediaSourceUseCanvasRenderPlayFailed",mediaSourceBufferedIsZeroError:"mediaSourceBufferedIsZeroError",wasmDecodeError:"wasmDecodeError",wasmUseVideoRenderError:"wasmUseVideoRenderError",hlsError:"hlsError",webrtcError:"webrtcError",webrtcClosed:"webrtcClosed",webrtcIceCandidateError:"webrtcIceCandidateError",webglAlignmentError:"webglAlignmentError",wasmWidthOrHeightChange:"wasmWidthOrHeightChange",mseWidthOrHeightChange:"mseWidthOrHeightChange",wcsWidthOrHeightChange:"wcsWidthOrHeightChange",widthOrHeightChange:"widthOrHeightChange",tallWebsocketClosedByError:"tallWebsocketClosedByError",flvDemuxBufferSizeTooLarge:"flvDemuxBufferSizeTooLarge",wasmDecodeVideoNoResponseError:"wasmDecodeVideoNoResponseError",audioChannelError:"audioChannelError",simdH264DecodeVideoWidthIsTooLarge:"simdH264DecodeVideoWidthIsTooLarge",simdDecodeError:"simdDecodeError",webglContextLostError:"webglContextLostError",videoElementPlayingFailed:"videoElementPlayingFailed",videoElementPlayingFailedForWebrtc:"videoElementPlayingFailedForWebrtc",decoderWorkerInitError:"decoderWorkerInitError",videoInfoError:"videoInfoError",videoCodecIdError:"videoCodecIdError",streamEnd:"streamEnd",websocket1006Error:"websocket1006Error",delayTimeout:"delayTimeout",loadingTimeout:"loadingTimeout",networkDelayTimeout:"networkDelayTimeout",aliyunRtcError:"aliyunRtcError",...{talkStreamError:h,talkStreamClose:l}},f="notConnect",m="open",g="close",w="error",k="g711a",T="g711u",b="pcm",_="opus",S=8,y=0,E=98,A="empty",v="rtp",M="tcp",G="open",U="close",B="error",L="message",R="worklet",F="script",C={encType:k,packetType:v,packetTcpSendType:M,rtpSsrc:"0000000000",numberChannels:1,sampleRate:8e3,sampleBitsWidth:16,sendInterval:20,debug:!1,debugLevel:i,testMicrophone:!1,saveToTempFile:!1,audioBufferLength:160,engine:R,checkGetUserMediaTimeout:!1,getUserMediaTimeout:1e4,audioConstraints:{latency:!0,noiseSuppression:!0,autoGainControl:!0,echoCancellation:!0,sampleRate:48e3,channelCount:1}};function N(){return(new Date).getTime()}function W(e){let t="";if("object"==typeof e)try{t=JSON.stringify(e),t=JSON.parse(t)}catch(i){t=e}else t=e;return t}function x(e){return!0===e||"true"===e}(function(e,t){return e(t={exports:{}},t.exports),t.exports})((function(e){!function(){var t="undefined"!=typeof window&&void 0!==window.document?window.document:{},i=e.exports,s=function(){for(var e,i=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],s=0,r=i.length,o={};s<r;s++)if((e=i[s])&&e[1]in t){for(s=0;s<e.length;s++)o[i[0][s]]=e[s];return o}return!1}(),r={change:s.fullscreenchange,error:s.fullscreenerror},o={request:function(e,i){return new Promise(function(r,o){var n=function(){this.off("change",n),r()}.bind(this);this.on("change",n);var a=(e=e||t.documentElement)[s.requestFullscreen](i);a instanceof Promise&&a.then(n).catch(o)}.bind(this))},exit:function(){return new Promise(function(e,i){if(this.isFullscreen){var r=function(){this.off("change",r),e()}.bind(this);this.on("change",r);var o=t[s.exitFullscreen]();o instanceof Promise&&o.then(r).catch(i)}else e()}.bind(this))},toggle:function(e,t){return this.isFullscreen?this.exit():this.request(e,t)},onchange:function(e){this.on("change",e)},onerror:function(e){this.on("error",e)},on:function(e,i){var s=r[e];s&&t.addEventListener(s,i,!1)},off:function(e,i){var s=r[e];s&&t.removeEventListener(s,i,!1)},raw:s};s?(Object.defineProperties(o,{isFullscreen:{get:function(){return Boolean(t[s.fullscreenElement])}},element:{enumerable:!0,get:function(){return t[s.fullscreenElement]}},isEnabled:{enumerable:!0,get:function(){return Boolean(t[s.fullscreenEnabled])}}}),i?e.exports=o:window.screenfull=o):i?e.exports={isEnabled:!1}:window.screenfull={isEnabled:!1}}()})).isEnabled,(()=>{try{if("object"==typeof WebAssembly&&"function"==typeof WebAssembly.instantiate){const e=new WebAssembly.Module(Uint8Array.of(0,97,115,109,1,0,0,0));if(e instanceof WebAssembly.Module)return new WebAssembly.Instance(e)instanceof WebAssembly.Instance}}catch(e){}})();class O{constructor(e){const{fromSampleRate:t,toSampleRate:i,channels:s,inputBufferSize:r}=e;if(!t||!i||!s)throw new Error("Invalid settings specified for the resampler.");this.resampler=null,this.fromSampleRate=t,this.toSampleRate=i,this.channels=s||0,this.inputBufferSize=r,this.initialize()}initialize(){this.fromSampleRate==this.toSampleRate?(this.resampler=e=>e,this.ratioWeight=1):(this.fromSampleRate<this.toSampleRate?(this.linearInterpolation(),this.lastWeight=1):(this.multiTap(),this.tailExists=!1,this.lastWeight=0),this.initializeBuffers(),this.ratioWeight=this.fromSampleRate/this.toSampleRate)}bufferSlice(e){try{return this.outputBuffer.subarray(0,e)}catch(t){try{return this.outputBuffer.length=e,this.outputBuffer}catch(t){return this.outputBuffer.slice(0,e)}}}initializeBuffers(){this.outputBufferSize=Math.ceil(this.inputBufferSize*this.toSampleRate/this.fromSampleRate/this.channels*1.0000004768371582)+this.channels+this.channels;try{this.outputBuffer=new Float32Array(this.outputBufferSize),this.lastOutput=new Float32Array(this.channels)}catch(e){this.outputBuffer=[],this.lastOutput=[]}}linearInterpolation(){this.resampler=e=>{let t,i,s,r,o,n,a,l,h,u=e.length,c=this.channels;if(u%c!=0)throw new Error("Buffer was of incorrect sample length.");if(u<=0)return[];for(t=this.outputBufferSize,i=this.ratioWeight,s=this.lastWeight,r=0,o=0,n=0,a=0,l=this.outputBuffer;s<1;s+=i)for(o=s%1,r=1-o,this.lastWeight=s%1,h=0;h<this.channels;++h)l[a++]=this.lastOutput[h]*r+e[h]*o;for(s-=1,u-=c,n=Math.floor(s)*c;a<t&&n<u;){for(o=s%1,r=1-o,h=0;h<this.channels;++h)l[a++]=e[n+(h>0?h:0)]*r+e[n+(c+h)]*o;s+=i,n=Math.floor(s)*c}for(h=0;h<c;++h)this.lastOutput[h]=e[n++];return this.bufferSlice(a)}}multiTap(){this.resampler=e=>{let t,i,s,r,o,n,a,l,h,u,c,d=e.length,p=this.channels;if(d%p!=0)throw new Error("Buffer was of incorrect sample length.");if(d<=0)return[];for(t=this.outputBufferSize,i=[],s=this.ratioWeight,r=0,n=0,a=0,l=!this.tailExists,this.tailExists=!1,h=this.outputBuffer,u=0,c=0,o=0;o<p;++o)i[o]=0;do{if(l)for(r=s,o=0;o<p;++o)i[o]=0;else{for(r=this.lastWeight,o=0;o<p;++o)i[o]=this.lastOutput[o];l=!0}for(;r>0&&n<d;){if(a=1+n-c,!(r>=a)){for(o=0;o<p;++o)i[o]+=e[n+(o>0?o:0)]*r;c+=r,r=0;break}for(o=0;o<p;++o)i[o]+=e[n++]*a;c=n,r-=a}if(0!==r){for(this.lastWeight=r,o=0;o<p;++o)this.lastOutput[o]=i[o];this.tailExists=!0;break}for(o=0;o<p;++o)h[u++]=i[o]/s}while(n<d&&u<t);return this.bufferSlice(u)}}resample(e){return this.fromSampleRate==this.toSampleRate?this.ratioWeight=1:(this.fromSampleRate<this.toSampleRate?this.lastWeight=1:(this.tailExists=!1,this.lastWeight=0),this.initializeBuffers(),this.ratioWeight=this.fromSampleRate/this.toSampleRate),this.resampler(e)}}const P=[255,511,1023,2047,4095,8191,16383,32767];function I(e,t,i){for(let s=0;s<i;s++)if(e<=t[s])return s;return i}function D(e){const t=[];return Array.prototype.slice.call(e).forEach(((e,i)=>{t[i]=function(e){let t,i,s;return e>=0?t=213:(t=85,(e=-e-1)<0&&(e=32767)),i=I(e,P,8),i>=8?127^t:(s=i<<4,s|=i<2?e>>4&15:e>>i+3&15,s^t)}(e)})),t}function z(e){const t=[];return Array.prototype.slice.call(e).forEach(((e,i)=>{t[i]=function(e){let t=0;e<0?(e=132-e,t=127):(e+=132,t=255);let i=I(e,P,8);return i>=8?127^t:(i<<4|e>>i+3&15)^t}(e)})),t}class q{constructor(e){this.log=function(i){if(e._opt.debug&&e._opt.debugLevel==t){const t=e._opt.debugUuid?`[${e._opt.debugUuid}]`:"";for(var s=arguments.length,r=new Array(s>1?s-1:0),o=1;o<s;o++)r[o-1]=arguments[o];console.log(`JbPro${t}[✅✅✅][${i}]`,...r)}},this.warn=function(s){if(e._opt.debug&&(e._opt.debugLevel==t||e._opt.debugLevel==i)){const t=e._opt.debugUuid?`[${e._opt.debugUuid}]`:"";for(var r=arguments.length,o=new Array(r>1?r-1:0),n=1;n<r;n++)o[n-1]=arguments[n];console.log(`JbPro${t}[❗❗❗][${s}]`,...o)}},this.error=function(t){const i=e._opt.debugUuid?`[${e._opt.debugUuid}]`:"";for(var s=arguments.length,r=new Array(s>1?s-1:0),o=1;o<s;o++)r[o-1]=arguments[o];console.error(`JbPro${i}[❌❌❌][${t}]`,...r)}}}class j{constructor(e){this.destroys=[],this.proxy=this.proxy.bind(this),this.master=e}proxy(e,t,i){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};if(!e)return;if(Array.isArray(t))return t.map((t=>this.proxy(e,t,i,s)));e.addEventListener(t,i,s);const r=()=>{"function"==typeof e.removeEventListener&&e.removeEventListener(t,i,s)};return this.destroys.push(r),r}destroy(){this.master.debug&&this.master.debug.log("Events","destroy"),this.destroys.forEach((e=>e())),this.destroys=[]}}class $ extends e{constructor(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};super(),this._opt={},e&&(this.player=e),this.TAG_NAME="talk";const i=W(C);this._opt=Object.assign({},i,t),this._opt.sampleRate=parseInt(this._opt.sampleRate,10),this._opt.sampleBitsWidth=parseInt(this._opt.sampleBitsWidth,10),this.audioContext=null,this.gainNode=null,this.recorder=null,this.workletRecorder=null,this.biquadFilter=null,this.userMediaStream=null,this.clearWorkletUrlTimeout=null,this.bufferSize=512,this._opt.audioBufferLength=this.calcAudioBufferLength(),this.audioBufferList=[],this.socket=null,this.socketStatus=f,this.mediaStreamSource=null,this.heartInterval=null,this.checkGetUserMediaTimeout=null,this.wsUrl=null,this.startTimestamp=0,this.sequenceId=0,this.tempTimestamp=null,this.tempG711BufferList=[],this.tempRtpBufferList=[],this.tempPcmBufferList=[],this.events=new j(this),this._initTalk(),this.player||(this.debug=new q(this)),this._opt.encType!==k&&this._opt.encType!==T||8e3===this._opt.sampleRate&&16===this._opt.sampleBitsWidth||this.warn(this.TAG_NAME,`\n            encType is ${this._opt.encType} and sampleBitsWidth is ${this._opt.sampleBitsWidth}, set sampleBitsWidth to ${this._opt.sampleBitsWidth}。\n            ${this._opt.encType} only support sampleRate 8000 and sampleBitsWidth 16`),this.log(this.TAG_NAME,"init",JSON.stringify(this._opt))}destroy(){this.clearWorkletUrlTimeout&&(clearTimeout(this.clearWorkletUrlTimeout),this.clearWorkletUrlTimeout=null),this.userMediaStream&&(this.userMediaStream.getTracks&&this.userMediaStream.getTracks().forEach((e=>{e.stop()})),this.userMediaStream=null),this.mediaStreamSource&&(this.mediaStreamSource.disconnect(),this.mediaStreamSource=null),this.recorder&&(this.recorder.disconnect(),this.recorder.onaudioprocess=null,this.recorder=null),this.biquadFilter&&(this.biquadFilter.disconnect(),this.biquadFilter=null),this.gainNode&&(this.gainNode.disconnect(),this.gainNode=null),this.workletRecorder&&(this.workletRecorder.disconnect(),this.workletRecorder=null),this.socket&&(this.socketStatus===m&&this._sendClose(),this.socket.close(),this.socket=null),this._stopHeartInterval(),this._stopCheckGetUserMediaTimeout(),this.audioContext=null,this.gainNode=null,this.recorder=null,this.audioBufferList=[],this.sequenceId=0,this.wsUrl=null,this.tempTimestamp=null,this.tempRtpBufferList=[],this.tempG711BufferList=[],this.tempPcmBufferList=[],this.startTimestamp=0,this.log(this.TAG_NAME,"destroy")}addRtpToBuffer(e){const t=e.length+this.tempRtpBufferList.length,i=new Uint8Array(t);i.set(this.tempRtpBufferList,0),i.set(e,this.tempRtpBufferList.length),this.tempRtpBufferList=i}addG711ToBuffer(e){const t=e.length+this.tempG711BufferList.length,i=new Uint8Array(t);i.set(this.tempG711BufferList,0),i.set(e,this.tempG711BufferList.length),this.tempG711BufferList=i}addPcmToBuffer(e){const t=e.length+this.tempPcmBufferList.length,i=new Uint8Array(t);i.set(this.tempPcmBufferList,0),i.set(e,this.tempPcmBufferList.length),this.tempG711ButempPcmBufferListfferList=i}downloadRtpFile(){this.debug.log(this.TAG_NAME,"downloadRtpFile");const e=new Blob([this.tempRtpBufferList]);try{const t=document.createElement("a");t.href=window.URL.createObjectURL(e),t.download=Date.now()+".rtp",t.click(),window.URL.revokeObjectURL(t.href)}catch(e){console.error("downloadRtpFile",e)}}downloadG711File(){this.debug.log(this.TAG_NAME,"downloadG711File");const e=new Blob([this.tempG711BufferList]);try{const t=document.createElement("a");t.href=window.URL.createObjectURL(e),t.download=Date.now()+"."+this._opt.encType,t.click(),window.URL.revokeObjectURL(t.href)}catch(e){console.error("downloadG711File",e)}}downloadPcmFile(){this.debug.log(this.TAG_NAME,"downloadPcmFile");const e=new Blob([this.tempPcmBufferList]);try{const t=document.createElement("a");t.href=window.URL.createObjectURL(e),t.download=Date.now()+"."+this._opt.encType,t.click(),window.URL.revokeObjectURL(t.href)}catch(e){console.error("downloadRtpFile",e)}}downloadFile(){this._opt.packetType===v?this.downloadRtpFile():this._opt.encType===k||this._opt.encType===T?this.downloadG711File():this.downloadPcmFile()}calcAudioBufferLength(){const{sampleRate:e,sampleBitsWidth:t}=this._opt;return 8*e*.02/8}get socketStatusOpen(){return this.socketStatus===m}log(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];this._log("log",...t)}warn(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];this._log("warn",...t)}error(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];this._log("error",...t)}_log(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),s=1;s<t;s++)i[s-1]=arguments[s];this.player?this.player.debug[e](...i):this.debug?this.debug[e](...i):console[e](...i)}_getSequenceId(){return++this.sequenceId}_createWebSocket(){return new Promise(((e,t)=>{const i=this.events.proxy;this.socket=new WebSocket(this.wsUrl),this.socket.binaryType="arraybuffer",this.emit(n),i(this.socket,G,(()=>{this.socketStatus=m,this.log(this.TAG_NAME,"websocket open -> do talk"),this.emit(a),e(),this._doTalk()})),i(this.socket,L,(e=>{this.log(this.TAG_NAME,"websocket message",e.data)})),i(this.socket,U,(e=>{this.socketStatus=g,this.warn(this.TAG_NAME,"websocket close -> reject",e),this.emit(l),t(e)})),i(this.socket,B,(e=>{this.socketStatus=w,this.error(this.TAG_NAME,"websocket error -> reject",e),this.emit(h,e),t(e)}))}))}_sendClose(){}_initTalk(){this._initMethods(),this._opt.engine===R?this._initWorklet():this._opt.engine===F&&this._initScriptProcessor(),this.log(this.TAG_NAME,"audioContext samplerate",this.audioContext.sampleRate)}_initMethods(){this.audioContext=new(window.AudioContext||window.webkitAudioContext)({sampleRate:48e3}),this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=1,this.biquadFilter=this.audioContext.createBiquadFilter(),this.biquadFilter.type="lowpass",this.biquadFilter.frequency.value=3e3,this.resampler=new O({fromSampleRate:this.audioContext.sampleRate,toSampleRate:this._opt.sampleRate,channels:this._opt.numberChannels,inputBufferSize:this.bufferSize})}_initScriptProcessor(){const e=this.audioContext.createScriptProcessor||this.audioContext.createJavaScriptNode;this.recorder=e.apply(this.audioContext,[this.bufferSize,this._opt.numberChannels,this._opt.numberChannels]),this.recorder.onaudioprocess=e=>this._onaudioprocess(e)}_initWorklet(){const e=function(e){const t=e.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1],i=new Blob([t],{type:"application/javascript"});return URL.createObjectURL(i)}((function(){class e extends AudioWorkletProcessor{constructor(e){super(),this._cursor=0,this._bufferSize=e.processorOptions.bufferSize,this._buffer=new Float32Array(this._bufferSize)}process(e,t,i){if(!e.length||!e[0].length)return!0;for(let t=0;t<e[0][0].length;t++)this._cursor+=1,this._cursor===this._bufferSize&&(this._cursor=0,this.port.postMessage({eventType:"data",buffer:this._buffer})),this._buffer[this._cursor]=e[0][0][t];return!0}}registerProcessor("talk-processor",e)}));this.audioContext.audioWorklet&&this.audioContext.audioWorklet.addModule(e).then((()=>{const e=new AudioWorkletNode(this.audioContext,"talk-processor",{processorOptions:{bufferSize:this.bufferSize}});e.connect(this.gainNode),e.port.onmessage=e=>{"data"===e.data.eventType&&this._encodeAudioData(e.data.buffer)},this.workletRecorder=e})),this.clearWorkletUrlTimeout=setTimeout((()=>{URL.revokeObjectURL(e),this.clearWorkletUrlTimeout=null}),1e4)}_onaudioprocess(e){const t=e.inputBuffer.getChannelData(0);this._encodeAudioData(new Float32Array(t))}_encodeAudioData(e){if(0===e[0]&&0===e[1])return void this.log(this.TAG_NAME,"empty audio data");const t=this.resampler.resample(e);let i=t;if(16===this._opt.sampleBitsWidth?i=function(e){let t=e.length,i=new Int16Array(t);for(;t--;){let s=Math.max(-1,Math.min(1,e[t]));i[t]=s<0?32768*s:32767*s}return i}(t):8===this._opt.sampleBitsWidth&&(i=function(e){let t=e.length,i=new Int8Array(t);for(;t--;){let s=Math.max(-1,Math.min(1,e[t]));const r=s<0?32768*s:32767*s;i[t]=parseInt(255/(65535/(32768+r)),10)}return i}(t)),null!==i.buffer){let e=null;this._opt.encType===k?e=D(i):this._opt.encType===T?e=z(i):this._opt.encType===b&&(e=i);const t=new Uint8Array(e);for(let e=0;e<t.length;e++){let i=this.audioBufferList.length;this.audioBufferList[i++]=t[e],this.audioBufferList.length===this._opt.audioBufferLength&&(this._sendTalkMsg(new Uint8Array(this.audioBufferList)),this.audioBufferList=[])}}}_parseAudioMsg(e){let t=null;return this._opt.packetType!==v||this._opt.encType!==k&&this._opt.encType!==T?this._opt.packetType===A&&(t=e):t=this.rtpPacket(e),t}rtpPacket(e){const t=[];let i=0,s=0,r=0;const o=this._opt.rtpSsrc,n=e.length;this._opt.encType===k?i=S:this._opt.encType===T?i=y:this._opt.encType===_&&(i=E),this.startTimestamp||(this.startTimestamp=N()),r=N()-this.startTimestamp,s=this._getSequenceId();let a=0;if(this._opt.packetTcpSendType===M){const e=n+12;t[a++]=255&e>>8,t[a++]=255&e>>0}t[a++]=128,t[a++]=128+i,t[a++]=s/256,t[a++]=s%256,t[a++]=r/65536/256,t[a++]=r/65536%256,t[a++]=r%65536/256,t[a++]=r%65536%256,t[a++]=o/65536/256,t[a++]=o/65536%256,t[a++]=o%65536/256,t[a++]=o%65536%256;let l=t.concat([...e]),h=new Uint8Array(l.length);for(let e=0;e<l.length;e++)h[e]=l[e];return h}opusPacket(e){return e}_sendTalkMsg(e){null===this.tempTimestamp&&(this.tempTimestamp=N());const t=N(),i=t-this.tempTimestamp,s=this._parseAudioMsg(e);this.log(this.TAG_NAME,`send talk msg and diff is ${i} and byteLength is ${s.byteLength} and length is ${s.length}, and ${this._opt.encType} length is ${e.length}`),x(this._opt.saveToTempFile)&&x(this._opt.debug)&&(this._opt.packetType===v?this.addRtpToBuffer(s):this._opt.encType===k||this._opt.encType===T?this.addG711ToBuffer(s):this.addPcmToBuffer(s)),s&&(this.socketStatusOpen?this.socket.send(s.buffer):this.emit(p.tallWebsocketClosedByError)),this.tempTimestamp=t}_doTalk(){this._getUserMedia()}_getUserMedia(){this.log(this.TAG_NAME,"getUserMedia"),void 0===window.navigator.mediaDevices&&(window.navigator.mediaDevices={}),void 0===window.navigator.mediaDevices.getUserMedia&&(this.log(this.TAG_NAME,"window.navigator.mediaDevices.getUserMedia is undefined and init function"),window.navigator.mediaDevices.getUserMedia=function(e){var t=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;return t?new Promise((function(i,s){t.call(navigator,e,i,s)})):Promise.reject(new Error("getUserMedia is not implemented in this browser"))}),this._opt.checkGetUserMediaTimeout&&this._startCheckGetUserMediaTimeout(),window.navigator.mediaDevices.getUserMedia({audio:this._opt.audioConstraints,video:!1}).then((e=>{this.log(this.TAG_NAME,"getUserMedia success"),this.userMediaStream=e,this.mediaStreamSource=this.audioContext.createMediaStreamSource(e),this.mediaStreamSource.connect(this.biquadFilter),this.recorder?(this.biquadFilter.connect(this.recorder),this.recorder.connect(this.gainNode)):this.workletRecorder&&(this.biquadFilter.connect(this.workletRecorder),this.workletRecorder.connect(this.gainNode)),this.gainNode.connect(this.audioContext.destination),this.emit(s),null===e.oninactive&&(e.oninactive=e=>{this._handleStreamInactive(e)})})).catch((e=>{this.error(this.TAG_NAME,"getUserMedia error",e.toString()),this.emit(r,e.toString())})).finally((()=>{this.log(this.TAG_NAME,"getUserMedia finally"),this._stopCheckGetUserMediaTimeout()}))}_getUserMedia2(){this.log(this.TAG_NAME,"getUserMedia"),navigator.mediaDevices?navigator.mediaDevices.getUserMedia({audio:!0}).then((e=>{this.log(this.TAG_NAME,"getUserMedia2 success")})):navigator.getUserMedia({audio:!0},this.log(this.TAG_NAME,"getUserMedia2 success"),this.log(this.TAG_NAME,"getUserMedia2 fail"))}async _getUserMedia3(){this.log(this.TAG_NAME,"getUserMedia3");try{const e=await navigator.mediaDevices.getUserMedia({audio:{latency:!0,noiseSuppression:!0,autoGainControl:!0,echoCancellation:!0,sampleRate:48e3,channelCount:1},video:!1});console.log("getUserMedia() got stream:",e),this.log(this.TAG_NAME,"getUserMedia3 success")}catch(e){this.log(this.TAG_NAME,"getUserMedia3 fail")}}_handleStreamInactive(e){this.userMediaStream&&(this.warn(this.TAG_NAME,"stream oninactive",e),this.emit(u))}_startCheckGetUserMediaTimeout(){this._stopCheckGetUserMediaTimeout(),this.checkGetUserMediaTimeout=setTimeout((()=>{this.log(this.TAG_NAME,"check getUserMedia timeout"),this.emit(o)}),this._opt.getUserMediaTimeout)}_stopCheckGetUserMediaTimeout(){this.checkGetUserMediaTimeout&&(this.log(this.TAG_NAME,"stop checkGetUserMediaTimeout"),clearTimeout(this.checkGetUserMediaTimeout),this.checkGetUserMediaTimeout=null)}_startHeartInterval(){this.heartInterval=setInterval((()=>{this.log(this.TAG_NAME,"heart interval");let e=[35,36,0,0,0,0,0,0];e=new Uint8Array(e),this.socket.send(e.buffer)}),15e3)}_stopHeartInterval(){this.heartInterval&&(this.log(this.TAG_NAME,"stop heart interval"),clearInterval(this.heartInterval),this.heartInterval=null)}startTalk(e){return new Promise(((t,i)=>{if(!function(){let e=!1;const t=window.navigator;return t&&(e=!(!t.mediaDevices||!t.mediaDevices.getUserMedia),e||(e=!!(t.getUserMedia||t.webkitGetUserMedia||t.mozGetUserMedia||t.msGetUserMedia))),e}())return i("not support getUserMedia");if(this.wsUrl=e,this._opt.testMicrophone)this._doTalk();else{if(!this.wsUrl)return i("wsUrl is null");this._createWebSocket().catch((e=>{i(e)}))}this.once(r,(()=>{i("getUserMedia fail")})),this.once(s,(()=>{t()}))}))}setVolume(e){var t,i,s;(e=parseFloat(e).toFixed(2),isNaN(e))||(t=e,i=0,s=1,e=Math.max(Math.min(t,Math.max(i,s)),Math.min(i,s)),this.gainNode.gain.value=e)}getOption(){return this._opt}get volume(){return this.gainNode?parseFloat(100*this.gainNode.gain.value).toFixed(0):null}}class H extends e{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};super(),this.talk=null,this._opt=e,this.LOG_TAG="JbProTalk",this.debug=new q(this),this.debug.log(this.LOG_TAG,"init",JSON.stringify(e))}destroy(){this.debug.log(this.LOG_TAG,"destroy()"),this.off(),this.talk&&(this.talk.destroy(),this.talk=null),this.debug.log(this.LOG_TAG,"destroy")}_initTalk(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.talk&&(this.debug.log(this.LOG_TAG,"_initTalk this.talk is not null and destroy"),this.talk.destroy(),this.talk=null);const t=Object.assign({},W(this._opt),e);this.talk=new $(null,t),this.debug.log(this.LOG_TAG,"_initTalk",this.talk.getOption()),this._bindTalkEvents()}_bindTalkEvents(){Object.keys(d).forEach((e=>{this.talk.on(d[e],(t=>{this.emit(e,t)}))}))}startTalk(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return new Promise(((i,s)=>{this.debug.log(this.LOG_TAG,"startTalk",e,JSON.stringify(t)),this._initTalk(t),this.talk.startTalk(e).then((()=>{i(),this.talk.once(l,(()=>{this.debug.warn(this.LOG_TAG,"talkStreamClose -> stopTalk"),this.stopTalk().catch((e=>{this.debug.warn(this.LOG_TAG,"talkStreamClose stopTalk",e)})).finally((()=>{this.emit(c,l)}))})),this.talk.once(h,(e=>{this.debug.error(this.LOG_TAG,"talkStreamError -> stopTalk"),this.stopTalk().catch((e=>{this.debug.warn(this.LOG_TAG,"talkStreamError stopTalk",e)})).finally((()=>{this.emit(c,h)}))})),this.talk.once(u,(()=>{this.debug.warn(this.LOG_TAG,"talkStreamInactive -> stopTalk"),this.stopTalk().catch((e=>{this.debug.warn(this.LOG_TAG,"talkStreamInactive stopTalk",e)})).finally((()=>{this.emit(c,u)}))})),this.talk.once(o,(()=>{this.debug.warn(this.LOG_TAG,"talkGetUserMediaTimeout -> stopTalk"),this.stopTalk().catch((e=>{this.debug.warn(this.LOG_TAG,"talkGetUserMediaTimeout stopTalk",e)})).finally((()=>{this.emit(c,o)}))}))})).catch((e=>{s(e)}))}))}stopTalk(){return new Promise(((e,t)=>{this.debug.log(this.LOG_TAG,"stopTalk()"),this.talk||t("talk is not init"),this.talk.destroy(),this.talk=null,e()}))}getTalkVolume(){return new Promise(((e,t)=>{this.talk||t("talk is not init"),e(this.talk.volume)}))}setTalkVolume(e){return new Promise(((t,i)=>{this.debug.log(this.LOG_TAG,"setTalkVolume",e),this.talk||i("talk is not init"),this.talk.setVolume(e/100),t()}))}downloadTempRtpFile(){return new Promise(((e,t)=>{this.talk?(this.talk.downloadRtpFile(),e()):t("talk is not init")}))}downloadTempG711File(){return new Promise(((e,t)=>{this.talk?(this.talk.downloadG711File(),e()):t("talk is not init")}))}downloadTempPcmFile(){return new Promise(((e,t)=>{this.talk?(this.talk.downloadPcmFile(),e()):t("talk is not init")}))}downloadTempFile(){return new Promise(((e,t)=>{this.talk?(this.talk.downloadFile(),e()):t("talk is not init")}))}}return H.EVENTS=d,window.JessibucaProTalk=H,window.JbProTalk=H,window.WebPlayerProTalk=H,H}));
