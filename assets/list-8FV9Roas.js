import{g as le,a as ae,b as te,c as oe,u as E,d as ne,e as ue,f as de}from"./archive-C8i6ISG2.js";import{r as A,f as r,o as s,c as _,a as w,g as l,w as o,h as f,j as m,t as C,F as y,v as h,s as x,E as b,x as q}from"./index-Cxq84DQI.js";import"./request-DKDdZPk8.js";const re=w("br",null,null,-1),ie=w("br",null,null,-1),se=w("br",null,null,-1),me={class:"dialog-footer"},ye={__name:"list",setup(pe){const i=A({total:0,query:{limit:20,page:1,order:"-id",id:null,name:null,status:null,updateStart:null,updateEnd:null},data:[]}),$=n=>{i.value.query.page=n,c()},R=n=>{i.value.query.limit=n,c()},z=({column:n,prop:t,order:d})=>{let u="";d==="descending"?u="-":d==="ascending"&&(u="+"),i.value.query.order=u+t,c()},c=()=>{le(i.value.query).then(n=>{i.value.data=n.data,i.value.total=n.total})},U=A(null),a=A({visible:!1,title:"dialog",vodTypeList:[],vodTypeDict:{},formTempSelectType:null,vodTagList:[],formTempSelectTag:null,form:{},formRule:{name:[{required:!0,message:"名称",trigger:"blur"},{min:2,message:"用户名最少为2个字符",trigger:"blur"}],pic:[{required:!0,message:"封面",trigger:"blur"},{min:2,message:"用户名最少为5个字符",trigger:"blur"}]},formAction:"add"}),N=()=>{ae({name:a.value.formTempSelectTag,page:1,limit:20}).then(n=>{a.value.vodTagList=n.data})},P=n=>{a.value.formTempSelectTag=null,te({archiveTagId:n.id,archiveListId:a.value.form.id}).then(t=>{const d={id:t.data.id,ArchiveTag:n};a.value.form.Tags.push(d),b.info(t.message)})},D=(n,t)=>{const d=t.findIndex(u=>u.id===n);q.confirm("请仔细确认是否删除 "+t[d].ArchiveTag.name+" ?","警告",{confirmButtonText:"删除",cancelButtonText:"取消",type:"warning"}).then(()=>{de({id:n}).then(u=>{b.warning(u),d!==-1&&t.splice(d,1)})})},F=()=>{a.value.title="新增资料",a.value.visible=!0,a.value.formAction="add",a.value.form={}},M=n=>{a.value.title="修改资料-"+n.name,a.value.visible=!0,a.value.formAction="edit",a.value.form=n},j=()=>{U.value.validate(n=>{n?a.value.formAction==="add"?oe(a.value.form).then(t=>{a.value.visible=!1,b.success(t),c()}):a.value.formAction==="edit"?(E(a.value.form).then(t=>{a.value.visible=!1,b.info(t),c()}),a.value.visible=!1):b.warning("提交错误"):b.error("请输入正确的数据！")})},G=n=>{const t=()=>{E({id:n.id,status:!n.status}).then(d=>{n.status=!n.status,b.info(d)})};n.status?q.confirm("请仔细确认是否下架 "+n.name+" ?","警告",{confirmButtonText:"下架",cancelButtonText:"取消",type:"warning"}).then(()=>{t()}):t()},H=n=>{q.confirm("请仔细确认是否删除 "+n.fileName+" ?","警告",{confirmButtonText:"删除",cancelButtonText:"取消",type:"warning"}).then(()=>{ne({id:n.id}).then(t=>{b.warning(t),c()})})};return(()=>{ue({limit:9999}).then(n=>{a.value.vodTypeList=n.data;for(const t of n.data)a.value.vodTypeDict[t.id]=t.name})})(),c(),(n,t)=>{const d=r("el-input"),u=r("el-form-item"),V=r("el-option"),k=r("el-select"),I=r("el-date-picker"),T=r("el-button"),B=r("el-form"),g=r("el-table-column"),J=r("el-image"),K=r("el-link"),L=r("el-tag"),O=r("el-table"),Q=r("el-pagination"),W=r("el-main"),X=r("el-switch"),p=r("el-col"),Y=r("el-text"),Z=r("el-input-number"),S=r("el-row"),ee=r("el-dialog");return s(),_(y,null,[w("div",null,[l(B,{inline:!0},{default:o(()=>[l(u,{label:"ID"},{default:o(()=>[l(d,{modelValue:i.value.query.id,"onUpdate:modelValue":t[0]||(t[0]=e=>i.value.query.id=e),placeholder:"ID",style:{"max-width":"120px"}},null,8,["modelValue"])]),_:1}),l(u,{label:"名称"},{default:o(()=>[l(d,{modelValue:i.value.query.name,"onUpdate:modelValue":t[1]||(t[1]=e=>i.value.query.name=e),placeholder:"名称",style:{"max-width":"180px"}},null,8,["modelValue"])]),_:1}),l(u,{label:"状态",style:{"min-width":"180px"}},{default:o(()=>[l(k,{modelValue:i.value.query.status,"onUpdate:modelValue":t[2]||(t[2]=e=>i.value.query.status=e),clearable:"",width:"120px"},{default:o(()=>[(s(),f(V,{key:0,label:"下架",value:0})),(s(),f(V,{key:1,label:"上架",value:1}))]),_:1},8,["modelValue"])]),_:1}),l(u,{label:"日期"},{default:o(()=>[l(I,{modelValue:i.value.query.updateStart,"onUpdate:modelValue":t[3]||(t[3]=e=>i.value.query.updateStart=e),type:"datetime",placeholder:"选择开始时间",style:{"max-width":"180px"}},null,8,["modelValue"]),m("   "),l(I,{modelValue:i.value.query.updateEnd,"onUpdate:modelValue":t[4]||(t[4]=e=>i.value.query.updateEnd=e),type:"datetime",placeholder:"选择结束时间",style:{"max-width":"180px"}},null,8,["modelValue"])]),_:1}),l(u,null,{default:o(()=>[l(T,{type:"primary",icon:"search",onClick:c},{default:o(()=>[m(" 查询 ")]),_:1})]),_:1})]),_:1})]),l(W,{class:"ea-table"},{default:o(()=>[l(T,{type:"primary",icon:"Plus",onClick:F},{default:o(()=>[m(" 新增 ")]),_:1}),l(O,{data:i.value.data,onSortChange:z},{default:o(()=>[l(g,{label:"ID",prop:"id",fixed:"",width:"80",sortable:"custom"}),l(g,{label:"名称",prop:"name",align:"center"}),l(g,{label:"分类",align:"center"},{default:o(e=>[m(C(a.value.vodTypeDict[e.row.archiveCategoryId]??"未知"),1)]),_:1}),l(g,{label:"封面",align:"center"},{default:o(e=>[l(J,{src:e.row.Pic,"zoom-rate":1.2,"preview-src-list":[e.row.Pic],fit:"cover",style:{width:"60px","min-height":"90px"}},null,8,["src","preview-src-list"])]),_:1}),l(g,{label:"状态",align:"center"},{default:o(e=>[l(K,{type:e.row.status>0?"success":"danger",onClick:v=>G(e.row)},{default:o(()=>[m(C(e.row.status>0?e.row.status>1?e.row.status:"上架":"下架"),1)]),_:2},1032,["type","onClick"])]),_:1}),l(g,{label:"标签",width:"250",align:"center"},{default:o(e=>[(s(!0),_(y,null,h(e.row.Tags,v=>(s(),f(L,{key:v.id,closable:"",style:{margin:"2px 3px"},onClose:ve=>D(v.id,e.row.Tags)},{default:o(()=>[m(C(v==null?void 0:v.ArchiveTag.name),1)]),_:2},1032,["onClose"]))),128))]),_:1}),l(g,{label:"最近更新",prop:"updatedAt",width:"200",align:"center"}),l(g,{label:"操作",fixed:"right",width:"120"},{default:o(e=>[l(T,{link:"",type:"primary",onClick:v=>M(e.row)},{default:o(()=>[m(" 编辑 ")]),_:2},1032,["onClick"]),l(T,{link:"",type:"danger",onClick:v=>H(e.row)},{default:o(()=>[m(" 删除 ")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"]),re,l(Q,{background:"",layout:"total, sizes, prev, pager, next",total:i.value.total,"page-size":i.value.query.limit,onCurrentChange:$,onSizeChange:R},null,8,["total","page-size"])]),_:1}),l(ee,{modelValue:a.value.visible,"onUpdate:modelValue":t[18]||(t[18]=e=>a.value.visible=e),title:a.value.title,"close-on-click-modal":!1,"destroy-on-close":"","close-on-press-escape":"",center:"",onClose:t[19]||(t[19]=e=>a.value.formTempSelectType=null)},{footer:o(()=>[w("span",me,[l(T,{onClick:t[17]||(t[17]=e=>a.value.visible=!1)},{default:o(()=>[m("取消")]),_:1}),l(T,{type:"primary",onClick:j},{default:o(()=>[m("确定")]),_:1})])]),default:o(()=>[l(B,{ref_key:"dialogRef",ref:U,model:a.value.form,rules:a.value.formRule,"label-width":"80px"},{default:o(()=>[l(u,{label:"状态",prop:"status"},{default:o(()=>[l(X,{modelValue:a.value.form.status,"onUpdate:modelValue":t[5]||(t[5]=e=>a.value.form.status=e),"active-value":1,"active-text":"上架","inactive-value":0,"inactive-text":"下架"},null,8,["modelValue"])]),_:1}),l(u,{label:"视频分类",prop:"videoTypeId"},{default:o(()=>[l(p,{span:8},{default:o(()=>[l(k,{modelValue:a.value.formTempSelectType,"onUpdate:modelValue":t[6]||(t[6]=e=>a.value.formTempSelectType=e),placeholder:"选一级分类",style:{width:"100%"}},{default:o(()=>[(s(!0),_(y,null,h(a.value.vodTypeList,e=>(s(),_(y,null,[e.parent==0?(s(),f(V,{key:e.id,label:e.name,value:e.id},null,8,["label","value"])):x("",!0)],64))),256))]),_:1},8,["modelValue"])]),_:1}),l(p,{span:2}),l(p,{span:8},{default:o(()=>[a.value.formTempSelectType||a.value.form.archiveCategoryId?(s(),f(k,{key:0,modelValue:a.value.form.archiveCategoryId,"onUpdate:modelValue":t[7]||(t[7]=e=>a.value.form.archiveCategoryId=e),placeholder:"选二级分类"},{default:o(()=>[(s(!0),_(y,null,h(a.value.vodTypeList,e=>(s(),_(y,null,[a.value.form.archiveCategoryId||a.value.formTempSelectType==e.parent||a.value.formTempSelectType==e.id?(s(),f(V,{key:e.id,label:e.name,value:e.id},null,8,["label","value"])):x("",!0)],64))),256))]),_:1},8,["modelValue"])):x("",!0)]),_:1})]),_:1}),a.value.formAction=="edit"?(s(),f(u,{key:0,label:"标签栏",prop:"status"},{default:o(()=>[(s(!0),_(y,null,h(a.value.form.Tags,e=>(s(),f(L,{key:e.id,closable:"",style:{margin:"6px"},onClose:v=>D(e.id)},{default:o(()=>[m(C(e.ArchiveTag.name),1)]),_:2},1032,["onClose"]))),128)),l(p,{span:8},{default:o(()=>[l(k,{modelValue:a.value.formTempSelectTag,"onUpdate:modelValue":t[8]||(t[8]=e=>a.value.formTempSelectTag=e),filterable:"",remote:"","reserve-keyword":"",placeholder:"搜索标签名称","remote-method":N,onChange:P},{default:o(()=>[(s(!0),_(y,null,h(a.value.vodTagList,e=>(s(),f(V,{key:e.id,label:e.name,value:e},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1})):x("",!0),a.value.formAction=="add"?(s(),f(u,{key:1,label:"标签栏",prop:"status"},{default:o(()=>[l(Y,{type:"info"},{default:o(()=>[m(" 存储后添加标签 ")]),_:1})]),_:1})):x("",!0),ie,l(S,{gutter:20},{default:o(()=>[l(p,{span:8},{default:o(()=>[l(u,{label:"总集数",prop:"total"},{default:o(()=>[l(Z,{modelValue:a.value.form.total,"onUpdate:modelValue":t[9]||(t[9]=e=>a.value.form.total=e)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),se,l(S,{gutter:20},{default:o(()=>[l(p,{span:12},{default:o(()=>[l(u,{label:"标题",prop:"name"},{default:o(()=>[l(d,{modelValue:a.value.form.name,"onUpdate:modelValue":t[10]||(t[10]=e=>a.value.form.name=e)},null,8,["modelValue"])]),_:1})]),_:1}),l(p,{span:12},{default:o(()=>[l(u,{label:"副标题",prop:"sub"},{default:o(()=>[l(d,{modelValue:a.value.form.sub,"onUpdate:modelValue":t[11]||(t[11]=e=>a.value.form.sub=e)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),l(u,{label:"封面",prop:"pic"},{default:o(()=>[l(d,{modelValue:a.value.form.pic,"onUpdate:modelValue":t[12]||(t[12]=e=>a.value.form.pic=e)},null,8,["modelValue"])]),_:1}),l(S,{gutter:20},{default:o(()=>[l(p,{span:8},{default:o(()=>[l(u,{label:"年份",prop:"year"},{default:o(()=>[l(d,{modelValue:a.value.form.year,"onUpdate:modelValue":t[13]||(t[13]=e=>a.value.form.year=e)},null,8,["modelValue"])]),_:1})]),_:1}),l(p,{span:8},{default:o(()=>[l(u,{label:"语言",prop:"lang"},{default:o(()=>[l(d,{modelValue:a.value.form.lang,"onUpdate:modelValue":t[14]||(t[14]=e=>a.value.form.lang=e)},null,8,["modelValue"])]),_:1})]),_:1}),l(p,{span:8},{default:o(()=>[l(u,{label:"地区",prop:"area"},{default:o(()=>[l(d,{modelValue:a.value.form.area,"onUpdate:modelValue":t[15]||(t[15]=e=>a.value.form.area=e)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),l(u,{label:"内容简介",prop:"content",width:"100"},{default:o(()=>[l(d,{modelValue:a.value.form.content,"onUpdate:modelValue":t[16]||(t[16]=e=>a.value.form.content=e),rows:3,type:"textarea"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])],64)}}};export{ye as default};
