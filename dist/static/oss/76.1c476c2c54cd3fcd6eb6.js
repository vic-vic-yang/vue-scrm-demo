webpackJsonp([76],{Wbpd:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Dd8w"),i=a.n(n),s=a("gyMJ"),r=function(t){return s.a.get("/ugc/v1/merge-activity/index",{params:t}).then(function(t){return t.data})},l=function(t){return s.a.get("/ugc/v1/merge-activity/set-status",{params:t}).then(function(t){return t.data})},o=function(t){return s.a.get("/ugc/v1/merge-activity/weight",{params:t}).then(function(t){return t.data})},c=function(t){return s.a.get("/ugc/v1/merge-activity/delete",{params:t}).then(function(t){return t.data})},u=function(){return s.a.get("/ugc/v1/merge-activity/type",{}).then(function(t){return t.data})},p={name:"activityCenter",components:{customElTable:a("YK4W").a},data:function(){return{tableData:[],pageIndex:1,pageSize:20,totalCount:0,tabLoading:!1,form:{activetype:""},tableOptions:[{label:"编号",prop:"id",width:120},{label:"活动类型",prop:"typeCh"},{label:"活动标题",prop:"activity_name"},{label:"开始时间",prop:"start_time"},{label:"结束时间",prop:"end_time"},{label:"状态",prop:"statusCh"},{label:"权重",prop:"weight",max:100,editAble:!0,showInput:!1,type:"Number"},{prop:"USER_ACTION",actions:[{type:"myedit",label:"编辑",btn:"primary",itemOnly:!0},{type:"report",label:"报名管理",btn:"primary",itemOnly:!0},{width:70,actionType:"select",label:"是否启用权重",labels:[{value:1,label:"启用"},{value:0,label:"禁用"},{value:2,label:"隐藏"}]},"del"]}],activityType:[]}},created:function(){this.init(),this.getTypes()},methods:{createActivity:function(){this.$router.push({name:"contentAddActivity"})},statusChange:function(t,e){var a=this,n={type:t.type,id:t.id,status:t.status};l(n).then(function(t){t.success?(a.$message({message:"操作成功",type:"success"}),a.init()):a.$message.error("意料之外的错误")})},selectChange:function(t){var e=this;this.$nextTick(function(){var a=e.activityType.find(function(e){return e.value===t});e.init(a.id)})},getTypes:function(){var t=this;u().then(function(e){t.activityType=e})},init:function(t){var e=this,a={type:t||this.form.activityType||0,pageSize:this.pageSize,pageIndex:this.pageIndex};r(a).then(function(a){var n=t?a.res:a.result;e.tableData=n.map(function(t){var e="",a="";return 1===Number(t.type)?e="报名活动":2===Number(t.type)?e="拼团活动":3===Number(t.type)?e="答题活动":4===Number(t.type)&&(e="投票活动"),1===Number(t.status)?a="启用":2===Number(t.status)?a="隐藏":0===Number(t.status)&&(a="禁用"),t.weight=Number(t.weight),t.status=Number(t.status),i()({},t,{typeCh:e,statusCh:a})}),e.totalCount=1*a.totalCount})},sizeChangeHandler:function(t){this.pageSize=t,this.pageIndex=1,this.init()},pageChangeHandler:function(t){this.pageIndex=t,this.init()},rejectHandler:function(t){console.log("reject",t)},passHandler:function(t){console.log("pass",t)},actionHandler:function(t,e){"myedit"===t?this.$router.push({name:"contentEditorActivity",params:{id:e.id}}):"report"===t&&this.$router.push({name:"contentSignUp",params:{id:e.id}})},deleteHandler:function(t){var e=this,a={id:t.id,type:t.type};c(a).then(function(t){t.success?(e.$message({message:"操作成功",type:"success"}),e.init()):e.$message.error("意料之外的错误")})},cellClick:function(t,e){var a=this;this.tableDataIndex=t,this.tableOptions.some(function(t,n){return!(t.prop!==e||!t.editAble)&&(a.idx=n,!0)})&&(this.tableOptions[this.idx].showInput=!0)},blurInputHandler:function(t,e){var a=this;e>this.tableOptions[6].max&&(e=this.tableOptions[6].max),this.tableOptions[this.idx].showInput=!1,this.tableData[this.tableDataIndex].weight=e;var n={type:t.row.type,id:t.row.id,weight:this.tableData[this.tableDataIndex].weight};o(n).then(function(t){t.success?(a.$message({message:"操作成功",type:"success"}),a.tableDataIndex=void 0,a.init()):a.$message.error("意料之外的错误")})}}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"activity-wrapper app-container"},[a("el-form",{ref:"form",attrs:{inline:!0,model:t.form,"label-width":"80px"}},[a("el-form-item",{attrs:{label:"活动类型"}},[a("el-select",{attrs:{placeholder:"请选择活动类型"},on:{change:t.selectChange},model:{value:t.form.activityType,callback:function(e){t.$set(t.form,"activityType",e)},expression:"form.activityType"}},t._l(t.activityType,function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})}))],1),t._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:t.createActivity}},[a("i",{staticClass:"fs-13 el-icon-plus mr-5"}),t._v("新建活动\n      ")])],1)],1),t._v(" "),a("custom-el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.tabLoading,expression:"tabLoading"}],attrs:{tableData:t.tableData,tableOptions:t.tableOptions,total:t.totalCount},on:{handleSelectChange2:t.statusChange,action:t.actionHandler,blurInput:t.blurInputHandler,delete:t.deleteHandler,pass:t.passHandler,reject:t.rejectHandler,"cell-click":t.cellClick,"size-change":t.sizeChangeHandler,"page-change":t.pageChangeHandler},model:{value:t.pageIndex,callback:function(e){t.pageIndex=e},expression:"pageIndex"}})],1)},staticRenderFns:[]};var h=a("VU/8")(p,d,!1,function(t){a("pi7F")},"data-v-9db2acba",null);e.default=h.exports},hCnm:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,"",""])},pi7F:function(t,e,a){var n=a("hCnm");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("04ea3e21",n,!0)}});