webpackJsonp([1],{GUM5:function(t,a){},NHnr:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=e("7+uW"),h={render:function(){var t=this.$createElement,a=this._self._c||t;return a("div",{attrs:{id:"app"}},[a("header",[a("h2",[this._v("画像処理100本ノック")]),this._v(" "),a("router-link",{attrs:{to:"/"}},[this._v("home")]),this._v(" "),a("router-link",{attrs:{to:"/list"}},[this._v("list")])],1),this._v(" "),a("router-view"),this._v(" "),a("footer")],1)},staticRenderFns:[]};var n=e("VU/8")({name:"App"},h,!1,function(t){e("iTmA")},null,null).exports,r=e("/ocq");var d={drawImage(t,a){a.addEventListener("load",()=>{t.width=a.width,t.height=a.height,t.getContext("2d").drawImage(a,0,0,a.width,a.height)})}},s={default:"./static/imori.jpg",noise:"./static/imori_noise.jpg"};let o={},l={};[{ans1:{main:(t,a)=>{let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);for(let t=0;t<i.data.length;t+=4)h.data[t]=i.data[t+2],h.data[t+1]=i.data[t+1],h.data[t+2]=i.data[t],h.data[t+3]=i.data[t+3];e.putImageData(h,0,0)}},ans2:{main:(t,a)=>{let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);for(let t=0;t<i.data.length;t+=4){let a=.2126*i.data[t]+.7152*i.data[t+1]+.0722*i.data[t+2];a=parseInt(a,10),h.data[t]=a,h.data[t+1]=a,h.data[t+2]=a,h.data[t+3]=i.data[t+3]}e.putImageData(h,0,0)}},ans3:{main:(t,a)=>{let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);for(let t=0;t<i.data.length;t+=4){let a=.2126*i.data[t]+.7152*i.data[t+1]+.0722*i.data[t+2];a=(a=parseInt(a,10))>128?255:0,h.data[t]=a,h.data[t+1]=a,h.data[t+2]=a,h.data[t+3]=i.data[t+3]}e.putImageData(h,0,0)}},ans4:{main:(t,a)=>{let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height),n=Array(256);n.fill(0);let r=0;a.width,a.height;for(let t=0;t<i.data.length;t+=4){let a=.2126*i.data[t]+.7152*i.data[t+1]+.0722*i.data[t+2];n[a=parseInt(a,10)]++,r+=a}for(let t=0;t<256;t++){n[t],n[t]}e.putImageData(h,0,0)}},ans5:{main:(t,a)=>{let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);const n=t=>{let a=t[0]/255,e=t[1]/255,i=t[2]/255,h=Math.max(a,e,i),n=Math.min(a,e,i),r=h-n,d=0;switch(n){case h:d=0;break;case a:d=(i-e)/r*60+180;break;case e:d=(a-i)/r*60+300;break;case i:d=(e-a)/r*60+60}return[d,0==h?0:r/h,h]},r=t=>{let a,e,i,h=t[0],n=t[1],r=t[2],d=r*n,s=h/60,o=d*(1-Math.abs(s%2-1));0<=s&&s<1&&([a,e,i]=[d,o,0]),1<=s&&s<2&&([a,e,i]=[o,d,0]),2<=s&&s<3&&([a,e,i]=[0,d,o]),3<=s&&s<4&&([a,e,i]=[0,o,d]),4<=s&&s<5&&([a,e,i]=[o,0,d]),5<=s&&s<6&&([a,e,i]=[d,0,o]);let l=r-d;return[a,e,i]=[a+l,e+l,i+l],[a=Math.floor(255*a),e=Math.floor(255*e),i=Math.floor(255*i)]};for(let t=0;t<i.data.length;t+=4){let a=n([i.data[t],i.data[t+1],i.data[t+2]]);a[0]=(a[0]+180)%360;let e=r(a);h.data[t]=e[0],h.data[t+1]=e[1],h.data[t+2]=e[2],h.data[t+3]=i.data[t+3]}e.putImageData(h,0,0)}},ans6:{main:(t,a)=>{let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height),n=[32,96,160,224];for(let t=0;t<i.data.length;t++){if(t%4==3){h.data[t]=i.data[t];continue}let a=Number.MAX_SAFE_INTEGER,e=0;for(let h in n){let r=Math.abs(i.data[t]-n[h]);r<a&&(a=r,e=h)}h.data[t]=n[e]}e.putImageData(h,0,0)}},ans7:{main:(t,a)=>{let e=a.width/16,i=a.height/16;t.getContext("2d").drawImage(a,0,0,a.width,a.height);const h=(a,e,i,h)=>{let n,r,d,s=t.getContext("2d");n=r=d=0;for(var o=s.getImageData(a,e,i,h),l=s.createImageData(i,h),g=0;g<o.data.length;g+=4)n+=o.data[g],r+=o.data[g+1],d+=o.data[g+2];n/=o.data.length/4,r/=o.data.length/4,d/=o.data.length/4,n=Math.ceil(n),r=Math.ceil(r),d=Math.ceil(d);for(g=0;g<o.data.length;g+=4)l.data[g]=n,l.data[g+1]=r,l.data[g+2]=d,l.data[g+3]=255;s.putImageData(l,a,e)};for(let a=0;a<t.width;a+=e)for(let n=0;n<t.height;n+=i)h(a,n,e,i)}},ans8:{main:(t,a)=>{let e=a.width/16,i=a.height/16;t.getContext("2d").drawImage(a,0,0,a.width,a.height);const h=(a,e,i,h)=>{let n,r,d,s=t.getContext("2d");n=r=d=0;for(var o=s.getImageData(a,e,i,h),l=s.createImageData(i,h),g=0;g<o.data.length;g+=4)n=o.data[g]>n?o.data[g]:n,r=o.data[g+1]>r?o.data[g+1]:r,d=o.data[g+2]>d?o.data[g+2]:d;for(g=0;g<o.data.length;g+=4)l.data[g]=n,l.data[g+1]=r,l.data[g+2]=d,l.data[g+3]=255;s.putImageData(l,a,e)};for(let a=0;a<t.width;a+=e)for(let n=0;n<t.height;n+=i)h(a,n,e,i)}},ans9:{srcImg:s.noise,main(t,a){let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);const n=(a,e,i)=>(a=Math.min(Math.max(a,0),t.width-1),(e=Math.min(Math.max(e,0),t.height-1))*t.width*4+4*a+i),r=(t,a,e)=>Math.exp(-(t**2+a**2)/(2*e**2));let d=0,s=Array.from(new Array(3),()=>new Array(3).fill(0));for(let t=0;t<3;t++)for(let a=0;a<3;a++){let e=r(a-Math.floor(1.5),t-Math.floor(1.5),1.3);s[t][a]=e,s[t][a]/=1.3*Math.sqrt(2*Math.PI),d+=s[t][a]}for(let t=0;t<3;t++)for(let a=0;a<3;a++)s[t][a]/=d;for(let a=0;a<t.width;a++)for(let e=0;e<t.height;e++){for(let t=0;t<3;t++){let r=0;for(let h=0;h<3;h++)for(let d=0;d<3;d++){let o=h-Math.floor(1.5),l=d-Math.floor(1.5);r+=s[h][d]*i.data[n(a+o,e+l,t)]}h.data[n(a,e,t)]=r}h.data[n(a,e,3)]=255}e.putImageData(h,0,0)}},ans10:{srcImg:s.noise,main(t,a){let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);const n=(a,e,i)=>(a=Math.min(Math.max(a,0),t.width-1),(e=Math.min(Math.max(e,0),t.height-1))*t.width*4+4*a+i);for(let a=0;a<t.width;a++)for(let e=0;e<t.height;e++){for(let t=0;t<3;t++){let r=[];for(let h=0;h<3;h++)for(let d=0;d<3;d++){let s=h-Math.floor(1.5),o=d-Math.floor(1.5);r.push(i.data[n(a+s,e+o,t)])}r.sort((t,a)=>t-a),h.data[n(a,e,t)]=r[Math.floor(r.length/2)]}h.data[n(a,e,3)]=255}e.putImageData(h,0,0)}}},{ans11:{srcImg:s.noise,main(t,a){let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);const n=(a,e,i)=>(a=Math.min(Math.max(a,0),t.width-1),(e=Math.min(Math.max(e,0),t.height-1))*t.width*4+4*a+i);for(let a=0;a<t.width;a++)for(let e=0;e<t.height;e++){for(let t=0;t<3;t++){let r=[];for(let h=0;h<3;h++)for(let d=0;d<3;d++){let s=h-Math.floor(1.5),o=d-Math.floor(1.5);r.push(i.data[n(a+s,e+o,t)])}let d=r.reduce((t,a)=>t+a);h.data[n(a,e,t)]=d/r.length}h.data[n(a,e,3)]=255}e.putImageData(h,0,0)}},ans12:{main(t,a){let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);const n=(a,e,i)=>(a=Math.min(Math.max(a,0),t.width-1),(e=Math.min(Math.max(e,0),t.height-1))*t.width*4+4*a+i);let r=[[1/3,0,0],[0,1/3,0],[0,0,1/3]];for(let a=0;a<t.width;a++)for(let e=0;e<t.height;e++){for(let t=0;t<3;t++){let d=0;for(let h=0;h<3;h++)for(let s=0;s<3;s++){let o=h-Math.floor(1.5),l=s-Math.floor(1.5);d+=r[h][s]*i.data[n(a+o,e+l,t)]}h.data[n(a,e,t)]=d}h.data[n(a,e,3)]=255}e.putImageData(h,0,0)}},ans13:{main(t,a){let e=t.getContext("2d");e.drawImage(a,0,0,a.width,a.height);let i=e.getImageData(0,0,a.width,a.height),h=e.createImageData(a.width,a.height);const n=(t,a,e)=>.2126*t+.7152*a+.0722*e,r=(a,e,i)=>(a=Math.min(Math.max(a,0),t.width-1),(e=Math.min(Math.max(e,0),t.height-1))*t.width*4+4*a+i);for(let a=0;a<t.width;a++)for(let e=0;e<t.height;e++){let t=[];for(let h=0;h<3;h++)for(let d=0;d<3;d++){let s=h-Math.floor(1.5),o=d-Math.floor(1.5),l=i.data[r(a+s,e+o,0)],g=i.data[r(a+s,e+o,1)],m=i.data[r(a+s,e+o,2)];t.push(parseInt(n(l,g,m),10))}t.sort((t,a)=>t-a);let d=Math.abs(t[0]-t[t.length-1]);h.data[r(a,e,0)]=d,h.data[r(a,e,1)]=d,h.data[r(a,e,2)]=d,h.data[r(a,e,3)]=255}e.putImageData(h,0,0)}}}].forEach(t=>{for(let a in t)o[a]=t[a]});for(let t in o){let a=o[t].srcImg?o[t].srcImg:s.default;l[t]=i.a.component(t,{name:t,data:()=>({imageUrl:a}),methods:{},mounted(){let a=this.$refs["canvas-view-only"],e=this.$refs.canvas,i=this.$refs["button-run"],h=new Image;h.src=this.imageUrl,h.addEventListener("load",()=>{e.width=h.width,e.height=h.height}),d.drawImage(a,h),i.addEventListener("click",()=>{o[t].main(e,h)})},template:'\n<div>\n<canvas ref="canvas-view-only"></canvas>\n&nbsp;\n<canvas ref="canvas"></canvas>\n<br>\n<button ref="button-run" class="bt">run</button>\n</div>\n'})}var g=l;let m=[];for(let t in g)m.push({path:"/questions/"+t,name:t,component:g[t]});var c=m,f={name:"HelloWorld",data:()=>({questionLinks:c})},w={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("h2",[t._v("問題一覧")]),t._v(" "),t._l(t.questionLinks,function(a){return e("ul",{key:a.name},[e("li",[e("router-link",{attrs:{to:{path:a.path}}},[t._v("\n        Q."+t._s(a.name.split("ans").join(""))+"\n      ")])],1)])})],2)},staticRenderFns:[]};var u=e("VU/8")(f,w,!1,function(t){e("GUM5")},"data-v-0944b84e",null).exports,p={ans1:{title:"チャンネル入れ替え",desc:"画像を読み込み、RGBをBGRの順に入れ替えよ。"},ans2:{title:"グレースケール",desc:"グレースケールとは、画像の輝度表現方法の一種であり次の式で計算される。<code>Y = 0.2126 R + 0.7152 G + 0.0722 B</code>"}},I={name:"Question",data:()=>({title:"",description:"",screenId:"",screenSeq:"",pageNation:{next:"",nextLabel:"",last:"",lastLabel:""}}),methods:{init:function(t){if(t)this.screenId="ans"+t,this.screenSeq=t;else{let t=new URL(location.href);this.screenId=t.hash.split("/").pop(),this.screenSeq=Number(this.screenId.split("ans").join(""))}this.makePage(),this.makeDescription()},movePage:function(t){this.init(t+this.screenSeq)},makePage:function(){this.screenSeq>1&&(this.pageNation.last=`#/questions/ans${this.screenSeq-1}`,this.pageNation.lastLabel=`Q.${this.screenSeq-1}`),this.screenSeq<100&&(this.pageNation.next=`#/questions/ans${this.screenSeq+1}`,this.pageNation.nextLabel=`Q.${this.screenSeq+1}`)},makeDescription(){if(!p[this.screenId])return this.title="",void(this.description="");this.title=p[this.screenId].title,this.description=p[this.screenId].desc}},created(){this.init()}},v={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("br"),t._v(" "),e("h3",[t._v(t._s("Q"+t.screenSeq+"."+t.title))]),t._v(" "),e("div",{domProps:{innerHTML:t._s(t.description)}}),t._v(" "),e("br"),t._v(" "),e("div",{staticClass:"main"},[e("router-view")],1),t._v(" "),e("br"),t._v(" "),e("div",{staticClass:"boxContainer"},[e("div",{staticClass:"box"},[e("a",{attrs:{href:t.pageNation.last},on:{click:function(a){t.movePage(-1)}}},[t._v(t._s(t.pageNation.lastLabel)+" ")])]),t._v(" "),e("div",{staticClass:"box"},[e("a",{attrs:{href:t.pageNation.next},on:{click:function(a){t.movePage(1)}}},[t._v(t._s(t.pageNation.nextLabel)+" ")])])])])},staticRenderFns:[]};let M=[{path:"/",name:"root"},{path:"/list",name:"List",component:u},{path:"/questions/:id",name:"Question",component:e("VU/8")(I,v,!1,function(t){e("auXI")},null,null).exports,children:[]},{path:"/reset",redirect:"/questions/ans1"}];c.forEach(t=>{M[2].children.push(t)}),i.a.use(r.a);var D=new r.a({routes:M});i.a.config.productionTip=!1,new i.a({el:"#app",router:D,components:{App:n},template:"<App/>"})},auXI:function(t,a){},iTmA:function(t,a){}},["NHnr"]);
//# sourceMappingURL=app.c70a0d147c3e3da87050.js.map