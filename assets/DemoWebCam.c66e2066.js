import{v as t,x as e,e as n,f as o,j as s,D as a}from"./vendor.4ddb5e7f.js";const i=document.createElement("template");i.innerHTML='\n<style>\nbody {\n  background-color: #F0F0F0;\n}\n.container{\n  position: relative;\n  width: 320px;\n  height: 240px;\n}\n.container>.button2 {\n  background: url(\'http://cdn1.iconfinder.com/data/icons/iconslandplayer/PNG/64x64/CircleBlue/Play1Pressed.png\') center center no-repeat;\n  height: 64px;\n  left: 50%;\n  margin: -32px 0 0 -32px;\n  position: absolute;\n  top: 50%;\n  width: 64px;\n  z-index: 1; \n}\n\n.container>slot>.button {\n  top: 5%;\n  right: 5%;\n  position: absolute;\n  z-index: 1; \n}\n\n::slotted(button) {\n  top: var(--vcxwc-web-cam-top, 25%);\n  right: var(--vcxwc-web-cam-top, 25%);\n  position: absolute;\n  z-index: 1; \n}\n\n#video {\n  background-color: #000000;\n}\n#snap {\n  display: block;\n}\n#unsnap {\n  display: none;\n}\n\n</style>\n<div class="container">\n  <video id="video" width="320" height="240" autoplay></video>\n  <slot name="button-snap">\n    <button class="button" id="snap">Take Photo</button>\n  </slot>\n  <slot name="button-unsnap">\n    <button class="button" id="unsnap">Start Camera</button>\n  </slot>\n</div>\n';class c extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}).appendChild(i.content.cloneNode(!0)),this.capture=this.capture.bind(this),this.slotNode={"button-snap":this.shadowRoot.querySelector("#snap"),"button-unsnap":this.shadowRoot.querySelector("#unsnap")};const t=this.shadowRoot.querySelectorAll("slot"),e={};t.forEach((t=>{e[t.name]=t,t.addEventListener("slotchange",(e=>{if(this.slotNode[t.name]){const e=t.assignedNodes()[0];this.slotNode[t.name].removeEventListener("click",this.capture),this.slotNode[t.name]=e,"button-snap"===t.name&&(this.slotNode[t.name].style.display="block"),"button-unsnap"===t.name&&(this.slotNode[t.name].style.display="none"),this.slotNode[t.name].addEventListener("click",this.capture)}}))})),console.log(e)}static get observedAttributes(){return["show"]}get show(){return this.hasAttribute("show")}set show(t){t?this.setAttribute("show",""):this.removeAttribute("show")}connectedCallback(){console.log("connected"),console.log("width",this.getAttribute("width")),console.log("height",this.getAttribute("height")),this.width=this.getAttribute("width")||320,this.height=this.getAttribute("height")||240,this.slotNode["button-snap"].addEventListener("click",this.capture),this.slotNode["button-unsnap"].addEventListener("click",this.capture);const t=this.shadowRoot.querySelector(".container");t.style.width=this.width+"px",t.style.height=this.height+"px";const e=this.shadowRoot.querySelector("#video");navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&navigator.mediaDevices.getUserMedia({video:!0}).then((t=>{try{e.srcObject=t}catch(n){e.src=window.URL.createObjectURL(t)}e.play()})),e.setAttribute("width",this.width),e.setAttribute("height",this.height),this.captureMode=!0}attributeChangedCallback(t,e,n){}adoptedCallback(){}disconnectedCallback(){this.slotNode["button-snap"].removeEventListener("click",this.capture),this.slotNode["button-unsnap"].removeEventListener("click",this.capture)}capture(){console.log("capture event");const t=this.shadowRoot.querySelector("#video");if(this.captureMode){const e=1,n=document.createElement("canvas");n.width=t.clientWidth*e,n.height=t.clientHeight*e,n.getContext("2d").drawImage(t,0,0,n.width,n.height),t.pause(),this.slotNode["button-snap"].style.display="none",this.slotNode["button-unsnap"].style.display="block";const o=new CustomEvent("snap",{detail:n.toDataURL("image/png")});this.dispatchEvent(o),this.captureMode=!1}else t.play(),this.captureMode=!0,this.slotNode["button-snap"].style.display="block",this.slotNode["button-unsnap"].style.display="none"}}customElements.define("vcxwc-web-cam",c);const d={name:"WebCam",setup:()=>({snappedFn:t=>{alert("see console log for snapped picture data"),console.log("snappedFn",t.detail)}})},l=a("data-v-5ab013b4");t("data-v-5ab013b4");const h={class:"container"},r=s("h1",null,"Web Cam Custom Element",-1),p=s("button",{slot:"button-snap",class:"button",id:"snap"},"Take Photo",-1),u=s("button",{slot:"button-unsnap",class:"button",id:"unsnap"},"Start Camera",-1);e();const b=l(((t,e,a,i,c,d)=>(n(),o("div",h,[r,s("vcxwc-web-cam",{onSnap:e[1]||(e[1]=(...t)=>i.snappedFn&&i.snappedFn(...t)),width:"320",height:"240"},[p,u],32)]))));d.render=b,d.__scopeId="data-v-5ab013b4";export default d;
