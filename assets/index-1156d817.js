import{s as g}from"./request-ee147c39.js";import{r as p,f as r,o as b,c as q,a as h,g as a,w as t,j as s,h as k,s as S,t as E,F as R,E as f,v as A}from"./index-4047bd4e.js";const B=d=>g({url:"/example/list",method:"get",params:d}),z=d=>g({url:"/example/create",method:"post",data:d}),$=d=>g({url:"/example/update",method:"put",data:d}),F=d=>g({url:"/example/delete",method:"delete",params:d}),N={target:"_blank"},I=h("br",null,null,-1),P={class:"dialog-footer"},M={__name:"index",setup(d){const _=p(),e=p({selectStat:!1,total:0,query:{limit:20,page:1,order:null,name:null},data:[],handleTableData:()=>{B(e.value.query).then(n=>{e.value.data=n.data,e.value.total=n.total})},handleQueryRefresh:n=>{e.value.query.name=null,e.value.query.order=null,e.value.handleTableData()},handleChangePage:n=>{e.value.query.page=n,e.value.handleTableData()},handleChangeLimit:n=>{e.value.query.limit=n,e.value.handleTableData()},handleSortChange:({column:n,prop:o,order:v})=>{let m="";v==="descending"?m="-":v==="ascending"&&(m="+"),e.value.query.order=m+o,e.value.handleTableData()},handleInvertSelection:()=>{e.value.data.forEach(n=>{_.value.toggleRowSelection(n)})}}),C=p(null),l=p({visible:!1,title:"dialog",form:{},formRule:{email:[{required:!0,message:"邮箱",trigger:"blur"},{min:5,message:"用户名最少为5个字符",trigger:"blur"}]},formAction:"add",handleDialogAdd:()=>{l.value.title="创建数据",l.value.visible=!0,l.value.formAction="add",l.value.form={}},handleDialogEdit:n=>{l.value.title="编辑数据",l.value.visible=!0,l.value.formAction="edit",l.value.form=n},handleSubmitForm:()=>{C.value.validate(n=>{n?l.value.formAction==="add"?z(l.value.form).then(o=>{l.value.visible=!1,f.info(o),e.value.handleTableData()}):l.value.formAction==="edit"?$(l.value.form).then(o=>{l.value.visible=!1,f.info(o),e.value.handleTableData()}):f.error("提交错误"):f.error("请输入正确的数据！")})},handleDialogDelete:n=>{A.confirm(`请仔细确认是否删除数据[${n}]?`,"警告",{confirmButtonText:"删除",cancelButtonText:"取消",type:"warning"}).then(()=>{F({id:n}).then(o=>{f.warning(o),e.value.handleTableData()})})}});return e.value.handleTableData(),(n,o)=>{const v=r("el-input"),m=r("el-form-item"),i=r("el-button"),y=r("el-form"),c=r("el-table-column"),D=r("el-table"),x=r("el-pagination"),w=r("el-main"),T=r("el-dialog");return b(),q(R,null,[h("div",null,[a(y,{inline:!0},{default:t(()=>[a(m,{label:"名称"},{default:t(()=>[a(v,{modelValue:e.value.query.name,"onUpdate:modelValue":o[0]||(o[0]=u=>e.value.query.name=u),placeholder:"名称",clearable:""},null,8,["modelValue"])]),_:1}),a(m,null,{default:t(()=>[a(i,{type:"primary",icon:"search",onClick:e.value.handleTableData},{default:t(()=>[s(" 查询 ")]),_:1},8,["onClick"]),a(i,{type:"info",icon:"Refresh",onClick:e.value.handleQueryRefresh},{default:t(()=>[s(" 重置 ")]),_:1},8,["onClick"])]),_:1})]),_:1})]),a(w,{class:"ea-table"},{default:t(()=>[a(i,{icon:e.value.selectStat?"SemiSelect":"Select",onClick:o[1]||(o[1]=u=>(e.value.selectStat=!e.value.selectStat)?"":_.value.clearSelection())},null,8,["icon"]),e.value.selectStat?(b(),k(i,{key:0,onClick:e.value.handleInvertSelection},{default:t(()=>[s(" 反选 ")]),_:1},8,["onClick"])):S("",!0),a(i,{type:"primary",icon:"Plus",onClick:l.value.handleDialogAdd},{default:t(()=>[s(" 新增 ")]),_:1},8,["onClick"]),a(D,{ref_key:"tableRef",ref:_,data:e.value.data,onSortChange:e.value.handleSortChange},{default:t(()=>[e.value.selectStat?(b(),k(c,{key:0,type:"selection",width:"50"})):S("",!0),a(c,{label:"ID",prop:"id",width:"80",sortable:"custom"}),a(c,{label:"名称",prop:"nickname",width:"160",align:"center"}),a(c,{label:"邮箱",width:"240"},{default:t(u=>[h("a",N,E(u.row.email),1)]),_:1}),a(c,{prop:"updatedAt",label:"最近更新",width:"200"}),a(c,{prop:"createdAt",label:"创建日期",width:"200"}),a(c,{fixed:"right",label:"操作",width:"105"},{default:t(u=>[a(i,{link:"",type:"primary",onClick:V=>l.value.handleDialogEdit(u.row)},{default:t(()=>[s(" 编辑 ")]),_:2},1032,["onClick"]),a(i,{link:"",type:"danger",onClick:V=>l.value.handleDialogDelete(u.row.id)},{default:t(()=>[s(" 删除 ")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","onSortChange"]),I,a(x,{background:"",layout:"total, sizes, prev, pager, next",total:e.value.total,"page-size":e.value.query.limit,onCurrentChange:e.value.handleChangePage,onSizeChange:e.value.handleChangeLimit},null,8,["total","page-size","onCurrentChange","onSizeChange"])]),_:1}),a(T,{modelValue:l.value.visible,"onUpdate:modelValue":o[4]||(o[4]=u=>l.value.visible=u),title:l.value.title,"close-on-click-modal":!1,"destroy-on-close":"","close-on-press-escape":"",center:""},{footer:t(()=>[h("span",P,[a(i,{onClick:o[3]||(o[3]=u=>l.value.visible=!1)},{default:t(()=>[s("取消")]),_:1}),a(i,{type:"primary",onClick:l.value.handleSubmitForm},{default:t(()=>[s("确定")]),_:1},8,["onClick"])])]),default:t(()=>[a(y,{ref_key:"dialogRef",ref:C,"label-position":"left",model:l.value.form,rules:l.value.formRule},{default:t(()=>[a(m,{label:"邮箱",prop:"email"},{default:t(()=>[a(v,{modelValue:l.value.form.email,"onUpdate:modelValue":o[2]||(o[2]=u=>l.value.form.email=u)},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])],64)}}};export{M as default};
