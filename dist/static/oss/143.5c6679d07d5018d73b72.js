webpackJsonp([143],{mSTv:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("Dd8w"),r=a.n(n),i=a("YK4W"),s=a("exRc"),l=a("M4fF"),o=a.n(l),u={name:"voteUser",components:{customElTable:i.a},data:function(){return{userListQueryFrm:{userName:"",phone:"",nickname:""},query:null,tableOptions:[{label:"编号",prop:"id",width:120},{label:"姓名",prop:"name"},{label:"微信昵称",prop:"nickname"},{label:"手机号码",prop:"phone"},{label:"地址",prop:"address",width:440},{prop:"USER_ACTION",actions:[{label:"查看详情",type:"detail"}]}],tableData:[],pageIndex:1,pageSize:20,totalCount:0,tabLoading:!0}},created:function(){this.getData()},methods:{getData:function(){var e=this,t=this.query||{};this.tabLoading=!0,s.a.list(r()({pageIndex:this.pageIndex,pageSize:this.pageSize},t)).then(function(t){e.tableData=t.result,e.totalCount=1*t.totalCount,e.tabLoading=!1}).catch(function(){e.tabLoading=!1})},searchUser:function(){this.query=o.a.cloneDeep(this.userListQueryFrm),this.pageIndex=1,this.getData()},actionHandler:function(e,t){"detail"===e&&this.$router.push({name:"voteUserDetails",params:{id:t.id}})},sizeChangeHandler:function(e){this.pageSize=e,this.pageIndex=1,this.getData()},pageChangeHandler:function(e){this.pageIndex=e,this.getData()}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"control-group"},[a("el-form",{attrs:{inline:!0,model:e.userListQueryFrm}},[a("el-form-item",{attrs:{label:"姓名"}},[a("el-input",{attrs:{placeholder:"姓名"},model:{value:e.userListQueryFrm.userName,callback:function(t){e.$set(e.userListQueryFrm,"userName",t)},expression:"userListQueryFrm.userName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"微信昵称"}},[a("el-input",{attrs:{placeholder:"微信昵称"},model:{value:e.userListQueryFrm.nickname,callback:function(t){e.$set(e.userListQueryFrm,"nickname",t)},expression:"userListQueryFrm.nickname"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"手机号"}},[a("el-input",{attrs:{placeholder:"手机号"},model:{value:e.userListQueryFrm.phone,callback:function(t){e.$set(e.userListQueryFrm,"phone",t)},expression:"userListQueryFrm.phone"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.searchUser}},[e._v("查询")])],1)],1)],1),e._v(" "),a("custom-el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.tabLoading,expression:"tabLoading"}],attrs:{tableData:e.tableData,tableOptions:e.tableOptions,total:e.totalCount},on:{action:e.actionHandler,"size-change":e.sizeChangeHandler,"page-change":e.pageChangeHandler},model:{value:e.pageIndex,callback:function(t){e.pageIndex=t},expression:"pageIndex"}})],1)},staticRenderFns:[]},p=a("VU/8")(u,c,!1,null,null,null);t.default=p.exports}});