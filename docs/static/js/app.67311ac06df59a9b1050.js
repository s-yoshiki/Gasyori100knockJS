webpackJsonp([1],{D2Rb:function(t,e){},JYbl:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("7+uW"),h={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("header",[e("div",{staticClass:"header-container"},[this._m(0),this._v(" "),e("router-link",{attrs:{to:"/list"}},[this._v("list")])],1)]),this._v(" "),e("router-view"),this._v(" "),e("footer")],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",[e("a",{staticClass:"title",attrs:{href:"#/"}},[this._v("画像処理100本ノックJS")])])}]};var n=a("VU/8")({name:"App"},h,!1,function(t){a("JYbl")},null,null).exports,s=a("/ocq");const r="<h3>Comming soon.</h3>",l='\n<div>\n<canvas ref="canvas-view-only"></canvas>\n&nbsp;\n<canvas ref="canvas"></canvas>\n<br>\n<button ref="button-run" class="bt">run</button>\n</div>\n',o='\n<div>\n<canvas ref="canvas-view-only"></canvas>\n&nbsp;\n<canvas ref="canvas1"></canvas>\n&nbsp;\n<canvas ref="canvas2"></canvas>\n<br>\n<button ref="button-run" class="bt">run</button>\n</div>\n';var d={srcImage:{default:"./static/imori.jpg",noise:"./static/imori_noise.jpg"}},g={drawImage(t,e){e.addEventListener("load",()=>{t.width=e.width,t.height=e.height,t.getContext("2d").drawImage(e,0,0,e.width,e.height)})}};class c{constructor(){}_initObject(t){}init(t){}main(){}setTemplate(t){this.template=t}getTemplate(){return this.template}}class m extends c{constructor(){super(),super.setTemplate(l),this.setSrcImage(d.srcImage.default)}init(t){}_initObject(t){let e=t.$refs["canvas-view-only"],a=t.$refs.canvas,i=t.$refs["button-run"],h=new Image;h.src=this.imageUrl,h.addEventListener("load",()=>{a.width=h.width,a.height=h.height}),g.drawImage(e,h),i.addEventListener("click",()=>{this.main(a,h)})}main(t,e){}setSrcImage(t){super.imageUrl=t}}class f extends c{constructor(){super(),super.setTemplate(o)}init(t){this.setSrcImage(d.srcImage.default)}_initObject(t){let e=t.$refs["canvas-view-only"],a=t.$refs.canvas1,i=t.$refs.canvas2,h=t.$refs["button-run"],n=new Image;n.src=this.imageUrl,n.addEventListener("load",()=>{a.width=i.width=n.width,a.height=i.height=n.height}),g.drawImage(e,n),h.addEventListener("click",()=>{this.main(a,i,n)})}main(t,e,a){}setSrcImage(t){super.imageUrl=t}}const w={ans1:new class extends m{main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);for(let t=0;t<i.data.length;t+=4)h.data[t]=i.data[t+2],h.data[t+1]=i.data[t+1],h.data[t+2]=i.data[t],h.data[t+3]=i.data[t+3];a.putImageData(h,0,0)}},ans2:new class extends m{main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);for(let t=0;t<i.data.length;t+=4){let e=.2126*i.data[t]+.7152*i.data[t+1]+.0722*i.data[t+2];e=parseInt(e,10),h.data[t]=e,h.data[t+1]=e,h.data[t+2]=e,h.data[t+3]=i.data[t+3]}a.putImageData(h,0,0)}},ans3:new class extends m{main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);for(let t=0;t<i.data.length;t+=4){let e=.2126*i.data[t]+.7152*i.data[t+1]+.0722*i.data[t+2];e=(e=parseInt(e,10))>128?255:0,h.data[t]=e,h.data[t+1]=e,h.data[t+2]=e,h.data[t+3]=i.data[t+3]}a.putImageData(h,0,0)}},ans5:new class extends m{rgb2hsv(t){let e=t[0]/255,a=t[1]/255,i=t[2]/255,h=Math.max(e,a,i),n=Math.min(e,a,i),s=h-n,r=0;switch(n){case h:r=0;break;case e:r=(i-a)/s*60+180;break;case a:r=(e-i)/s*60+300;break;case i:r=(a-e)/s*60+60}return[r,0==h?0:s/h,h]}hsv2rgb(t){let e,a,i,h=t[0],n=t[1],s=t[2],r=s*n,l=h/60,o=r*(1-Math.abs(l%2-1));0<=l&&l<1&&([e,a,i]=[r,o,0]),1<=l&&l<2&&([e,a,i]=[o,r,0]),2<=l&&l<3&&([e,a,i]=[0,r,o]),3<=l&&l<4&&([e,a,i]=[0,o,r]),4<=l&&l<5&&([e,a,i]=[o,0,r]),5<=l&&l<6&&([e,a,i]=[r,0,o]);let d=s-r;return[e,a,i]=[e+d,a+d,i+d],[e=Math.floor(255*e),a=Math.floor(255*a),i=Math.floor(255*i)]}main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);for(let t=0;t<i.data.length;t+=4){let e=i.data[t],a=i.data[t+1],n=i.data[t+2],s=this.rgb2hsv([e,a,n]);s[0]=(s[0]+180)%360;let r=this.hsv2rgb(s);h.data[t]=r[0],h.data[t+1]=r[1],h.data[t+2]=r[2],h.data[t+3]=i.data[t+3]}a.putImageData(h,0,0)}},ans6:new class extends m{main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height),n=[32,96,160,224];for(let t=0;t<i.data.length;t++){if(t%4==3){h.data[t]=i.data[t];continue}let e=Number.MAX_SAFE_INTEGER,a=0;for(let h in n){let s=Math.abs(i.data[t]-n[h]);s<e&&(e=s,a=h)}h.data[t]=n[a]}a.putImageData(h,0,0)}},ans7:new class extends m{main(t,e){let a=e.width/16,i=e.height/16;t.getContext("2d").drawImage(e,0,0,e.width,e.height);const h=(e,a,i,h)=>{let n,s,r,l=t.getContext("2d");n=s=r=0;for(var o=l.getImageData(e,a,i,h),d=l.createImageData(i,h),g=0;g<o.data.length;g+=4)n+=o.data[g],s+=o.data[g+1],r+=o.data[g+2];for(n/=o.data.length/4,s/=o.data.length/4,r/=o.data.length/4,n=Math.ceil(n),s=Math.ceil(s),r=Math.ceil(r),g=0;g<o.data.length;g+=4)d.data[g]=n,d.data[g+1]=s,d.data[g+2]=r,d.data[g+3]=255;l.putImageData(d,e,a)};for(let e=0;e<t.width;e+=a)for(let n=0;n<t.height;n+=i)h(e,n,a,i)}},ans8:new class extends m{main(t,e){let a=e.width/16,i=e.height/16;t.getContext("2d").drawImage(e,0,0,e.width,e.height);const h=(e,a,i,h)=>{let n,s,r,l=t.getContext("2d");n=s=r=0;for(var o=l.getImageData(e,a,i,h),d=l.createImageData(i,h),g=0;g<o.data.length;g+=4)n=o.data[g]>n?o.data[g]:n,s=o.data[g+1]>s?o.data[g+1]:s,r=o.data[g+2]>r?o.data[g+2]:r;for(g=0;g<o.data.length;g+=4)d.data[g]=n,d.data[g+1]=s,d.data[g+2]=r,d.data[g+3]=255;l.putImageData(d,e,a)};for(let e=0;e<t.width;e+=a)for(let n=0;n<t.height;n+=i)h(e,n,a,i)}},ans9:new class extends m{init(){this.setSrcImage(d.srcImage.noise)}main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);const n=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i),s=(t,e,a)=>Math.exp(-(t**2+e**2)/(2*a**2));let r=0,l=Array.from(new Array(3),()=>new Array(3).fill(0));for(let t=0;t<3;t++)for(let e=0;e<3;e++){let a=s(e-Math.floor(1.5),t-Math.floor(1.5),1.3);l[t][e]=a,l[t][e]/=1.3*Math.sqrt(2*Math.PI),r+=l[t][e]}for(let t=0;t<3;t++)for(let e=0;e<3;e++)l[t][e]/=r;for(let e=0;e<t.width;e++)for(let a=0;a<t.height;a++){for(let t=0;t<3;t++){let s=0;for(let h=0;h<3;h++)for(let r=0;r<3;r++){let o=h-Math.floor(1.5),d=r-Math.floor(1.5);s+=l[h][r]*i.data[n(e+d,a+o,t)]}h.data[n(e,a,t)]=s}h.data[n(e,a,3)]=255}a.putImageData(h,0,0)}},ans10:new class extends m{init(){this.setSrcImage(d.srcImage.noise)}main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);const n=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i);for(let e=0;e<t.width;e++)for(let a=0;a<t.height;a++){for(let t=0;t<3;t++){let s=[];for(let h=0;h<3;h++)for(let r=0;r<3;r++){let l=h-Math.floor(1.5),o=r-Math.floor(1.5);s.push(i.data[n(e+o,a+l,t)])}s.sort((t,e)=>t-e),h.data[n(e,a,t)]=s[Math.floor(s.length/2)]}h.data[n(e,a,3)]=255}a.putImageData(h,0,0)}},ans11:new class extends m{main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);const n=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i);for(let e=0;e<t.width;e++)for(let a=0;a<t.height;a++){for(let t=0;t<3;t++){let s=[];for(let h=0;h<3;h++)for(let r=0;r<3;r++){let l=h-Math.floor(1.5),o=r-Math.floor(1.5);s.push(i.data[n(e+o,a+l,t)])}let r=s.reduce((t,e)=>t+e);h.data[n(e,a,t)]=r/s.length}h.data[n(e,a,3)]=255}a.putImageData(h,0,0)}},ans12:new class extends m{main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);const n=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i);let s=[[1/3,0,0],[0,1/3,0],[0,0,1/3]];for(let e=0;e<t.width;e++)for(let a=0;a<t.height;a++){for(let t=0;t<3;t++){let r=0;for(let h=0;h<3;h++)for(let l=0;l<3;l++){let o=h-Math.floor(1.5),d=l-Math.floor(1.5);r+=s[h][l]*i.data[n(e+d,a+o,t)]}h.data[n(e,a,t)]=r}h.data[n(e,a,3)]=255}a.putImageData(h,0,0)}},ans13:new class extends m{main(t,e){let a=t.getContext("2d");a.drawImage(e,0,0,e.width,e.height);let i=a.getImageData(0,0,e.width,e.height),h=a.createImageData(e.width,e.height);const n=(t,e,a)=>.2126*t+.7152*e+.0722*a,s=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i);for(let e=0;e<t.width;e++)for(let a=0;a<t.height;a++){let t=[];for(let h=0;h<3;h++)for(let r=0;r<3;r++){let l=h-Math.floor(1.5),o=r-Math.floor(1.5),d=i.data[s(e+o,a+l,0)],g=i.data[s(e+o,a+l,1)],c=i.data[s(e+o,a+l,2)];t.push(parseInt(n(d,g,c),10))}t.sort((t,e)=>t-e);let r=Math.abs(t[0]-t[t.length-1]);h.data[s(e,a,0)]=r,h.data[s(e,a,1)]=r,h.data[s(e,a,2)]=r,h.data[s(e,a,3)]=255}a.putImageData(h,0,0)}},ans14:new class extends f{main(t,e,a){this.diffFilter(t,a,[[0,-1,0],[0,1,0],[0,0,0]]),this.diffFilter(e,a,[[0,0,0],[-1,1,0],[0,0,0]])}diffFilter(t,e,a){let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let h=i.getImageData(0,0,e.width,e.height),n=i.createImageData(e.width,e.height);const s=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i),r=t=>t>255?255:t<0?0:t,l=a.length;for(let e=0;e<t.width;e++)for(let i=0;i<t.height;i++){let t=0;for(let n=0;n<3;n++)for(let r=0;r<l;r++)for(let o=0;o<l;o++){let d=r-Math.floor(l/2),g=o-Math.floor(l/2);t+=a[r][o]*h.data[s(e+g,i+d,n)]}t=r(t),n.data[s(e,i,0)]=t,n.data[s(e,i,1)]=t,n.data[s(e,i,2)]=t,n.data[s(e,i,3)]=255}i.putImageData(n,0,0)}},ans15:new class extends f{main(t,e,a){this.sovelFilter(t,a,[[1,0,-1],[2,0,-2],[1,0,-1]]),this.sovelFilter(e,a,[[1,2,1],[0,0,0],[-1,-2,-1]])}sovelFilter(t,e,a){let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let h=i.getImageData(0,0,e.width,e.height),n=i.createImageData(e.width,e.height);const s=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i),r=a.length;for(let e=0;e<t.width;e++)for(let i=0;i<t.height;i++){let t=0;for(let n=0;n<3;n++)for(let l=0;l<r;l++)for(let o=0;o<r;o++){let d=l-Math.floor(r/2),g=o-Math.floor(r/2);t+=a[l][o]*h.data[s(e+g,i+d,n)]}n.data[s(e,i,0)]=t,n.data[s(e,i,1)]=t,n.data[s(e,i,2)]=t,n.data[s(e,i,3)]=255}i.putImageData(n,0,0)}},ans16:new class extends f{main(t,e,a){this.prewittFilter(t,a,[[-1,-1,-1],[0,0,0],[1,1,1]]),this.prewittFilter(e,a,[[-1,0,1],[-1,0,1],[-1,0,1]])}prewittFilter(t,e,a){let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let h=i.getImageData(0,0,e.width,e.height),n=i.createImageData(e.width,e.height);const s=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i),r=t=>t>255?255:t<0?0:t,l=a.length;for(let e=0;e<t.width;e++)for(let i=0;i<t.height;i++){let t=0;for(let n=0;n<3;n++)for(let r=0;r<l;r++)for(let o=0;o<l;o++){let d=r-Math.floor(l/2),g=o-Math.floor(l/2);t+=a[r][o]*h.data[s(e+g,i+d,n)]}t=r(t),n.data[s(e,i,0)]=t,n.data[s(e,i,1)]=t,n.data[s(e,i,2)]=t,n.data[s(e,i,3)]=255}i.putImageData(n,0,0)}},ans17:new class extends m{main(t,e){this.laplacianFilter(t,e,[[0,1,0],[1,-4,1],[0,1,0]])}laplacianFilter(t,e,a){let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let h=i.getImageData(0,0,e.width,e.height),n=i.createImageData(e.width,e.height);const s=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i),r=t=>t>255?255:t<0?0:t,l=a.length;for(let e=0;e<t.width;e++)for(let i=0;i<t.height;i++){let t=0;for(let n=0;n<3;n++)for(let r=0;r<l;r++)for(let o=0;o<l;o++){let d=r-Math.floor(l/2),g=o-Math.floor(l/2);t+=a[r][o]*h.data[s(e+g,i+d,n)]}t=r(t),n.data[s(e,i,0)]=t,n.data[s(e,i,1)]=t,n.data[s(e,i,2)]=t,n.data[s(e,i,3)]=255}i.putImageData(n,0,0)}},ans18:new class extends m{main(t,e){this.logFilter(t,e,[[-2,-1,0],[-1,1,1],[0,1,2]])}logFilter(t,e,a){let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let h=i.getImageData(0,0,e.width,e.height),n=i.createImageData(e.width,e.height);const s=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i),r=t=>t>255?255:t<0?0:t,l=a.length;for(let e=0;e<t.width;e++)for(let i=0;i<t.height;i++){let t=0;for(let n=0;n<3;n++)for(let r=0;r<l;r++)for(let o=0;o<l;o++){let d=r-Math.floor(l/2),g=o-Math.floor(l/2);t+=a[r][o]*h.data[s(e+g,i+d,n)]}t=r(t),n.data[s(e,i,0)]=t,n.data[s(e,i,1)]=t,n.data[s(e,i,2)]=t,n.data[s(e,i,3)]=255}i.putImageData(n,0,0)}},ans19:new class extends m{init(){this.setSrcImage(config.srcImage.noise)}main(t,e){let a=[[0,0,0],[0,0,0],[0,0,0]];for(let t=0;t<a.length;t++)for(let e=0;e<a.length;e++){let i=e-Math.floor(1.5),h=t-Math.floor(1.5),n=(i**2+h**2-9)*Math.exp(-(i**2+h**2)/18);a[t][e]=n}this.logFilter(t,e,a)}logFilter(t,e,a){let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let h=i.getImageData(0,0,e.width,e.height),n=i.createImageData(e.width,e.height);const s=(e,a,i)=>(e=Math.min(Math.max(e,0),t.width-1),(a=Math.min(Math.max(a,0),t.height-1))*t.width*4+4*e+i),r=t=>t>255?255:t<0?0:t,l=a.length;for(let e=0;e<t.width;e++)for(let i=0;i<t.height;i++){let t=0;for(let n=0;n<3;n++)for(let r=0;r<l;r++)for(let o=0;o<l;o++){let d=r-Math.floor(l/2),g=o-Math.floor(l/2);t+=a[r][o]*h.data[s(e+g,i+d,n)]}t=r(t),n.data[s(e,i,0)]=t,n.data[s(e,i,1)]=t,n.data[s(e,i,2)]=t,n.data[s(e,i,3)]=255}i.putImageData(n,0,0)}},ans20:new class extends m{main(t,e){}}};var u=function(){let t={};for(let e=1;e<=100;e++){let a=`ans${e}`,h=w[a];w[a]?t[a]=i.a.component(a,{name:a,data:()=>({}),methods:{},mounted(){try{h.init(this),h._initObject(this)}catch(t){alert("error:"+t)}},template:h.getTemplate()}):t[a]=i.a.component(a,{template:r})}return t}(),p={ans1:{title:"チャンネル入れ替え",desc:"画像を読み込み、RGBをBGRの順に入れ替えよ。"},ans2:{title:"グレースケール",desc:"グレースケールとは、画像の輝度表現方法の一種であり次の式で計算される。<code>Y = 0.2126 R + 0.7152 G + 0.0722 B</code>"},ans3:{title:"二値化",desc:""},ans4:{title:"大津の二値化",desc:""},ans5:{title:"HSV変換",desc:""},ans6:{title:"減色処理",desc:""},ans7:{title:"平均プーリング",desc:""},ans8:{title:"Maxプーリング",desc:""},ans9:{title:"ガウシアンフィルタ",desc:""},ans10:{title:"メディアンフィルタ",desc:""}};let v=[];for(let t in u)v.push({path:"/questions/"+t,name:t,title:p[t]?p[t].title:"",desc:p[t]?p[t].desc:"",component:u[t]});var I=v,M={name:"HelloWorld",data:()=>({questionLinks:I})},x={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("h2",[t._v("問題一覧")]),t._v(" "),t._l(t.questionLinks,function(e){return a("ul",{key:e.name},[a("li",[a("router-link",{attrs:{to:{path:e.path}}},[t._v("\n        Q."+t._s(e.name.split("ans").join(""))+" "+t._s(e.title)+"\n      ")])],1)])})],2)},staticRenderFns:[]};var _=a("VU/8")(M,x,!1,function(t){a("D2Rb")},"data-v-19fef3ed",null).exports,b={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("h2",[t._v("概要")]),t._v("\n  画像処理100本ノック\n  "),a("a",{attrs:{href:"https://github.com/yoyoyo-yo/Gasyori100knock"}},[t._v("https://github.com/yoyoyo-yo/Gasyori100knock")]),t._v("\n  を\n  JavaScriptで解いてみました。\n  "),a("h2",[t._v("問題一覧")]),t._v(" "),a("router-link",{attrs:{to:"/list"}},[t._v("問題一覧")]),t._v(" "),a("h2",[t._v("関連リンク")]),t._v(" "),t._m(0),t._v(" "),a("h2",[t._v("参考")]),t._v(" "),t._m(1)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[e("a",{attrs:{href:"https://github.com/s-yoshiki/Gasyori100knockJS"}},[this._v("GitHub: Gasyori100knockJS")])]),this._v(" "),e("li",[e("a",{attrs:{href:"https://github.com/yoyoyo-yo/Gasyori100knock"}},[this._v("【本家】画像処理100本ノック (Gasyori100knockJS)")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("blockquote",[this._v("\n    yoyoyo-yo. Gasyori100knock(画像処理100本ノック) \n    "),e("br"),this._v(" "),e("a",{attrs:{href:"https://github.com/yoyoyo-yo/Gasyori100knock"}},[this._v("https://github.com/yoyoyo-yo/Gasyori100knock")]),this._v(" "),e("br"),this._v("\n    2019\n  ")])}]},D=a("VU/8")({name:"Root"},b,!1,null,null,null).exports,y={name:"Question",data:()=>({title:"",description:"",screenId:"",screenSeq:"",pageNation:{next:"",nextLabel:"",last:"",lastLabel:""}}),methods:{init:function(t){if(t)this.screenId="ans"+t,this.screenSeq=t;else{let t=new URL(location.href);this.screenId=t.hash.split("/").pop(),this.screenSeq=Number(this.screenId.split("ans").join(""))}1<=this.screenSeq&&this.screenSeq<=100||(location.href="#/list"),this.makePage(),this.makeDescription()},movePage:function(t){this.init(t+this.screenSeq)},makePage:function(){this.screenSeq>1&&(this.pageNation.last=`#/questions/ans${this.screenSeq-1}`,this.pageNation.lastLabel=`Q.${this.screenSeq-1}`),this.screenSeq<100&&(this.pageNation.next=`#/questions/ans${this.screenSeq+1}`,this.pageNation.nextLabel=`Q.${this.screenSeq+1}`)},makeDescription(){if(!p[this.screenId])return this.title="",void(this.description="");this.title=p[this.screenId].title,this.description=p[this.screenId].desc}},created(){this.init()}},k={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("br"),t._v(" "),a("h3",[t._v(t._s("Q"+t.screenSeq+"."+t.title))]),t._v(" "),a("div",{domProps:{innerHTML:t._s(t.description)}}),t._v(" "),a("br"),t._v(" "),a("div",{ref:"main",staticClass:"main"},[a("router-view")],1),t._v(" "),a("br"),t._v(" "),a("div",{staticClass:"boxContainer"},[a("div",{staticClass:"box"},[a("a",{attrs:{href:t.pageNation.last},on:{click:function(e){t.movePage(-1)}}},[t._v(t._s(t.pageNation.lastLabel)+" ")])]),t._v(" "),a("div",{staticClass:"box"},[a("a",{attrs:{href:t.pageNation.next},on:{click:function(e){t.movePage(1)}}},[t._v(t._s(t.pageNation.nextLabel)+" ")])])])])},staticRenderFns:[]};let C=[{path:"/",name:"root",component:D},{path:"/list",name:"List",component:_},{path:"/questions/:id",name:"Question",component:a("VU/8")(y,k,!1,function(t){a("bvtY")},null,null).exports,children:[]},{path:"/reset",redirect:"/questions/ans1"}];I.forEach(t=>{C[2].children.push(t)}),i.a.use(s.a);var S=new s.a({routes:C});i.a.config.productionTip=!1,new i.a({el:"#app",router:S,components:{App:n},template:"<App/>"})},bvtY:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.67311ac06df59a9b1050.js.map