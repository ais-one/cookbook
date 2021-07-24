import{C as t}from"./index.cf0bffa9.js";import{o as e,e as a,f as s,j as l,O as n,P as i,Q as o,U as r,w as d,r as c,C as u}from"./vendor.4ddb5e7f.js";import"./tslib.es6.e09dba67.js";const p={name:"MultiChart",setup:()=>(e((()=>{fetch("https://gw.alipayobjects.com/os/antvdemo/assets/data/diamond.json").then((t=>t.json())).then((e=>{const a=new t({container:"mc1",autoFit:!0,height:500,padding:48});a.data(e),a.scale({carat:{sync:!0},price:{sync:!0},cut:{sync:!0}}),a.facet("list",{fields:["cut"],cols:3,padding:30,eachView(t){t.point().position("carat*price").color("cut").shape("circle").style({fillOpacity:.3,stroke:null}).size(3)}}),a.render()}))})),{})},f={style:{"text-align":"center"}},m=l("div",{id:"mc1"},null,-1);p.render=function(t,e,l,n,i,o){return a(),s("div",f,[m])};const y={name:"MultiChart",setup:()=>(e((()=>{const e=.0667*Math.PI,a=new t({container:"pc1",autoFit:!0,height:500});a.legend(!1),a.tooltip({showMarkers:!1});const s=a.createView({region:{start:{x:0,y:0},end:{x:.5,y:1}}});s.coordinate("theta",{radius:.7,startAngle:0+e,endAngle:2*Math.PI+e}),s.data([{type:"微博",value:93.33},{type:"其他",value:6.67}]),s.interaction("element-highlight"),s.interval().adjust("stack").position("value").color("type",["#38c060","#2593fc"]).label("value",(function(){return{offset:-10,content:t=>t.type+"\n"+t.value+"%"}}));const l=a.createView({region:{start:{x:.5,y:.1},end:{x:1,y:.9}}});function n(){const t=a.getCanvas(),n=a.backgroundGroup,i=s.getCoordinate(),o=i.getCenter(),r=i.getRadius(),d=l.geometries[0].container.getBBox(),c=l.getCoordinate(),u={x:o.x+Math.cos(2*Math.PI-e)*r,y:o.y+Math.sin(2*Math.PI-e)*r},p={x:o.x+Math.cos(e)*r,y:o.y+Math.sin(e)*r},f={x:d.minX,y:c.end.y},m={x:d.minX,y:c.start.y},y=[["M",u.x,u.y],["L",p.x,p.y],["L",m.x,m.y],["L",f.x,f.y],["Z"]];n.addShape("path",{attrs:{path:y,fill:"#e9f4fe"}}),t.draw()}l.axis(!1),l.data([{type:"论坛",value:1.77},{type:"网站",value:1.44},{type:"微信",value:1.12},{type:"客户端",value:1.05},{type:"新闻",value:.81},{type:"视频",value:.39},{type:"博客",value:.37},{type:"报刊",value:.17}]),l.interaction("element-highlight"),l.interval().adjust("stack").position("value").color("type",["#063d8a","#0b53b0","#1770d6","#2593fc","#47abfc","#6dc1fc","#94d6fd","#bbe7fe"]).label("value",{position:"bottom",offsetX:5,offsetY:10,content:t=>t.type+" "+t.value+"%"}),a.render(),n(),a.on("afterpaint",(function(){n()}))})),{})},h={style:{"text-align":"center"}},g=l("div",{id:"pc1"},null,-1);y.render=function(t,e,l,n,i,o){return a(),s("div",h,[g])};const v=[{name:"Anthony",title:"Fullstack Dev"},{name:"Joseph",title:"QA Tester"},{name:"Valerian",title:"UX Expert"},{name:"Hera",title:"Data Scientist"}],x={components:{LikeOutlined:n,ArrowUpOutlined:i,ArrowDownOutlined:o,UserOutlined:r,PieChart:y,MultiChart:p},setup:()=>({data:v})},_={class:"ds-stat-container"},b={style:{"font-size":"0.8em"}},w={href:"https://www.antdv.com/"};x.render=function(t,e,n,i,o,r){const p=c("arrow-up-outlined"),f=c("a-statistic"),m=c("a-card"),y=c("a-col"),h=c("arrow-down-outlined"),g=c("a-row"),v=c("a-page-header"),x=c("UserOutlined"),C=c("a-avatar"),M=c("a-card-meta"),k=c("a-list-item"),j=c("a-list"),A=c("a-list-item-meta"),O=c("MultiChart"),P=c("PieChart"),U=c("a-skeleton");return a(),s("div",_,[l(g,{gutter:8},{default:d((()=>[l(y,{class:"ds-stat",sm:24,md:12,xl:6},{default:d((()=>[l(m,null,{default:d((()=>[l(f,{title:"Feedback",value:11.28,precision:2,suffix:"%","value-style":{color:"#3f8600"}},{prefix:d((()=>[l(p)])),_:1},8,["value"])])),_:1})])),_:1}),l(y,{class:"ds-stat",sm:24,md:12,xl:6},{default:d((()=>[l(m,null,{default:d((()=>[l(f,{title:"Idle",value:9.3,precision:2,suffix:"%",class:"demo-class","value-style":{color:"#cf1322"}},{prefix:d((()=>[l(h)])),_:1},8,["value"])])),_:1})])),_:1}),l(y,{class:"ds-stat",sm:24,md:12,xl:6},{default:d((()=>[l(m,null,{default:d((()=>[l(f,{title:"Active Users",value:112893})])),_:1})])),_:1}),l(y,{class:"ds-stat",sm:24,md:12,xl:6},{default:d((()=>[l(m,null,{default:d((()=>[l(f,{title:"Account Balance (CNY)",precision:2,value:112893})])),_:1})])),_:1})])),_:1}),l(g,{gutter:8},{default:d((()=>[l(y,{class:"ds-stat",lg:24,xl:16},{default:d((()=>[l(g,{gutter:8},{default:d((()=>[l(y,{class:"ds-stat",span:12},{default:d((()=>[l(v,{title:"Team Members"}),l(j,{grid:{gutter:16,xs:1,sm:1,md:2,lg:3,xl:3,xxl:3},"data-source":i.data},{renderItem:d((({item:t})=>[l(k,null,{default:d((()=>[l(m,{bordered:!1},{default:d((()=>[l(C,{size:64},{icon:d((()=>[l(x)])),_:1}),l(M,null,{title:d((()=>[l("span",null,u(t.name),1)])),description:d((()=>[l("span",b,u(t.title),1)])),_:2},1024)])),_:2},1024)])),_:2},1024)])),_:1},8,["data-source"])])),_:1}),l(y,{class:"ds-stat",span:12},{default:d((()=>[l(v,{title:"Comments"}),l(j,{"item-layout":"horizontal","data-source":i.data},{renderItem:d((({item:t})=>[l(k,null,{default:d((()=>[l(A,{description:"Ant Design, a design language for background applications, is refined by Ant UED Team"},{title:d((()=>[l("a",w,u(t.title),1)])),avatar:d((()=>[l(C,{src:"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"})])),_:2},1024)])),_:2},1024)])),_:1},8,["data-source"])])),_:1}),l(y,{class:"ds-stat",span:24},{default:d((()=>[l(v,{title:"Faked Quality"}),l(O)])),_:1}),l(y,{class:"ds-stat",span:24})])),_:1})])),_:1}),l(y,{class:"ds-stat",lg:24,xl:8},{default:d((()=>[l(g,{gutter:8},{default:d((()=>[l(y,{class:"ds-stat",span:24},{default:d((()=>[l(v,{title:"Pie Quality","sub-title":"Some other random description here. Does not have to be too long a text..."}),l(P)])),_:1}),l(y,{class:"ds-stat",span:24},{default:d((()=>[l(v,{title:"Useful Links"}),l(U,{paragraph:{rows:3}})])),_:1})])),_:1})])),_:1})])),_:1})])};export default x;
