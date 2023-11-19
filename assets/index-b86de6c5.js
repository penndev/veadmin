import{g as T,p as V,a as q,d as E}from"./example-fe367490.js";import{r as f,f as r,o as g,c as A,a as p,g as a,w as o,F as R,j as d,h as C,q as y,t as B,E as v,s as $}from"./index-9abc308a.js";import"./request-2f26b6fc.js";const z={target:"_blank"},F=p("br",null,null,-1),N={class:"dialog-footer"},M={__name:"index",setup(I){const h=f(),e=f({total:0,query:{limit:20,page:1,order:null,name:null},data:[],handleTableData:()=>{T(e.value.query).then(n=>{e.value.data=n.data,e.value.total=n.total})},handleQueryRefresh:n=>{e.value.query.name=null,e.value.query.order=null,e.value.handleTableData()},handleChangePage:n=>{e.value.query.page=n,e.value.handleTableData()},handleChangeLimit:n=>{e.value.query.limit=n,e.value.handleTableData()},handleSortChange:({column:n,prop:t,order:c})=>{let s="";c==="descending"?s="-":c==="ascending"&&(s="+"),e.value.query.order=s+t,e.value.handleTableData()},handleInvertSelection:()=>{e.value.data.forEach(n=>{h.value.toggleRowSelection(n)})}}),_=f(null),l=f({visible:!1,title:"dialog",form:{},formRule:{email:[{required:!0,message:"邮箱",trigger:"blur"},{min:5,message:"用户名最少为5个字符",trigger:"blur"}]},formAction:"add",handleDialogAdd:()=>{l.value.title="创建数据",l.value.visible=!0,l.value.formAction="add",l.value.form={}},handleDialogEdit:n=>{l.value.title="编辑数据",l.value.visible=!0,l.value.formAction="edit",l.value.form=n},handleSubmitForm:()=>{_.value.validate(n=>{n?l.value.formAction==="add"?V(l.value.form).then(t=>{l.value.visible=!1,v.info(t),e.value.handleTableData()}):l.value.formAction==="edit"?q(l.value.form).then(t=>{l.value.visible=!1,v.info(t),e.value.handleTableData()}):v.error("提交错误"):v.error("请输入正确的数据！")})},handleDialogDelete:n=>{$.confirm(`请仔细确认是否删除数据[${n}]?`,"警告",{confirmButtonText:"删除",cancelButtonText:"取消",type:"warning"}).then(()=>{E({id:n}).then(t=>{v.warning(t),e.value.handleTableData()})})}});return e.value.handleTableData(),(n,t)=>{const c=r("el-input"),s=r("el-form-item"),u=r("el-button"),b=r("el-form"),m=r("el-table-column"),k=r("el-table"),S=r("el-pagination"),D=r("el-main"),w=r("el-dialog");return g(),A(R,null,[p("div",null,[a(b,{inline:!0},{default:o(()=>[a(s,{label:"名称"},{default:o(()=>[a(c,{modelValue:e.value.query.name,"onUpdate:modelValue":t[0]||(t[0]=i=>e.value.query.name=i),placeholder:"名称",clearable:""},null,8,["modelValue"])]),_:1}),a(s,null,{default:o(()=>[a(u,{type:"primary",icon:"search",onClick:e.value.handleTableData},{default:o(()=>[d(" 查询 ")]),_:1},8,["onClick"]),a(u,{type:"info",icon:"Refresh",onClick:e.value.handleQueryRefresh},{default:o(()=>[d(" 重置 ")]),_:1},8,["onClick"])]),_:1})]),_:1})]),a(D,{style:{"background-color":"#fff"}},{default:o(()=>[a(u,{type:"primary",icon:e.value.selectStat?"SemiSelect":"Select",onClick:t[1]||(t[1]=i=>e.value.selectStat=!e.value.selectStat)},null,8,["icon"]),e.value.selectStat?(g(),C(u,{key:0,onClick:e.value.handleInvertSelection},{default:o(()=>[d(" 反选 ")]),_:1},8,["onClick"])):y("",!0),e.value.selectStat?(g(),C(u,{key:1,onClick:t[2]||(t[2]=i=>h.value.clearSelection())},{default:o(()=>[d(" 清空 ")]),_:1})):y("",!0),a(u,{type:"primary",icon:"Plus",onClick:n.handleDialogAdd},{default:o(()=>[d(" 新增 ")]),_:1},8,["onClick"]),a(k,{data:e.value.data,onSortChange:e.value.handleSortChange},{default:o(()=>[a(m,{label:"ID",prop:"id",width:"80",sortable:"custom"}),a(m,{label:"名称",prop:"nickname",width:"160",align:"center"}),a(m,{label:"邮箱",width:"240"},{default:o(i=>[p("a",z,B(i.row.email),1)]),_:1}),a(m,{prop:"updatedAt",label:"最近更新",width:"200"}),a(m,{prop:"createdAt",label:"创建日期",width:"200"}),a(m,{fixed:"right",label:"操作",width:"105"},{default:o(i=>[a(u,{link:"",type:"primary",onClick:x=>l.value.handleDialogEdit(i.row)},{default:o(()=>[d(" 编辑 ")]),_:2},1032,["onClick"]),a(u,{link:"",type:"danger",onClick:x=>l.value.handleDialogDelete(i.row.id)},{default:o(()=>[d(" 删除 ")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","onSortChange"]),F,a(S,{background:"",layout:"total, sizes, prev, pager, next",total:e.value.total,"page-size":e.value.query.limit,onCurrentChange:e.value.handleChangePage,onSizeChange:e.value.handleChangeLimit},null,8,["total","page-size","onCurrentChange","onSizeChange"])]),_:1}),a(w,{modelValue:l.value.visible,"onUpdate:modelValue":t[5]||(t[5]=i=>l.value.visible=i),title:l.value.title,"close-on-click-modal":!1,"destroy-on-close":"","close-on-press-escape":"",center:""},{footer:o(()=>[p("span",N,[a(u,{onClick:t[4]||(t[4]=i=>l.value.visible=!1)},{default:o(()=>[d("取消")]),_:1}),a(u,{type:"primary",onClick:l.value.handleSubmitForm},{default:o(()=>[d("确定")]),_:1},8,["onClick"])])]),default:o(()=>[a(b,{ref_key:"dialogRef",ref:_,"label-position":"left",model:l.value.form,rules:l.value.formRule},{default:o(()=>[a(s,{label:"邮箱",prop:"email"},{default:o(()=>[a(c,{modelValue:l.value.form.email,"onUpdate:modelValue":t[3]||(t[3]=i=>l.value.form.email=i)},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])],64)}}};export{M as default};
