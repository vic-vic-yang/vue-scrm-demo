webpackJsonp([108],{"9Zqm":function(n,t,e){(n.exports=e("FZ+f")(!1)).push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])},LSjm:function(n,t,e){var a=e("9Zqm");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);e("rjj0")("2a15d2b4",a,!0)},RLA6:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=e("Dd8w"),i=e.n(a),s=e("YK4W"),r=e("sF3O"),l=e("0xDb"),c={name:"gameList",components:{customElTable:s.a},data:function(){return{tableOptions:[{label:"编号",prop:"id",width:80},{label:"活动名称",prop:"activity_name"},{label:"活动阶段",prop:"stage"},{label:"任务数",prop:"missions"},{label:"参与人数",prop:"players"},{label:"开始时间",prop:"start_time",sortable:!0,width:105,className:"ph-6"},{label:"结束时间",prop:"end_time",sortable:!0,width:105,className:"ph-6"},{label:"活动状态",prop:"status_cn",options:{type:"tag",prop:"stageType"}},{prop:"USER_ACTION",actions:["edit",{type:"ranking",label:"查看排名"},{type:"stageList",label:"查看阶段"},{type:"userMatch",label:"报名审核"},{type:"status",options:this.getStatusBtnInfo},"del"]}],tableData:[],pageIndex:1,pageSize:20,totalCount:0,tabLoading:!0,activityListQueryFrm:{activityName:"",matchMode:"",matchType:"",status:"",time:""},query:null,pickerOptions:{shortcuts:[{text:"最近一周",onClick:function(n){var t=new Date,e=new Date;e.setTime(e.getTime()-6048e5),n.$emit("pick",[e,t])}},{text:"最近一个月",onClick:function(n){var t=new Date,e=new Date;e.setTime(e.getTime()-2592e6),n.$emit("pick",[e,t])}},{text:"最近三个月",onClick:function(n){var t=new Date,e=new Date;e.setTime(e.getTime()-7776e6),n.$emit("pick",[e,t])}}]},matchTypeOptions:[{value:1,label:"进行中"},{value:2,label:"未开始"},{value:3,label:"已结束"}]}},created:function(){this.getData()},computed:{},methods:{getData:function(){var n=this,t=this.query||{};this.tabLoading=!0,r.a.activity.list(i()({pageIndex:this.pageIndex,pageSize:this.pageSize},t)).then(function(t){t.result.forEach(function(n){n.start_time=Object(l.c)(n.start_time),n.end_time=Object(l.c)(n.end_time),n.status_cn=n.status-0==0?"禁用":n.status_cn,n.stageType="已结束"===n.status_cn?1:"进行中"===n.status_cn?3:0}),n.tableData=t.result,n.totalCount=1*t.totalCount,n.tabLoading=!1}).catch(function(){n.tabLoading=!1})},searchGameList:function(){this.query={activityName:this.activityListQueryFrm.activityName?this.activityListQueryFrm.activityName:"",startTime:this.activityListQueryFrm.time?this.activityListQueryFrm.time[0]:"",endTime:this.activityListQueryFrm.time?this.activityListQueryFrm.time[1]:"",status:this.activityListQueryFrm.status?this.activityListQueryFrm.status:""},this.pageIndex=1,this.getData()},createGame:function(){this.$router.push({name:"addActivity"})},editHandler:function(n){this.$router.push({name:"modifyActivity",params:{id:n.id}})},deleteHandler:function(n){var t=this;this.$confirm("确认删除活动 <b>"+n.activity_name+"</b> 吗？","删除",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){r.a.activity.del(n.id).then(function(){t.getData()})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})},actionHandler:function(n,t){var e=this;if("status"===n){var a=this.$store.getters.getStatusTxt(!(1*t.status));this.$confirm("确认"+a+"比赛 <b>"+t.activity_name+"</b> 吗？",a,{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){r.a.activity.status(t.id).then(function(){e.getData(),e.$message({type:"success",message:"修改成功"})})}).catch(function(){e.$message({type:"info",message:"已取消"+a})})}else"name"===n?this.$router.push({name:"gameNameList",params:{gameId:t.id}}):"detail"===n?this.$router.push({name:"gameDetail",params:{gameId:t.id}}):"stageList"===n?this.$router.push({name:"stageList",params:{id:t.id}}):"userMatch"===n?this.$router.push({name:"userExamine",params:{id:t.id}}):"ranking"===n&&this.$router.push({name:"voteActivityRankink",params:{id:t.id}})},sizeChangeHandler:function(n){this.pageSize=n,this.pageIndex=1,this.getData()},pageChangeHandler:function(n){this.pageIndex=n,this.getData()},getStatusBtnInfo:function(n){if(console.log(n),!n)return{btn:"danger",label:"禁用"};var t=1*n.status;return{btn:0===t?"primary":"danger",label:this.$store.getters.getStatusTxt(!t)}}}},o={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{staticClass:"app-container"},[e("div",{staticClass:"control-group"},[e("el-form",{attrs:{inline:!0,model:n.activityListQueryFrm}},[e("el-form-item",{attrs:{label:"活动名称"}},[e("el-input",{attrs:{placeholder:"活动名称"},model:{value:n.activityListQueryFrm.activityName,callback:function(t){n.$set(n.activityListQueryFrm,"activityName",t)},expression:"activityListQueryFrm.activityName"}})],1),n._v(" "),e("el-form-item",{attrs:{label:"活动状态"}},[e("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:n.activityListQueryFrm.status,callback:function(t){n.$set(n.activityListQueryFrm,"status",t)},expression:"activityListQueryFrm.status"}},n._l(n.matchTypeOptions,function(n){return e("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),e("el-form-item",{attrs:{label:"活动时间"}},[e("el-date-picker",{attrs:{editable:!1,type:"datetimerange","picker-options":n.pickerOptions,"range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间","value-format":"yyyy-MM-dd HH:mm:ss",align:"right"},model:{value:n.activityListQueryFrm.time,callback:function(t){n.$set(n.activityListQueryFrm,"time",t)},expression:"activityListQueryFrm.time"}})],1),n._v(" "),e("el-form-item",[e("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:n.searchGameList}},[n._v("查询")])],1),n._v(" "),e("el-form-item",[e("el-button",{attrs:{type:"primary"},on:{click:n.createGame}},[e("i",{staticClass:"fs-13 el-icon-plus mr-5"}),n._v("新增\n        ")])],1)],1)],1),n._v(" "),e("custom-el-table",{directives:[{name:"loading",rawName:"v-loading",value:n.tabLoading,expression:"tabLoading"}],attrs:{tableData:n.tableData,tableOptions:n.tableOptions,total:n.totalCount},on:{edit:n.editHandler,delete:n.deleteHandler,action:n.actionHandler,"size-change":n.sizeChangeHandler,"page-change":n.pageChangeHandler},model:{value:n.pageIndex,callback:function(t){n.pageIndex=t},expression:"pageIndex"}})],1)},staticRenderFns:[]};var u=e("VU/8")(c,o,!1,function(n){e("LSjm")},"data-v-40dc2840",null);t.default=u.exports}});