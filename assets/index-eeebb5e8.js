import{s as g}from"./request-b5e161a7.js";import{r as b,f as u,o as T,c as $,a as _,g as e,w as a,F,j as c,t as N,E as v,x as U}from"./index-c53bcba5.js";const M=d=>g({url:"/example/admin",method:"get",params:d}),P=d=>g({url:"/example/admin",method:"post",data:d}),j=d=>g({url:"/example/admin",method:"put",data:d}),I=d=>g({url:"/example/admin",method:"delete",params:d}),L={target:"_blank"},Q=_("br",null,null,-1),G={class:"dialog-footer"},K={__name:"index",setup(d){const n=b({total:0,query:{limit:20,page:1,order:null,name:null},data:[]}),k=t=>{n.value.query.name=null,n.value.query.order=null,r()},x=t=>{n.value.query.page=t,r()},C=t=>{n.value.query.limit=t,r()},w=({column:t,prop:o,order:p})=>{let s="";p==="descending"?s="-":p==="ascending"&&(s="+"),n.value.query.order=s+o,r()},r=()=>{M(n.value.query).then(t=>{n.value.data=t.data,n.value.total=t.total})},h=b(null),l=b({visible:!1,title:"dialog",form:{},formRule:{email:[{required:!0,message:"邮箱",trigger:"blur"},{min:5,message:"用户名最少为5个字符",trigger:"blur"}]},formAction:"add"}),V=()=>{l.value.title="创建数据",l.value.visible=!0,l.value.formAction="add",l.value.form={}},q=t=>{l.value.title="创建数据",l.value.visible=!0,l.value.formAction="edit",l.value.form=t},E=()=>{h.value.validate(t=>{t?l.value.formAction==="add"?P(l.value.form).then(o=>{l.value.visible=!1,v.info(o),r()}):l.value.formAction==="edit"?(j(l.value.form).then(o=>{l.value.visible=!1,v.info(o),r()}),l.value.visible=!1):v.info("提交错误"):v.error("请输入正确的数据！")})},A=t=>{U.confirm(`请仔细确认是否删除数据[${t}]?`,"警告",{confirmButtonText:"删除",cancelButtonText:"取消",type:"warning"}).then(()=>{I({id:t}).then(o=>{v.warning(o),r()})})};return r(),(t,o)=>{const p=u("el-input"),s=u("el-form-item"),m=u("el-button"),y=u("el-form"),f=u("el-table-column"),D=u("el-table"),B=u("el-pagination"),R=u("el-main"),S=u("el-dialog");return T(),$(F,null,[_("div",null,[e(y,{inline:!0},{default:a(()=>[e(s,{label:"名称"},{default:a(()=>[e(p,{modelValue:n.value.query.name,"onUpdate:modelValue":o[0]||(o[0]=i=>n.value.query.name=i),placeholder:"名称",clearable:""},null,8,["modelValue"])]),_:1}),e(s,null,{default:a(()=>[e(m,{type:"primary",icon:"search",onClick:r},{default:a(()=>[c(" 查询 ")]),_:1}),e(m,{type:"info",icon:"Refresh",onClick:k},{default:a(()=>[c(" 重置 ")]),_:1})]),_:1})]),_:1})]),e(R,{style:{"background-color":"#fff"}},{default:a(()=>[e(m,{type:"primary",icon:"Plus",onClick:V},{default:a(()=>[c(" 新增 ")]),_:1}),e(D,{data:n.value.data,style:{width:"100%"},onSortChange:w},{default:a(()=>[e(f,{label:"ID",prop:"id",width:"80",sortable:"custom"}),e(f,{label:"名称",prop:"nickname",width:"160"}),e(f,{label:"邮箱",width:"240"},{default:a(i=>[_("a",L,N(i.row.email),1)]),_:1}),e(f,{prop:"updatedAt",label:"最近更新",width:"200"}),e(f,{prop:"createdAt",label:"创建日期",width:"200"}),e(f,{fixed:"right",label:"操作",width:"105"},{default:a(i=>[e(m,{link:"",type:"primary",onClick:z=>q(i.row)},{default:a(()=>[c(" 编辑 ")]),_:2},1032,["onClick"]),e(m,{link:"",type:"danger",onClick:z=>A(i.row.id)},{default:a(()=>[c(" 删除 ")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"]),Q,e(B,{background:"",layout:"total, sizes, prev, pager, next",total:n.value.total,"page-size":n.value.query.limit,onCurrentChange:x,onSizeChange:C},null,8,["total","page-size"])]),_:1}),e(S,{modelValue:l.value.visible,"onUpdate:modelValue":o[3]||(o[3]=i=>l.value.visible=i),title:l.value.title,"close-on-click-modal":!1,"destroy-on-close":"","close-on-press-escape":"",center:""},{footer:a(()=>[_("span",G,[e(m,{onClick:o[2]||(o[2]=i=>l.value.visible=!1)},{default:a(()=>[c("取消")]),_:1}),e(m,{type:"primary",onClick:E},{default:a(()=>[c("确定")]),_:1})])]),default:a(()=>[e(y,{ref_key:"dialogRef",ref:h,"label-position":"left",model:l.value.form,rules:l.value.formRule},{default:a(()=>[e(s,{label:"邮箱",prop:"email"},{default:a(()=>[e(p,{modelValue:l.value.form.email,"onUpdate:modelValue":o[1]||(o[1]=i=>l.value.form.email=i)},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])],64)}}};export{K as default};
