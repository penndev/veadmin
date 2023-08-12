import{_ as q,r as p,b as v,d as L,u as E,e as N,f as n,o as k,c as R,a as o,g as e,w as a,h as F,i as P,j,p as z,k as M,l as T,E as x}from"./index-c53bcba5.js";import{s as y}from"./request-b5e161a7.js";const A=l=>y({url:"/captcha",method:"get",params:l}),G=l=>y({url:"/login",method:"post",data:l});const V=l=>(z("data-v-a3d5878d"),l=l(),M(),l),H={id:"userLayout"},J={class:"login_panle"},K={class:"login_panle_form"},O=V(()=>o("div",{class:"login_panle_form_title"},[o("img",{class:"login_panle_form_title_logo",src:T}),o("div",{class:"login_panle_form_title_p"}," 用户登录 ")],-1)),Q={class:"input-icon"},W={class:"input-icon"},X={class:"vPicBox"},Y={class:"vPic"},Z=["src"],$=V(()=>o("div",{class:"login_panle_right"},null,-1)),ee={__name:"index",setup(l){const i=p("lock"),w=()=>{i.value=i.value==="lock"?"unlock":"lock"},m=p(""),u=()=>{A().then(r=>{m.value=r.captchaURL,t.captchaID=r.captchaID,t.captcha=null})};u();const t=v({username:"",password:"",captchaID:"",captcha:""}),C=v({username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:5,message:"用户名最少为5个字符",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,message:"密码最少为6个字符",trigger:"blur"}],captcha:[{required:!0,message:"请输入验证码",trigger:"blur"},{len:4,message:"验证码长度为四位",trigger:"change"}]}),g=p(null),h=L(),b=E(),I=N(),U=()=>{g.value.validate(r=>{r?G(t).then(s=>{if(typeof s.token>"u"){x.error("登录失败，未获取到token！");return}h.token=s.token,h.routes=s.routes,b.push(I.query.redirect??"/")}).catch(()=>{u()}):x.error("请输入正确的数据！")})};return(r,s)=>{const B=n("User"),f=n("el-icon"),_=n("el-input"),d=n("el-form-item"),D=n("el-button"),S=n("el-form");return k(),R("div",H,[o("div",J,[o("div",K,[O,e(S,{ref_key:"loginForm",ref:g,rules:C,model:t},{default:a(()=>[e(d,{prop:"username"},{default:a(()=>[e(_,{modelValue:t.username,"onUpdate:modelValue":s[0]||(s[0]=c=>t.username=c),placeholder:"请输入用户名"},{suffix:a(()=>[o("span",Q,[e(f,null,{default:a(()=>[e(B)]),_:1})])]),_:1},8,["modelValue"])]),_:1}),e(d,{prop:"password"},{default:a(()=>[e(_,{modelValue:t.password,"onUpdate:modelValue":s[1]||(s[1]=c=>t.password=c),placeholder:"请输入密码",type:i.value==="lock"?"password":"text"},{suffix:a(()=>[o("a",W,[e(f,null,{default:a(()=>[(k(),F(P(i.value),{onClick:w}))]),_:1})])]),_:1},8,["modelValue","type"])]),_:1}),e(d,{prop:"captcha"},{default:a(()=>[o("div",X,[e(_,{modelValue:t.captcha,"onUpdate:modelValue":s[2]||(s[2]=c=>t.captcha=c),placeholder:"请输入验证码",style:{width:"60%"}},null,8,["modelValue"]),o("div",Y,[o("img",{alt:"验证码",src:m.value,onClick:u},null,8,Z)])])]),_:1}),e(d,null,{default:a(()=>[e(D,{type:"primary",size:"large",style:{width:"46%"},onClick:U},{default:a(()=>[j(" 登 录 ")]),_:1})]),_:1})]),_:1},8,["rules","model"])]),$])])}}},se=q(ee,[["__scopeId","data-v-a3d5878d"]]);export{se as default};
