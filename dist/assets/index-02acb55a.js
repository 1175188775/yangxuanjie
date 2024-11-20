import{d as ae,o as b,c as z,a as o,b as _e,r as f,u as he,e as Y,m as ge,n as pe,p as we,f as t,w as a,g as v,t as g,l as P,q as Z,h as ye,k as ke,F as Q,s as ee,v as te}from"./index-49c8bf89.js";import{_ as xe}from"./_plugin-vue_export-helper-c27b6911.js";const be={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Se=o("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1),Ie=o("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M208 192v128"},null,-1),Me=o("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M304 192v128"},null,-1),Ce=[Se,Ie,Me],De=ae({name:"PauseCircleOutline",render:function(u,m){return b(),z("svg",be,Ce)}}),G={getAllUsers(){const p=[];for(let u=0;u<localStorage.length;u++){const m=localStorage.key(u);if(m&&m!=="isLoggedIn"&&m!=="currentUser"){const r=JSON.parse(localStorage.getItem(m)||"{}");r.username&&p.push(r)}}return p},getLeaderboard(){return this.getAllUsers().sort((p,u)=>u.highScore-p.highScore).slice(0,10)},updateGameHistory(p,u,m){const r=JSON.parse(localStorage.getItem(p)||"{}");r.username&&(r.gameHistory=r.gameHistory||[],r.gameHistory.unshift({score:u,date:new Date().toISOString(),duration:m}),r.gameHistory=r.gameHistory.slice(0,20),u>(r.highScore||0)&&(r.highScore=u),localStorage.setItem(p,JSON.stringify(r)))}},Pe={class:"game-container"},ze={class:"user-nickname"},Le={class:"user-id"},Te={class:"control-panel tech-panel"},Ue={class:"canvas-wrapper tech-border"},Ae={key:0,class:"pause-overlay"},Ee={class:"instructions tech-panel"},He={class:"rank-name"},Oe={class:"rank-score"},Be={class:"history-score"},Ne={class:"history-duration"},Ge={class:"history-date"},$e={class:"game-over-content"},l=20,Re=ae({__name:"index",setup(p){const u=_e(),m=f(null),r=f(0),_=f(!1),y=f(!1),L=f(!1);f(Number(localStorage.getItem("snakeHighScore")||"0"));const T=f(localStorage.getItem("snakeSoundEnabled")!=="false"),$=f("normal"),se=he(),ne=f(!1),I=f(localStorage.getItem("currentUser")||""),R=f(0),J=f(G.getLeaderboard()),H=Y(()=>JSON.parse(localStorage.getItem(I.value)||"{}")),oe=Y(()=>H.value.gameHistory||[]),V={eat:new Audio("/sounds/eat.mp3"),die:new Audio("/sounds/die.mp3"),move:new Audio("/sounds/move.mp3")},le=[{label:"简单",value:"easy",speed:200},{label:"普通",value:"normal",speed:150},{label:"困难",value:"hard",speed:100}];let F=150,k=[],w={x:0,y:0},h="right",d=null;function W(e){T.value&&(V[e].currentTime=0,V[e].play())}function j(){_.value&&(y.value?(y.value=!1,d=setInterval(K,F)):(y.value=!0,d&&(clearInterval(d),d=null)))}function re(){k=[{x:3,y:1},{x:2,y:1},{x:1,y:1}],h="right"}function q(){const e=400/l-1;for(w={x:Math.floor(Math.random()*e),y:Math.floor(Math.random()*e)};k.some(s=>s.x===w.x&&s.y===w.y);)w={x:Math.floor(Math.random()*e),y:Math.floor(Math.random()*e)}}function O(){var c;const e=(c=m.value)==null?void 0:c.getContext("2d");if(!e)return;e.clearRect(0,0,400,400),e.strokeStyle="rgba(0, 255, 255, 0.1)",e.lineWidth=.5;for(let n=0;n<=400;n+=l/2)e.beginPath(),e.moveTo(n,0),e.lineTo(n,400),e.stroke(),e.beginPath(),e.moveTo(0,n),e.lineTo(400,n),e.stroke();e.strokeStyle="rgba(0, 255, 255, 0.2)",e.lineWidth=1;for(let n=0;n<=400;n+=l)e.beginPath(),e.moveTo(n,0),e.lineTo(n,400),e.stroke(),e.beginPath(),e.moveTo(0,n),e.lineTo(400,n),e.stroke();k.forEach((n,S)=>{if(e.shadowBlur=15,e.shadowColor="#00ffff",S===0){e.fillStyle="#00ffff";const B=n.x*l+l/2,N=n.y*l+l/2,U=l/2-2;e.beginPath();for(let x=0;x<6;x++){const C=x*Math.PI/3,D=B+U*Math.cos(C),A=N+U*Math.sin(C);x===0?e.moveTo(D,A):e.lineTo(D,A)}e.closePath(),e.fill()}else e.fillStyle="#0ff8",e.fillRect(n.x*l+2,n.y*l+2,l-4,l-4);e.shadowBlur=0}),e.shadowBlur=20,e.shadowColor="#ff0080",e.fillStyle="#ff0080";const s=Date.now()/1e3,M=Math.sin(s*4)*2;e.beginPath(),e.arc(w.x*l+l/2,w.y*l+l/2,l/2-2+M,0,Math.PI*2),e.fill(),e.shadowBlur=0}function K(){const e={...k[0]};switch(h){case"up":e.y--;break;case"down":e.y++;break;case"left":e.x--;break;case"right":e.x++;break}if(e.x===w.x&&e.y===w.y?(r.value+=10,q(),W("eat"),u.success("得分 +10")):(k.pop(),W("move")),e.x<0||e.x>=400/l||e.y<0||e.y>=400/l||k.some(s=>s.x===e.x&&s.y===e.y)){ce();return}k.unshift(e),O()}function ie(){_.value||(R.value=Date.now(),_.value=!0,L.value=!1,r.value=0,re(),q(),O(),d=setInterval(K,F))}function ce(){d&&(clearInterval(d),d=null),_.value=!1;const e=Date.now()-R.value;G.updateGameHistory(I.value,r.value,e),J.value=G.getLeaderboard(),L.value=!0}function X(e){if(e.key.startsWith("Arrow")&&e.preventDefault(),!!_.value){if(e.code==="Space"){e.preventDefault(),j();return}if(!y.value)switch(e.key){case"ArrowUp":h!=="down"&&(h="up");break;case"ArrowDown":h!=="up"&&(h="down");break;case"ArrowLeft":h!=="right"&&(h="left");break;case"ArrowRight":h!=="left"&&(h="right");break}}}ge(T,e=>{localStorage.setItem("snakeSoundEnabled",String(e))});function ue(){_.value?ne.value=!0:de()}function de(){d&&(clearInterval(d),d=null),_.value=!1,localStorage.removeItem("isLoggedIn"),localStorage.removeItem("currentUser"),u.success("已退出登录"),se.push("/login")}pe(()=>{window.addEventListener("keydown",X),O()}),we(()=>{window.removeEventListener("keydown",X),d&&clearInterval(d)});function fe(e){const s=Math.floor(e/1e3);return`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`}function ve(e){return new Date(e).toLocaleString()}return(e,s)=>{const M=v("n-avatar"),c=v("n-space"),n=v("n-button"),S=v("n-card"),B=v("n-select"),N=v("n-switch"),U=v("n-icon"),x=v("n-grid-item"),C=v("n-list-item"),D=v("n-list"),A=v("n-grid"),me=v("n-modal");return b(),z("div",Pe,[t(c,{vertical:"",size:"large",style:{width:"100%","max-width":"1200px"}},{default:a(()=>[t(S,{class:"user-card"},{default:a(()=>[t(c,{justify:"space-between",align:"center"},{default:a(()=>[t(c,{align:"center"},{default:a(()=>[t(M,{round:"",size:48,src:H.value.avatar||"https://api.dicebear.com/7.x/pixel-art/svg?seed="+I.value},null,8,["src"]),t(c,{vertical:"",size:4},{default:a(()=>[o("span",ze,g(H.value.nickname||I.value),1),o("span",Le,"ID: "+g(I.value),1)]),_:1})]),_:1}),t(n,{class:"logout-button",onClick:ue},{default:a(()=>s[3]||(s[3]=[P(" 退出登录 ")])),_:1})]),_:1})]),_:1}),t(A,{cols:24,"x-gap":24},{default:a(()=>[t(x,{span:16},{default:a(()=>[t(S,{title:"贪吃蛇游戏",class:"game-card"},{default:a(()=>[o("div",Te,[t(c,{vertical:""},{default:a(()=>[t(c,null,{default:a(()=>[t(B,{value:$.value,"onUpdate:value":s[0]||(s[0]=i=>$.value=i),options:le,placeholder:"选择难度",disabled:_.value,style:{width:"100px"},class:"tech-select"},null,8,["value","disabled"]),t(N,{value:T.value,"onUpdate:value":s[1]||(s[1]=i=>T.value=i),size:"large",class:"tech-switch"},{checked:a(()=>s[4]||(s[4]=[P(" 声音开 ")])),unchecked:a(()=>s[5]||(s[5]=[P(" 声音关 ")])),_:1},8,["value"])]),_:1}),t(c,null,{default:a(()=>[t(n,{onClick:ie,disabled:_.value,class:"tech-button"},{default:a(()=>s[6]||(s[6]=[P(" 开始游戏 ")])),_:1},8,["disabled"]),t(n,{onClick:j,disabled:!_.value,class:"tech-button"},{default:a(()=>[P(g(y.value?"继续":"暂停"),1)]),_:1},8,["disabled"])]),_:1})]),_:1})]),o("div",Ue,[o("div",{class:Z(["canvas-container",{paused:y.value}])},[o("canvas",{ref_key:"gameCanvas",ref:m,width:"400",height:"400",class:"game-canvas"},null,512),y.value?(b(),z("div",Ae,[t(U,{size:"48",class:"pause-icon"},{default:a(()=>[t(ye(De))]),_:1}),s[7]||(s[7]=o("div",null,"游戏已暂停",-1))])):ke("",!0)],2)]),o("div",Ee,[t(c,{vertical:"",size:"small"},{default:a(()=>s[8]||(s[8]=[o("div",{class:"tech-text"},"操作说明：",-1),o("div",{class:"tech-text"},"↑↓←→ 控制方向",-1),o("div",{class:"tech-text"},"空格键 暂停/继续",-1)])),_:1})])]),_:1})]),_:1}),t(x,{span:8},{default:a(()=>[t(c,{vertical:"",size:24,style:{height:"100%"}},{default:a(()=>[t(S,{title:"排行榜",class:"rank-card"},{default:a(()=>[t(D,null,{default:a(()=>[(b(!0),z(Q,null,ee(J.value,(i,E)=>(b(),te(C,{key:i.username},{default:a(()=>[t(c,{align:"center"},{default:a(()=>[o("div",{class:Z(["rank-number","rank-"+(E+1)])},g(E+1),3),t(M,{round:"",size:32,src:i.avatar||"https://api.dicebear.com/7.x/pixel-art/svg?seed="+i.username},null,8,["src"]),o("span",He,g(i.nickname||i.username),1),o("span",Oe,g(i.highScore),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}),t(S,{title:"游戏历史",class:"history-card"},{default:a(()=>[t(D,null,{default:a(()=>[(b(!0),z(Q,null,ee(oe.value,(i,E)=>(b(),te(C,{key:E},{default:a(()=>[t(c,{vertical:"",size:4},{default:a(()=>[t(c,{justify:"space-between"},{default:a(()=>[o("span",Be,"得分："+g(i.score),1),o("span",Ne,"时长："+g(fe(i.duration)),1)]),_:2},1024),o("span",Ge,g(ve(i.date)),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),t(me,{show:L.value,"onUpdate:show":s[2]||(s[2]=i=>L.value=i),preset:"dialog",title:"游戏结束"},{default:a(()=>[o("div",$e," 游戏已结束，当前得分："+g(r.value),1)]),_:1},8,["show"])])}}});const Fe=xe(Re,[["__scopeId","data-v-906a2a7b"]]);export{Fe as default};
