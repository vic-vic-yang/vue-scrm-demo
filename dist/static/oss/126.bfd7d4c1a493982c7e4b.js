webpackJsonp([126],{"1oi3":function(n,e,t){(n.exports=t("FZ+f")(!1)).push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])},DHaD:function(n,e,t){var a=t("1oi3");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);t("rjj0")("f19a3ef6",a,!0)},ti48:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t("YK4W"),i=t("h9qX"),o=t("0xDb"),l=t("M4fF"),s=t.n(l),r={name:"prizeManagement",components:{customElTable:a.a},data:function(){return{tableOptions:[{label:"ID",prop:"id",width:65},{label:"奖品名称",prop:"name"},{label:"类型",prop:"prize_type_name",width:100},{label:"发奖方",prop:"deliver_from_name",width:100},{label:"状态",prop:"status_name",options:{type:"tag",prop:"status"},width:100},{label:"价值（元）",prop:"price",width:100},{label:"总数",prop:"total",width:80},{label:"库存数",prop:"stock_count",width:80},{label:"未分配数",prop:"unassigned_count",width:80},{label:"创建时间",prop:"create_time",sortable:!0,width:105,className:"ph-6"},{label:"最后更新",prop:"update_time",sortable:!0,width:105,className:"ph-6"},{prop:"USER_ACTION",actions:["edit","del"]}],tableData:[],pageIndex:1,pageSize:20,totalCount:0,tabLoading:!0}},created:function(){this.getData()},methods:{getData:function(){var n=this;this.tabLoading=!0,i.a.list({pageIndex:this.pageIndex,pageSize:this.pageSize}).then(function(e){n.tableData=(e.result||[]).map(function(n){return s.a.merge(n,{stock_count:n.total-n.taken_count,unassigned_count:n.total-n.assigned_count,create_time:Object(o.c)(n.create_time),update_time:Object(o.c)(n.update_time)})}),n.totalCount=1*e.totalCount,n.tabLoading=!1})},addPrizeKc:function(){this.$router.push({name:"prizeCreate"})},editHandler:function(n){this.$router.push({name:"prizeModify",params:{id:n.id}})},deleteHandler:function(n){var e=this;this.$confirm("您确认要删除奖品 "+n.name+" 吗?","提示",{type:"warning"}).then(function(){i.a.del(n.id).then(e.getData)}).catch(function(){e.$message({type:"info",message:"已取消删除"})})},sizeChangeHandler:function(n){this.pageSize=n,this.pageIndex=1,this.getData()},pageChangeHandler:function(n){this.pageIndex=n,this.getData()}}},p={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"app-container"},[t("div",{staticClass:"control-group mb-20"},[t("el-button",{attrs:{type:"primary"},on:{click:n.addPrizeKc}},[t("i",{staticClass:"el-icon-plus mr-5 fs-13"}),n._v(" 新增\n    ")])],1),n._v(" "),t("custom-el-table",{directives:[{name:"loading",rawName:"v-loading",value:n.tabLoading,expression:"tabLoading"}],attrs:{tableData:n.tableData,tableOptions:n.tableOptions,total:n.totalCount},on:{edit:n.editHandler,delete:n.deleteHandler,"size-change":n.sizeChangeHandler,"page-change":n.pageChangeHandler},model:{value:n.pageIndex,callback:function(e){n.pageIndex=e},expression:"pageIndex"}})],1)},staticRenderFns:[]};var d=t("VU/8")(r,p,!1,function(n){t("DHaD")},"data-v-16107501",null);e.default=d.exports}});