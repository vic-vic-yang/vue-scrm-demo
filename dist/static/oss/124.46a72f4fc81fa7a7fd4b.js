webpackJsonp([124],{OULJ:function(n,t,e){var a=e("vj/j");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);e("rjj0")("69377948",a,!0)},QDsa:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=e("Dd8w"),r=e.n(a),i=e("YK4W"),s=e("XvNa"),o=e("0xDb"),l={name:"learningCentenr",components:{customElTable:i.a},data:function(){return{groupListQueryFrm:{articleName:"",matchName:"",status:"",startTime:"",pageIndex:1,pageSize:20},query:null,statusOptions:[{value:"",label:"全部"},{value:"1",label:"启用"},{value:"0",label:"禁用"}],tableOptions:[{label:"编号",prop:"id",width:80},{label:"文章题目",prop:"article_name"},{label:"文章类型",prop:"type_cn"},{label:"所属比赛",prop:"match"},{label:"状态",prop:"statusTxt",options:{type:"tag",prop:"status"},width:120},{label:"创建时间",prop:"createTime",sortable:!0,width:105,className:"ph-6"},{prop:"USER_ACTION",actions:["edit",{type:"status",options:this.getStatusBtnInfo},"del"]}],tableData:[],totalCount:0,tabLoading:!0,pickerOptions:{shortcuts:[{text:"最近一周",onClick:function(n){var t=new Date,e=new Date;e.setTime(e.getTime()-6048e5),n.$emit("pick",[e,t])}},{text:"最近一个月",onClick:function(n){var t=new Date,e=new Date;e.setTime(e.getTime()-2592e6),n.$emit("pick",[e,t])}},{text:"最近三个月",onClick:function(n){var t=new Date,e=new Date;e.setTime(e.getTime()-7776e6),n.$emit("pick",[e,t])}}]}}},created:function(){this.getData()},methods:{getData:function(){var n=this;this.tabLoading=!0,s.a.list(this.groupListQueryFrm).then(function(t){n.tableData=(t.result||[]).map(function(n){return r()({},n,{status:"enable"===n.status?1:0,statusTxt:"enable"===n.status?"启用":"禁用",createTime:Object(o.c)(n.created)})}),n.totalCount=1*t.totalCount,n.tabLoading=!1}).catch(function(){n.tabLoading=!1})},createQuestionGroup:function(){this.$router.push({name:"newArticle"})},editHandler:function(n){this.$router.push({name:"editArticle",params:{id:n.id}})},deleteHandler:function(n){var t=this;this.$confirm("确认删除文章 <b>"+n.article_name+"</b> 吗？","删除",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){s.a.del(n.id).then(function(){t.getData(t.groupListQueryFrm)})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},actionHandler:function(n,t){var e=this;"status"===n?this.$confirm("确认"+t.statusTxt+"题库 <b>"+t.article_name+"</b> 吗？",t.statusTxt,{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){s.a.revise(t.id).then(function(){e.getData(e.groupListQueryFrm)})}).catch(function(){e.$message({type:"info",message:"已取消"+t.statusTxt})}):"detail"===n?this.$alert(t.desc,t.statusTxt,{confirmButtonText:"确定"}).catch(function(n){console.log("view detail : ",n)}):"topic"===n&&this.$router.push({name:"topicList",query:{group:t.id}})},sizeChangeHandler:function(n){this.groupListQueryFrm.pageSize=n,this.groupListQueryFrm.pageIndex=1,this.getData()},pageChangeHandler:function(n){this.groupListQueryFrm.pageIndex=n,this.getData()},getStatusBtnInfo:function(n){return n?{btn:1*n.status==0?"primary":"danger",label:this.$store.getters.getStatusTxt(!n.status)}:{btn:"danger",label:"禁用"}},resetForm:function(n){this.$refs[n].resetFields()}}},u={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"app-container"},[e("div",{staticClass:"control-group"},[e("el-form",{ref:"groupListQueryFrm",attrs:{inline:!0,model:n.groupListQueryFrm}},[e("el-form-item",{attrs:{prop:"articleName",label:"文章题目"}},[e("el-input",{attrs:{placeholder:"请输入题目名"},model:{value:n.groupListQueryFrm.articleName,callback:function(t){n.$set(n.groupListQueryFrm,"articleName",t)},expression:"groupListQueryFrm.articleName"}})],1),n._v(" "),e("el-form-item",{attrs:{prop:"matchName",label:"所属比赛"}},[e("el-input",{attrs:{placeholder:"请输入比赛名"},model:{value:n.groupListQueryFrm.matchName,callback:function(t){n.$set(n.groupListQueryFrm,"matchName",t)},expression:"groupListQueryFrm.matchName"}})],1),n._v(" "),e("el-form-item",{attrs:{prop:"status",label:"选择状态"}},[e("el-select",{attrs:{placeholder:"请选择"},model:{value:n.groupListQueryFrm.status,callback:function(t){n.$set(n.groupListQueryFrm,"status",t)},expression:"groupListQueryFrm.status"}},n._l(n.statusOptions,function(n){return e("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),e("el-form-item",{attrs:{prop:"startTime",label:"选择时间"}},[e("el-date-picker",{attrs:{editable:!1,type:"datetimerange","picker-options":n.pickerOptions,"range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间","value-format":"yyyy-MM-dd HH:mm:ss",align:"right"},model:{value:n.groupListQueryFrm.startTime,callback:function(t){n.$set(n.groupListQueryFrm,"startTime",t)},expression:"groupListQueryFrm.startTime"}})],1),n._v(" "),e("el-form-item",[e("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:n.getData}},[n._v("查询")]),n._v(" "),e("el-button",{attrs:{icon:"el-icon-refresh"},on:{click:function(t){n.resetForm("groupListQueryFrm")}}},[n._v("重置")])],1),n._v(" "),e("el-form-item",[e("el-button",{attrs:{type:"primary"},on:{click:n.createQuestionGroup}},[e("i",{staticClass:"fs-13 el-icon-plus mr-5"}),n._v("新增\n        ")])],1)],1)],1),n._v(" "),e("custom-el-table",{directives:[{name:"loading",rawName:"v-loading",value:n.tabLoading,expression:"tabLoading"}],attrs:{tableData:n.tableData,tableOptions:n.tableOptions,total:n.totalCount},on:{edit:n.editHandler,delete:n.deleteHandler,action:n.actionHandler,"size-change":n.sizeChangeHandler,"page-change":n.pageChangeHandler},model:{value:n.groupListQueryFrm.pageIndex,callback:function(t){n.$set(n.groupListQueryFrm,"pageIndex",t)},expression:"groupListQueryFrm.pageIndex"}})],1)},staticRenderFns:[]};var c=e("VU/8")(l,u,!1,function(n){e("OULJ")},"data-v-176f4ace",null);t.default=c.exports},"vj/j":function(n,t,e){(n.exports=e("FZ+f")(!1)).push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])}});