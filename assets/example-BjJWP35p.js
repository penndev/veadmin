import{s as _,r as p,A as w,E as f,f as i,c as E,o as h,g as a,w as o,j as s,a as b,h as k,y as S,t as A,F as R}from"./index-RmgN8Hxi.js";import{_ as B}from"./Pagination-DtjIf8mx.js";const $=d=>_({url:"/example/list",method:"get",params:d}),z=d=>_({url:"/example/create",method:"post",data:d}),F=d=>_({url:"/example/update",method:"put",data:d}),N=d=>_({url:"/example/delete",method:"delete",params:d}),U={target:"_blank"},I=b("br",null,null,-1),P={class:"dialog-footer"},Q={__name:"example",setup(d){const g=p(),e=p({selectStat:!1,total:0,query:{limit:20,page:1,order:null,name:null},data:[],handleTableData:()=>{$(e.value.query).then(n=>{e.value.data=n.data,e.value.total=n.total})},handleQueryRefresh:n=>{e.value.query.name=null,e.value.query.order=null,e.value.handleTableData()},handleChangePage:n=>{e.value.query.page=n,e.value.handleTableData()},handleChangeLimit:n=>{e.value.query.limit=n,e.value.handleTableData()},handleSortChange:({column:n,prop:t,order:v})=>{let m="";v==="descending"?m="-":v==="ascending"&&(m="+"),e.value.query.order=m+t,e.value.handleTableData()},handleInvertSelection:()=>{e.value.data.forEach(n=>{g.value.toggleRowSelection(n)})}}),y=p(null),l=p({visible:!1,title:"dialog",form:{},formRule:{email:[{required:!0,message:"邮箱",trigger:"blur"},{min:5,message:"用户名最少为5个字符",trigger:"blur"}]},formAction:"add",handleDialogAdd:()=>{l.value.title="创建数据",l.value.visible=!0,l.value.formAction="add",l.value.form={}},handleDialogEdit:n=>{l.value.title="编辑数据",l.value.visible=!0,l.value.formAction="edit",l.value.form=n},handleSubmitForm:()=>{y.value.validate(n=>{n?l.value.formAction==="add"?z(l.value.form).then(t=>{l.value.visible=!1,f.info(t),e.value.handleTableData()}):l.value.formAction==="edit"?F(l.value.form).then(t=>{l.value.visible=!1,f.info(t),e.value.handleTableData()}):f.error("提交错误"):f.error("请输入正确的数据！")})},handleDialogDelete:n=>{w.confirm(`请仔细确认是否删除数据[${n}]?`,"警告",{confirmButtonText:"删除",cancelButtonText:"取消",type:"warning"}).then(()=>{N({id:n}).then(t=>{f.warning(t),e.value.handleTableData()})})}});return e.value.handleTableData(),(n,t)=>{const v=i("el-input"),m=i("el-form-item"),r=i("el-button"),C=i("el-form"),D=i("el-row"),c=i("el-table-column"),x=i("el-table"),T=i("el-main"),V=i("el-dialog");return h(),E(R,null,[a(C,{inline:!0},{default:o(()=>[a(m,{label:"名称"},{default:o(()=>[a(v,{modelValue:e.value.query.name,"onUpdate:modelValue":t[0]||(t[0]=u=>e.value.query.name=u),placeholder:"名称",clearable:""},null,8,["modelValue"])]),_:1}),a(m,null,{default:o(()=>[a(r,{type:"primary",icon:"search",onClick:e.value.handleTableData},{default:o(()=>[s(" 查询 ")]),_:1},8,["onClick"]),a(r,{type:"info",icon:"Refresh",onClick:e.value.handleQueryRefresh},{default:o(()=>[s(" 重置 ")]),_:1},8,["onClick"])]),_:1})]),_:1}),a(T,{class:"ea-table"},{default:o(()=>[a(D,null,{default:o(()=>[a(r,{icon:e.value.selectStat?"SemiSelect":"Select",onClick:t[1]||(t[1]=u=>(e.value.selectStat=!e.value.selectStat)?"":g.value.clearSelection())},null,8,["icon"]),e.value.selectStat?(h(),k(r,{key:0,onClick:e.value.handleInvertSelection},{default:o(()=>[s(" 反选 ")]),_:1},8,["onClick"])):S("",!0),a(r,{type:"primary",icon:"Plus",onClick:l.value.handleDialogAdd},{default:o(()=>[s(" 新增 ")]),_:1},8,["onClick"])]),_:1}),a(x,{ref_key:"tableRef",ref:g,data:e.value.data,onSortChange:e.value.handleSortChange},{default:o(()=>[e.value.selectStat?(h(),k(c,{key:0,type:"selection",width:"50"})):S("",!0),a(c,{label:"ID",prop:"id",width:"80",sortable:"custom"}),a(c,{label:"名称",prop:"nickname",align:"center"}),a(c,{label:"邮箱"},{default:o(u=>[b("a",U,A(u.row.email),1)]),_:1}),a(c,{prop:"updatedAt",label:"最近更新"}),a(c,{prop:"createdAt",label:"创建日期"}),a(c,{fixed:"right",label:"操作"},{default:o(u=>[a(r,{link:"",type:"primary",onClick:q=>l.value.handleDialogEdit(u.row)},{default:o(()=>[s(" 编辑 ")]),_:2},1032,["onClick"]),a(r,{link:"",type:"danger",onClick:q=>l.value.handleDialogDelete(u.row.id)},{default:o(()=>[s(" 删除 ")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","onSortChange"]),I,a(B,{"page-size":e.value.query.limit,"onUpdate:pageSize":t[2]||(t[2]=u=>e.value.query.limit=u),total:e.value.total,onCurrentChange:e.value.handleChangePage,onSizeChange:e.value.handleChangeLimit},null,8,["page-size","total","onCurrentChange","onSizeChange"])]),_:1}),a(V,{modelValue:l.value.visible,"onUpdate:modelValue":t[5]||(t[5]=u=>l.value.visible=u),title:l.value.title,"close-on-click-modal":!1,"destroy-on-close":"","close-on-press-escape":"",center:""},{footer:o(()=>[b("span",P,[a(r,{onClick:t[4]||(t[4]=u=>l.value.visible=!1)},{default:o(()=>[s("取消")]),_:1}),a(r,{type:"primary",onClick:l.value.handleSubmitForm},{default:o(()=>[s("确定")]),_:1},8,["onClick"])])]),default:o(()=>[a(C,{ref_key:"dialogRef",ref:y,"label-position":"left",model:l.value.form,rules:l.value.formRule},{default:o(()=>[a(m,{label:"邮箱",prop:"email"},{default:o(()=>[a(v,{modelValue:l.value.form.email,"onUpdate:modelValue":t[3]||(t[3]=u=>l.value.form.email=u)},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])],64)}}};export{Q as default};
