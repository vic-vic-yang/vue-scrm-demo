webpackJsonp([7],{Q3J1:function(n,e,t){var a=t("iI5T");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);t("rjj0")("295a4f8c",a,!0)},ZVW1:function(n,e,t){var a=t("g4Lt");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);t("rjj0")("f394dea4",a,!0)},g4Lt:function(n,e,t){(n.exports=t("FZ+f")(!1)).push([n.i,"\n.vdo[data-v-a617d9ce]{\r\n  position: relative;\r\n  height: auto;\r\n  width: auto;\n}\n.del[data-v-a617d9ce]{\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  width: 20px;\r\n  height: 20px;\r\n  background: rgba(0,0,0,0.6);\r\n  color: #ffffff;\n}\r\n",""])},iI5T:function(n,e,t){(n.exports=t("FZ+f")(!1)).push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])},jMvm:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t("Ndhk"),i=t("Djz4"),o=t("z2KI"),l=t("5aCZ"),r=t("aU9J"),s=t("uzBN"),p={data:function(){return{isUploadLoading:!1,showVdoDel:!1,uploadPercent:0}},props:["video","width","height"],methods:{add_vdo:function(){this.$refs.inputer.click()},new_upload_video:function(n){var e=this,t=n.target.files[0];this.isUploadLoading=!0,s.a.img(t,"file",function(n){e.uploadPercent=Math.min(99,Math.floor(100*n.loaded/n.total))}).then(function(n){e.setVdo(n.url),e.isUploadLoading=!1}).catch(function(){e.isUploadLoading=!1,e.uploadPercent=0})},setVdo:function(n){this.$emit("setVdo",n)},delVdo:function(){this.$emit("delVdo")}}},c={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",[n.video?[t("div",{staticClass:"vdo",style:n.width?"width:"+n.width+"px":"width: 600px",on:{mouseover:function(e){n.showVdoDel=!0},mouseout:function(e){n.showVdoDel=!1}}},[t("video",{staticStyle:{"margin-left":"20px"},attrs:{src:n.video,controls:"controls",width:n.width?n.width+"px":"600px",height:n.height?n.height+"px":"380px"}}),n._v(" "),t("a",{directives:[{name:"show",rawName:"v-show",value:n.showVdoDel,expression:"showVdoDel"}],staticClass:"del",on:{click:function(e){e.stopPropagation(),e.preventDefault(),n.delVdo(e)},mouseover:function(e){n.showVdoDel=!0},mouseout:function(e){n.showVdoDel=!1}}},[t("i",{staticClass:"el-icon-close"})])])]:[t("el-progress",{directives:[{name:"show",rawName:"v-show",value:n.isUploadLoading,expression:"isUploadLoading"}],attrs:{type:"circle",percentage:n.uploadPercent}}),n._v(" "),t("el-button",{directives:[{name:"show",rawName:"v-show",value:!n.isUploadLoading,expression:"!isUploadLoading"}],attrs:{type:"primary",plain:""},on:{click:n.add_vdo}},[n._v("上传视频")]),n._v(" "),t("input",{ref:"inputer",staticClass:"el-upload__input",attrs:{type:"file",name:"file",id:"inputer",accept:"video/*",multiple:""},on:{change:n.new_upload_video}})]],2)},staticRenderFns:[]};var d=t("VU/8")(p,c,!1,function(n){t("ZVW1")},"data-v-a617d9ce",null).exports,u={name:"manualAddCont",components:{Tinymce:l.a,imgCropper:r.a,uploadVideo:d},data:function(){return{action:this.$route.params.id?"modify":"add",images:[],groupFrm:{id:this.$route.params.id,article_type:"1",source_type:"",appid:"",channel_id:[],classify_id:"",tags:[],cover:"",title:"",author:"",original_url:"",video:"",digest:"",showType:!1,content:""},tabLoading:!1,classifiCations:[],labelifiCations:[],channesList:[],classifiCation_page_info:{pageIndex:1,pageSize:999,totalCount:1,tabLoading:!0},labelifiCation_page_info:{pageIndex:1,pageSize:999,totalCount:1,tabLoading:!0},sourceOptions:[{label:"内部文章",value:"3"},{label:"网页文章",value:"2"},{label:"公众号文章",value:"1"}],frmRules:{title:[{required:!0,message:"请输入标题"}],source_type:[{required:!0,message:"请选择文章类型"}],classify_id:[{required:!0,message:"请选择内容分类"}],cover:[{required:!0,message:"请上传封面图"}],video:[{required:!0,message:"请上传视频"}],digest:[{required:!0,message:"请输入简介"}],author:[{required:!0,message:"请输入内容来源"}]}}},created:function(){"modify"===this.action?(this.tabLoading=!0,this.getData()):this.getChannel(),this.getClassifications(),this.getLabelifiCations()},methods:{getData:function(){var n=this;a.a.list.get(this.$route.params.id).then(function(e){"0"!==e.channel_id&&e.channel_id?e.channel_id=e.channel_id.split(","):e.channel_id=[],"1"===e.show_type||2===e.bind_mini||"2"===e.bind_mini?e.showType=!0:e.showType=!1,n.groupFrm=e,n.images=[{file_path:e.cover}],n.tabLoading=!1,console.log(1),n.$nextTick(function(){n.getChannel()})})},getChannel:function(){var n=this;o.a.getChannels({pageIndex:1,pageSize:20}).then(function(e){n.channesList=e.result})},setVdo:function(n){this.groupFrm.video=n},delVdo:function(){this.groupFrm.video=""},currentChangeClass:function(n){this.classifiCation_page_info.pageIndex=n,this.getClassifications()},currentChangeLabel:function(n){this.labelifiCation_page_info.pageIndex=n,this.getLabelifiCations()},getClassifications:function(){var n=this;this.classifiCation_page_info.tabLoading=!0,a.a.class.list({pageIndex:this.classifiCation_page_info.pageIndex,pageSize:this.classifiCation_page_info.pageSize}).then(function(e){n.classifiCations=e.result,n.classifiCation_page_info.totalCount=1*e.totalCount,n.classifiCation_page_info.tabLoading=!1})},getLabelifiCations:function(){var n=this;this.labelifiCation_page_info.tabLoading=!0,i.a.label.list({pageIndex:this.labelifiCation_page_info.pageIndex,pageSize:this.labelifiCation_page_info.pageSize}).then(function(e){n.labelifiCations=e.result,n.labelifiCation_page_info.totalCount=1*e.totalCount,n.labelifiCation_page_info.tabLoading=!1})},get_pic:function(n){this.images=n,this.groupFrm.cover=n[0]&&n[0].file_path?n[0].file_path:""},save:function(){var n=this;this.$refs.groupFrm.validate(function(e){if(e){var t=n.groupFrm;t.content=t.content.replace("<img",'<img style="max-width:100%;height:auto" '),t.showType?t.show_type=1:t.show_type=2,("modify"===n.action?a.a.list.edit(t):a.a.list.add(t)).then(function(){n.$router.back()})}})}}},g={render:function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{directives:[{name:"loading",rawName:"v-loading",value:n.tabLoading,expression:"tabLoading"}],staticClass:"app-container"},[t("el-tabs",{model:{value:n.groupFrm.article_type,callback:function(e){n.$set(n.groupFrm,"article_type",e)},expression:"groupFrm.article_type"}},[t("el-tab-pane",{attrs:{label:"图文",name:"1"}}),n._v(" "),t("el-tab-pane",{attrs:{label:"视频",name:"2"}})],1),n._v(" "),t("el-form",{ref:"groupFrm",staticClass:"code-add__frm",attrs:{model:n.groupFrm,rules:n.frmRules,"label-width":"100px"}},[t("el-form-item",{attrs:{prop:"title",label:"标题"}},[t("el-input",{attrs:{name:"title",clearable:!0,placeholder:"请输入标题"},model:{value:n.groupFrm.title,callback:function(e){n.$set(n.groupFrm,"title",e)},expression:"groupFrm.title"}})],1),n._v(" "),t("el-form-item",{attrs:{prop:"source_type",label:"文章类型"}},[t("el-select",{attrs:{placeholder:"文章类型"},model:{value:n.groupFrm.source_type,callback:function(e){n.$set(n.groupFrm,"source_type",e)},expression:"groupFrm.source_type"}},n._l(n.sourceOptions,function(n,e){return t("el-option",{key:e,attrs:{label:n.label,value:n.value}})}))],1),n._v(" "),t("el-form-item",{attrs:{prop:"appid",label:"公众号appid"}},[t("el-input",{attrs:{name:"appid",clearable:!0,placeholder:"请输入标题"},model:{value:n.groupFrm.appid,callback:function(e){n.$set(n.groupFrm,"appid",e)},expression:"groupFrm.appid"}})],1),n._v(" "),t("el-form-item",{attrs:{label:"频道"}},[t("el-select",{staticStyle:{width:"480px"},attrs:{multiple:"",placeholder:"请选择频道"},model:{value:n.groupFrm.channel_id,callback:function(e){n.$set(n.groupFrm,"channel_id",e)},expression:"groupFrm.channel_id"}},n._l(n.channesList,function(n,e){return t("el-option",{key:e,attrs:{label:n.channel_name,value:n.id}})}))],1),n._v(" "),t("el-form-item",{attrs:{prop:"classify_id",label:"内容分类"}},[t("el-select",{staticStyle:{width:"230px"},attrs:{placeholder:"请选择内容分类",clearable:""},model:{value:n.groupFrm.classify_id,callback:function(e){n.$set(n.groupFrm,"classify_id",e)},expression:"groupFrm.classify_id"}},n._l(n.classifiCations,function(n){return t("el-option",{key:n.id,attrs:{label:n.classify_name,value:n.id}})}))],1),n._v(" "),t("el-form-item",{attrs:{prop:"tags",label:"内容标签"}},[t("el-select",{staticStyle:{width:"480px"},attrs:{placeholder:"请选择内容标签",clearable:"",multiple:""},model:{value:n.groupFrm.tags,callback:function(e){n.$set(n.groupFrm,"tags",e)},expression:"groupFrm.tags"}},n._l(n.labelifiCations,function(n){return t("el-option",{key:n.id,attrs:{label:n.tag_name,value:n.id}})}))],1),n._v(" "),t("el-form-item",{attrs:{prop:"digest",label:"简介"}},[t("el-input",{attrs:{name:"digest",clearable:!0,placeholder:"请输入简介"},model:{value:n.groupFrm.digest,callback:function(e){n.$set(n.groupFrm,"digest",e)},expression:"groupFrm.digest"}})],1),n._v(" "),1==n.groupFrm.bind_mini?t("el-form-item",{attrs:{label:"展示方式"}},[t("el-switch",{attrs:{"active-text":"手动编辑","inactive-text":"采用链接"},model:{value:n.groupFrm.showType,callback:function(e){n.$set(n.groupFrm,"showType",e)},expression:"groupFrm.showType"}})],1):n._e(),n._v(" "),"1"==n.groupFrm.article_type&&n.groupFrm.showType?t("el-form-item",{attrs:{prop:"intro",label:"详情"}},[t("tinymce",{attrs:{placeholder:"请输入详情",height:300},model:{value:n.groupFrm.content,callback:function(e){n.$set(n.groupFrm,"content",e)},expression:"groupFrm.content"}})],1):n._e(),n._v(" "),t("el-form-item",{attrs:{prop:"cover",label:"封面"}},[t("img-cropper",{attrs:{pic:n.images,type:"only",width:335,height:415},on:{get_pic:n.get_pic}})],1),n._v(" "),"2"==n.groupFrm.article_type&&n.groupFrm.showType?t("el-form-item",{attrs:{prop:"video",label:"上传视频"}},[t("upload-video",{attrs:{video:n.groupFrm.video},on:{setVdo:n.setVdo,delVdo:n.delVdo}})],1):n._e(),n._v(" "),t("el-form-item",{attrs:{prop:"author",label:"内容来源"}},[t("el-input",{attrs:{name:"author",clearable:!0,placeholder:"请输入内容来源"},model:{value:n.groupFrm.author,callback:function(e){n.$set(n.groupFrm,"author",e)},expression:"groupFrm.author"}})],1),n._v(" "),t("el-form-item",{attrs:{prop:"content_address",label:"来源地址"}},[t("el-input",{attrs:{name:"content_address",clearable:!0,placeholder:"请输入来源地址"},model:{value:n.groupFrm.original_url,callback:function(e){n.$set(n.groupFrm,"original_url",e)},expression:"groupFrm.original_url"}})],1),n._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:function(e){e.preventDefault(),e.stopPropagation(),n.save(e)}}},[n._v("保存")]),n._v(" "),t("el-button",{on:{click:function(e){n.$router.back()}}},[n._v("取消")])],1)],1)],1)},staticRenderFns:[]};var m=t("VU/8")(u,g,!1,function(n){t("Q3J1")},"data-v-890c9412",null);e.default=m.exports}});