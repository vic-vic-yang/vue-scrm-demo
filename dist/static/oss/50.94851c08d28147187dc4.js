webpackJsonp([50],{"6p8i":function(n,t,e){(n.exports=e("FZ+f")(!1)).push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])},ARrl:function(n,t,e){"use strict";var a=e("gyMJ");t.a={list:function(n){return a.a.get("/base/v1/third/template-settings",{params:n}).then(function(n){return n.data})},template_list:function(n){return a.a.get("/base/v1/third/template-settings/list?appid="+n.appid).then(function(n){return n.data})},add:function(n){return a.a.post("/base/v1/third/template-settings",n).then(function(n){return n.data})},status:function(n){return a.a.put("/base/v1/third/template-settings/"+n.id+"/status",n,{autoShowMessage:!0})},del:function(n){return a.a.delete("/base/v1/third/template-settings/"+n.id,n,{autoShowMessage:!0}).then(function(n){return n.data})},details:function(n){return a.a.get("/base/v1/third/template-settings/"+n.id).then(function(n){return n.data})},edit:function(n){return a.a.put("/base/v1/third/template-settings/"+n.id,n,{autoShowMessage:!0,showMessageType:"put"})},trigger:function(){return a.a.get("/base/v1/third/template-settings/event").then(function(n){return n.data})},send_user:function(){return a.a.get("/base/v1/third/template-settings/send-user").then(function(n){return n.data})}}},STNf:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=e("Dd8w"),i=e.n(a),s=e("YK4W"),r=e("ARrl"),o=e("0xDb"),l=e("M4fF"),p=e.n(l),u=e("NYxO"),d=e("ihK9"),c={name:"message-push-list",components:{customElTable:s.a,smallProcedures:d.a},data:function(){return{tableOptions:[{label:"ID",prop:"id",width:120},{label:"消息名称",prop:"title"},{label:"消息类型",prop:"send_type"},{label:"推送对象",prop:"send_users_name"},{label:"推送时间",prop:"send_time"},{label:"进入小程序页面",prop:"page_name"},{label:"创建时间",prop:"create_time"},{prop:"USER_ACTION",actions:["edit",{type:"status",options:this.getStatusBtnInfo},"del"]}],tableData:[],messageFrm:{title:"",send_type:""},pageIndex:1,pageSize:20,totalCount:0,tabLoading:!0,query:null,dialogVisible:!1,type:"data",tableShow:!0,pageOptions:this.$store.state.templateMsg.pageOptions,typeOptions:this.$store.state.templateMsg.typeOptions}},computed:i()({},Object(u.c)({appid:function(n){return n.templateMsg.appid},mini_program:function(n){return n.templateMsg.mini_program}})),watch:{dialogVisible:function(n){n||this.appid||(this.tabLoading=!1,this.tableShow=!1)}},created:function(){this.appid?this.getData():(this.type="data",this.dialogVisible=!0)},methods:{handleClose:function(){if(!this.appid)return this.$message("请先选择小程序，才能进行下一步操作。"),!1},switchProcedures:function(){this.dialogVisible=!0},small_procedures_handler:function(n){this.dialogVisible=n,"synchronization"===this.type?this.synchronization():this.getData()},getData:function(){var n=this;this.tabLoading=!0,r.a.list({appid:this.appid,page_index:this.pageIndex,page_size:this.pageSize}).then(function(t){n.tableData=(t.result||[]).map(function(t){return i()({},t,{status_name:1*t.status==1?"启用":"禁用",send_time:"定时推送消息"===t.send_type?n.setTime(t.hours)+":"+n.setTime(t.minutes):"--",page_name:n.setPageName(t.page),send_users_name:"定时推送消息"===t.send_type?t.send_users_name:"--",create_time:1*t.create_time!=0?Object(o.c)(t.create_time):"--"})}),n.totalCount=1*t.totalCount,n.tabLoading=!1,n.tableShow=!0})},setTime:function(n){return 1*n<10?"0"+n:n},setPageName:function(n){return this.pageOptions.find(function(t){return t.page===n}).name},synchronization:function(){var n=this;this.appid?r.a.pull({appid:this.appid}).then(function(){n.$message({message:"同步微信模板消息库成功",type:"success"})}).catch(function(){n.$message({message:"同步微信模板消息库失败",type:"error"})}):(this.type="synchronization",this.dialogVisible=!0)},addTemplate:function(){this.$router.push({name:"templateLibraryList"})},searchActivityList:function(){this.query=p.a.cloneDeep(this.messageFrm),this.pageIndex=1,this.getData()},createHandler:function(){this.$router.push({name:"messageListCreate"})},editHandler:function(n){this.$router.push({name:"messageListModify",params:{id:n.id}})},deleteHandler:function(n){var t=this,e="确认删除模板 <b>"+n.title+"</b> 吗？";this.$confirm(e,"删除",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){r.a.del({id:n.id}).then(function(){t.getData()})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},actionHandler:function(n,t){var e=this;if("status"===n){var a=this.getStatusBtnInfo(t).label,i="确认"+a+"模板 <b>"+t.title+"</b> 吗？";this.$confirm(i,a,{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){r.a.status({id:t.id}).then(function(){e.getData()})}).catch(function(){e.$message({type:"info",message:"已取消"+a})})}},sizeChangeHandler:function(n){this.pageSize=n,this.pageIndex=1,this.getData()},pageChangeHandler:function(n){this.pageIndex=n,this.getData()},getStatusBtnInfo:function(n){return n?1===1*n.status?{btn:"danger",label:"禁用"}:{btn:"primary",label:"启用"}:{btn:"danger",label:"禁用"}},resetForm:function(n){this.$refs[n].resetFields()}}},g={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"app-container"},[e("div",{staticClass:"control-group"},[e("el-form",{ref:"messageFrm",attrs:{inline:!0,model:n.messageFrm}},[e("el-form-item",[e("el-button",{attrs:{type:"primary"},on:{click:n.switchProcedures}},[n._v("选择/切换小程序")]),n._v(" "),n._e(),n._v(" "),n._e(),n._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:n.createHandler}},[n._v("新增消息推送")])],1),n._v(" "),n.mini_program?e("small",{staticStyle:{float:"right",color:"#111","font-weight":"bold","margin-right":"15px"}},[n._v(n._s(n.mini_program.nick_name))]):n._e()],1)],1),n._v(" "),n.tableShow?e("custom-el-table",{directives:[{name:"loading",rawName:"v-loading",value:n.tabLoading,expression:"tabLoading"}],attrs:{tableData:n.tableData,tableOptions:n.tableOptions,total:n.totalCount},on:{edit:n.editHandler,delete:n.deleteHandler,action:n.actionHandler,"size-change":n.sizeChangeHandler,"page-change":n.pageChangeHandler},model:{value:n.pageIndex,callback:function(t){n.pageIndex=t},expression:"pageIndex"}}):n._e(),n._v(" "),n.appid?n._e():e("div",{staticStyle:{"text-align":"center",padding:"100px 0 0"}},[n._v("请点击“选择/切换小程序”按钮选择小程序，然后才能进行其他操作")]),n._v(" "),e("el-dialog",{attrs:{title:"选择小程序",visible:n.dialogVisible,width:"50%"},on:{"update:visible":function(t){n.dialogVisible=t}}},[e("smallProcedures",{attrs:{name:"small"},on:{small_procedures_handler:n.small_procedures_handler}})],1)],1)},staticRenderFns:[]};var h=e("VU/8")(c,g,!1,function(n){e("aGFv")},"data-v-4e6d230a",null);t.default=h.exports},aGFv:function(n,t,e){var a=e("6p8i");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);e("rjj0")("8028fcc8",a,!0)}});