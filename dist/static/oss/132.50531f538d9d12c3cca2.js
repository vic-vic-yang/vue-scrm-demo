webpackJsonp([132],{Rpe6:function(n,e,t){(n.exports=t("FZ+f")(!1)).push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])},k8Qd:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t("Dd8w"),i=t.n(a),s=t("YK4W"),l=t("Ndhk"),o=t("J6ro"),r=t("0xDb"),c={name:"contentList",components:{customElTable:s.a},data:function(){return{tableOptions:[{label:"编号",prop:"id",width:80},{label:"发布频道",prop:"channels"},{label:"标题",prop:"title"},{label:"形式",prop:"article_type"},{label:"分类",prop:"classify_name"},{label:"来源",prop:"author"},{label:"发布时间",prop:"publish_time",sortable:!0,width:105,className:"ph-6"},{label:"状态",prop:"status_cn",options:{type:"tag",prop:"stageType"}},{label:"权重",prop:"weight",max:100,editAble:!0,showInput:!1,type:"Number"},{prop:"USER_ACTION",actions:[{type:"status",options:this.getStatusBtnInfo},"edit","del",{type:"MORE",label:"更多操作",operations:[{prop:"top_cn"},{prop:"recommend_cn"},"查看评论"]}]}],tableData:[],pageIndex:1,pageSize:20,totalCount:0,tabLoading:!0,classListQueryFrm:{title:"",source:"",channel:"",type:"",class:"",state:"",time:[],top:"",recommend:""},multipleSelection:[],query:null,pickerOptions:{shortcuts:[{text:"最近一周",onClick:function(n){var e=new Date,t=new Date;t.setTime(t.getTime()-6048e5),n.$emit("pick",[t,e])}},{text:"最近一个月",onClick:function(n){var e=new Date,t=new Date;t.setTime(t.getTime()-2592e6),n.$emit("pick",[t,e])}},{text:"最近三个月",onClick:function(n){var e=new Date,t=new Date;t.setTime(t.getTime()-7776e6),n.$emit("pick",[t,e])}}]},channelOptions:[],classOptions:[],channeifiCation_page_info:{pageIndex:1,pageSize:10,totalCount:1,tabLoading:!0},classifiCation_page_info:{pageIndex:1,pageSize:10,totalCount:1,tabLoading:!0},typeOptions:[{value:1,label:"图文"},{value:2,label:"视频"}],stateOptions:[{value:1,label:"已发布"},{value:0,label:"未发布"}],topOptions:[{value:1,label:"是"},{value:0,label:"否"}],recommendOptions:[{value:1,label:"是"},{value:0,label:"否"}]}},created:function(){this.getData(),this.getClassifications(),this.getCurrentifications()},methods:{getData:function(){var n=this,e=this.query||{};l.a.list.listB(i()({pageIndex:this.pageIndex,pageSize:this.pageSize},e)).then(function(e){e.result.forEach(function(n){n.publish_time&&(n.publish_time=Object(r.c)(n.publish_time)),n.article_type=n.article_type-0==1?"图文":"视频",n.status_cn=n.status-0==0?"未发布":"已发布",n.stageType=n.status-0==0?2:1,n.top_cn=n.top-0==0?"置顶":"取消置顶",n.recommend_cn=n.recommend-0==0?"推荐":"取消推荐",n.title=n.recommend-0==1?"[推荐] "+n.title:n.title,n.title=n.top-0==1?"[置顶] "+n.title:n.title}),n.tableData=e.result,n.totalCount=1*e.totalCount,n.tabLoading=!1}).catch(function(){n.tabLoading=!1})},searchGameList:function(){this.query={title:this.classListQueryFrm.title,author:this.classListQueryFrm.source,channelId:this.classListQueryFrm.channel,articleType:this.classListQueryFrm.type,classifyId:this.classListQueryFrm.class,status:this.classListQueryFrm.state,top:this.classListQueryFrm.top,recommend:this.classListQueryFrm.recommend,startTime:this.classListQueryFrm.time?this.classListQueryFrm.time[0]:"",endTime:this.classListQueryFrm.time?this.classListQueryFrm.time[1]:""},this.pageIndex=1,this.getData()},currentChangechannel:function(n){this.classifiCation_page_info.pageIndex=n,this.getCurrentifications()},currentChangeClass:function(n){this.classifiCation_page_info.pageIndex=n,this.getClassifications()},getCurrentifications:function(){var n=this;this.channeifiCation_page_info.tabLoading=!0,o.a.applet.list({pageIndex:this.channeifiCation_page_info.pageIndex,pageSize:this.channeifiCation_page_info.pageSize}).then(function(e){n.channelOptions=e.result,n.channeifiCation_page_info.totalCount=1*e.totalCount,n.channeifiCation_page_info.tabLoading=!1})},getClassifications:function(){var n=this;this.classifiCation_page_info.tabLoading=!0,l.a.class.list({pageIndex:this.classifiCation_page_info.pageIndex,pageSize:this.classifiCation_page_info.pageSize}).then(function(e){n.classOptions=e.result,n.classifiCation_page_info.totalCount=1*e.totalCount,n.classifiCation_page_info.tabLoading=!1})},createContent:function(n){"a"===n?this.$router.push({name:"addContent"}):this.$router.push({name:"contentCenter"})},editHandler:function(n){this.$router.push({name:"modifyContent",params:{id:n.id}})},deleteHandler:function(n){var e=this;this.$confirm("确认删除 <b>"+n.title+"</b> 吗？","删除",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){l.a.list.del([n.id]).then(function(){e.getData()})}).catch(function(){e.$message({type:"info",message:"已取消删除"})})},handleSelectionChange:function(n){this.multipleSelection=n},globalOperation:function(n){var e=this;if(this.multipleSelection.length){var t="发布",a="status";2===n?(t="撤销",a="revoke"):3===n?(t="推荐",a="recommend"):4===n?(t="取消推荐",a="cancel"):5===n&&(t="删除",a="del"),this.$confirm("确认"+t+"？",t,{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var n=e.multipleSelection.map(function(n){return n.id});l.a.list[a](n).then(function(){e.getData()})}).catch(function(){e.$message({type:"info",message:"已取消"})})}else this.$message({type:"info",message:"请选择对应的项目！"})},actionHandler:function(n,e){var t=this;e.channels||"0"!==e.status?"status"===n&&this.$confirm("确认"+(e.status-0==0?"发布":"撤销")+" <b>"+e.title+"</b> 吗？","发布",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var n=e.status-0==0?"status":"revoke";l.a.list[n]([e.id]).then(function(){t.getData()})}).catch(function(){t.$message({type:"info",message:"已取消"})}):this.$message({type:"info",message:"请先设置发布频道"})},moreHandler:function(n,e){var t=this;"top_cn"===n?this.$confirm("确认"+(e.top-0==0?"置顶":"取消置顶")+" <b>"+e.title+"</b> 吗？",e.top-0==0?"置顶":"取消置顶",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){l.a.list.top(e.id).then(function(){t.getData()})}).catch(function(){t.$message({type:"info",message:"已取消"})}):"recommend_cn"===n?this.$confirm("确认"+(e.recommend-0==0?"推荐":"取消推荐")+" <b>"+e.title+"</b> 吗？",e.recommend-0==0?"推荐":"取消推荐",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var n=e.recommend-0==0?"recommend":"cancel";l.a.list[n]([e.id]).then(function(){t.getData()})}).catch(function(){t.$message({type:"info",message:"已取消"})}):"查看评论"===n&&this.$router.push({name:"contentComment",params:{id:e.id}})},sizeChangeHandler:function(n){this.pageSize=n,this.pageIndex=1,this.getData()},pageChangeHandler:function(n){this.pageIndex=n,this.getData()},getStatusBtnInfo:function(n){if(!n)return{btn:"info",label:"撤销"};var e=1*n.status;return{btn:0===e?"primary":"info",label:0===e?"发布":"撤销"}},cellClick:function(n,e){var t=this;this.tableDataIndex=n,this.tableOptions.some(function(n,a){return n.prop===e&&(t.idx=a,!0)})&&(this.tableOptions[this.idx].showInput=!0)},blurInputHandler:function(n,e){var t=this;e>100&&(e=100),e<0&&(e=0),e=parseInt(e),this.tableOptions[this.idx].showInput=!1,this.tableData[this.tableDataIndex].weight=e;var a={id:n.row.id,weight:this.tableData[this.tableDataIndex].weight};l.a.list.weight(a).then(function(n){n.success?(t.$message({message:"操作成功",type:"success"}),t.tableDataIndex=void 0,t.getData()):t.$message.error("意料之外的错误")})}}},p={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"app-container"},[t("div",{staticClass:"control-group"},[t("el-form",{attrs:{inline:!0,model:n.classListQueryFrm}},[t("el-form-item",{attrs:{label:"标题"}},[t("el-input",{attrs:{placeholder:"标题"},model:{value:n.classListQueryFrm.title,callback:function(e){n.$set(n.classListQueryFrm,"title",e)},expression:"classListQueryFrm.title"}})],1),n._v(" "),t("el-form-item",{attrs:{label:"来源"}},[t("el-input",{attrs:{placeholder:"来源"},model:{value:n.classListQueryFrm.source,callback:function(e){n.$set(n.classListQueryFrm,"source",e)},expression:"classListQueryFrm.source"}})],1),n._v(" "),t("el-form-item",{attrs:{label:"频道"}},[t("el-select",{staticStyle:{width:"230px"},attrs:{placeholder:"全部",clearable:""},model:{value:n.classListQueryFrm.channel,callback:function(e){n.$set(n.classListQueryFrm,"channel",e)},expression:"classListQueryFrm.channel"}},[n._l(n.channelOptions,function(n){return t("el-option",{key:n.id,attrs:{label:n.channel_name,value:n.id}})}),n._v(" "),t("div",{staticClass:"article_pages"},[t("el-pagination",{directives:[{name:"loading",rawName:"v-loading",value:n.channeifiCation_page_info.tabLoading,expression:"channeifiCation_page_info.tabLoading"}],attrs:{"page-size":n.channeifiCation_page_info.pageSize,"pager-count":Math.ceil(n.channeifiCation_page_info.totalCount/n.channeifiCation_page_info.pageSize),"current-page":n.channeifiCation_page_info.pageIndex,layout:"prev, pager, next",total:n.channeifiCation_page_info.totalCount},on:{"current-change":n.currentChangechannel}})],1)],2)],1),n._v(" "),t("el-form-item",{attrs:{label:"形式"}},[t("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:n.classListQueryFrm.type,callback:function(e){n.$set(n.classListQueryFrm,"type",e)},expression:"classListQueryFrm.type"}},n._l(n.typeOptions,function(n){return t("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),t("el-form-item",{attrs:{label:"分类"}},[t("el-select",{staticStyle:{width:"230px"},attrs:{placeholder:"全部",clearable:""},model:{value:n.classListQueryFrm.class,callback:function(e){n.$set(n.classListQueryFrm,"class",e)},expression:"classListQueryFrm.class"}},[n._l(n.classOptions,function(n){return t("el-option",{key:n.id,attrs:{label:n.classify_name,value:n.id}})}),n._v(" "),t("div",{staticClass:"article_pages"},[t("el-pagination",{directives:[{name:"loading",rawName:"v-loading",value:n.classifiCation_page_info.tabLoading,expression:"classifiCation_page_info.tabLoading"}],attrs:{"page-size":n.classifiCation_page_info.pageSize,"pager-count":Math.ceil(n.classifiCation_page_info.totalCount/n.classifiCation_page_info.pageSize),"current-page":n.classifiCation_page_info.pageIndex,layout:"prev, pager, next",total:n.classifiCation_page_info.totalCount},on:{"current-change":n.currentChangeClass}})],1)],2)],1),n._v(" "),t("el-form-item",{attrs:{label:"状态"}},[t("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:n.classListQueryFrm.state,callback:function(e){n.$set(n.classListQueryFrm,"state",e)},expression:"classListQueryFrm.state"}},n._l(n.stateOptions,function(n){return t("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),t("el-form-item",{attrs:{label:"置顶"}},[t("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:n.classListQueryFrm.top,callback:function(e){n.$set(n.classListQueryFrm,"top",e)},expression:"classListQueryFrm.top"}},n._l(n.topOptions,function(n){return t("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),t("el-form-item",{attrs:{label:"推荐"}},[t("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:n.classListQueryFrm.recommend,callback:function(e){n.$set(n.classListQueryFrm,"recommend",e)},expression:"classListQueryFrm.recommend"}},n._l(n.topOptions,function(n){return t("el-option",{key:n.value,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),t("el-form-item",{attrs:{label:"发布时间"}},[t("el-date-picker",{attrs:{editable:!1,type:"datetimerange","picker-options":n.pickerOptions,"range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间","value-format":"yyyy-MM-dd HH:mm:ss",align:"right"},model:{value:n.classListQueryFrm.time,callback:function(e){n.$set(n.classListQueryFrm,"time",e)},expression:"classListQueryFrm.time"}})],1),n._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:n.searchGameList}},[n._v("查询")])],1),n._v(" "),t("el-form-item",[t("el-dropdown",{on:{command:n.createContent}},[t("el-button",{attrs:{type:"primary"}},[t("i",{staticClass:"fs-13 el-icon-plus mr-5"}),n._v("添加内容\n          ")]),n._v(" "),t("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[t("el-dropdown-item",{attrs:{command:"a"}},[n._v("手动添加")]),n._v(" "),t("el-dropdown-item",{attrs:{command:"b"}},[n._v("内容池导入")])],1)],1)],1)],1)],1),n._v(" "),t("div",{staticClass:"control-group"},[t("el-form",{attrs:{inline:!0}},[t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:function(e){n.globalOperation(1)}}},[n._v("发布")])],1),n._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"info"},on:{click:function(e){n.globalOperation(2)}}},[n._v("撤销")])],1),n._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:function(e){n.globalOperation(3)}}},[n._v("推荐")])],1),n._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"info"},on:{click:function(e){n.globalOperation(4)}}},[n._v("取消推荐")])],1),n._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"danger"},on:{click:function(e){n.globalOperation(5)}}},[n._v("删除")])],1)],1)],1),n._v(" "),t("custom-el-table",{directives:[{name:"loading",rawName:"v-loading",value:n.tabLoading,expression:"tabLoading"}],attrs:{tableData:n.tableData,tableOptions:n.tableOptions,total:n.totalCount,ifmultipleSelection:!0},on:{handleSelectionChange:n.handleSelectionChange,blurInput:n.blurInputHandler,"cell-click":n.cellClick,edit:n.editHandler,delete:n.deleteHandler,action:n.actionHandler,more:n.moreHandler,"size-change":n.sizeChangeHandler,"page-change":n.pageChangeHandler},model:{value:n.pageIndex,callback:function(e){n.pageIndex=e},expression:"pageIndex"}})],1)},staticRenderFns:[]};var u=t("VU/8")(c,p,!1,function(n){t("zxm2")},"data-v-0d32ba8a",null);e.default=u.exports},zxm2:function(n,e,t){var a=t("Rpe6");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);t("rjj0")("1eda919c",a,!0)}});