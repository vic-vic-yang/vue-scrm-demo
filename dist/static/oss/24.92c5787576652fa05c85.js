webpackJsonp([24],{"6tX9":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("woOf"),r=i.n(a),n=i("Dd8w"),o=i.n(n),s=i("//Fk"),l=i.n(s),c=i("t/v+"),p=i("QbVN"),u=i("XvNa"),g=i("M4fF"),d=i.n(g),m={name:"topicEditor",components:{uploadPrizeAvatar:p.a},data:function(){return{topicId:this.$route.params.id,action:this.$route.params.id?"modify":"add",type:1*this.$route.query.type,topicFrm:{title:"",answers:[{title:"",isTrue:!1},{title:"",isTrue:!1},{title:"",isTrue:!1},{title:"",isTrue:!1}],groupId:1*this.$route.query.group||"",desc:"",picUrl:"",article_id:null},frmRules:{title:[{required:!0,message:"请输入题目名称"}],groupId:[{required:!0,message:"请选择所属题库"}],desc:[{required:!1,message:"请输入题库说明"}]},selectAnswerIndex:-1,questionGroupsOptions:[],articles:[],pageLoading:!0,groups_page_info:{pageIndex:1,pageSize:10,totalCount:1},articl_page_info:{pageIndex:1,pageSize:10,totalCount:1}}},watch:{selectAnswerIndex:function(e){var t=this;this.topicFrm.answers.map(function(i,a){t.$set(t.topicFrm.answers[a],"isTrue",a===e)})}},created:function(){l.a.all([this.getGroups(),this.getArticle(),this.getData()])},methods:{changeAnswer:function(e){this.topicFrm.answers.map(function(t){e.title===t.title&&(t.isTrue=!0)})},currentChangeGroups:function(e){this.groups_page_info.pageIndex=e,this.getGroups()},currentChangeArticle:function(e){this.articl_page_info.pageIndex=e,this.getArticle()},getGroups:function(){var e=this,t={pageIndex:this.groups_page_info.pageIndex,pageSize:this.groups_page_info.pageSize};c.a.group.list(t).then(function(t){e.questionGroupsOptions=t.items,e.pageLoading=!1,e.groups_page_info={pageIndex:1*t.pageIndex,pageSize:1*t.pageSize,totalCount:1*t.totalCount}}).catch(function(t){console.log("game editor get data error : ",t),e.pageLoading=!1})},getData:function(){var e=this;if(!this.topicId)return l.a.resolve();c.a.topic.get(this.topicId).then(function(t){1===e.type&&(e.selectAnswerIndex=d.a.findIndex(t.data.answers,"isTrue",!0),-1===e.selectAnswerIndex&&(e.selectAnswerIndex=0,console.log(e.selectAnswerIndex))),e.topicFrm=o()({},t.data),e.topicFrm.article_id=parseInt(e.topicFrm.article_id,10)})},getArticle:function(){var e=this,t={pageIndex:this.articl_page_info.pageIndex,pageSize:this.articl_page_info.pageSize};u.a.list(t).then(function(t){e.articl_page_info={pageIndex:1*t.pageIndex,pageSize:1*t.pageSize,totalCount:1*t.totalCount},e.articles=t.result.map(function(e){return o()({},e,{id:parseInt(e.id)})})})},save:function(){var e=this;this.$refs.topicFrm.validate(function(t){if(t){var i=r()({},e.topicFrm);("modify"===e.action?c.a.topic.edit(i):c.a.topic.add(i)).then(function(){e.$router.back()})}})},addAnswer:function(){this.topicFrm.answers.length<5&&this.topicFrm.answers.push({title:"",isTrue:!1})},deleteAnswer:function(e){this.topicFrm.answers.length>2&&this.topicFrm.answers.splice(e,1)},deleteImg:function(){this.topicFrm.picUrl=""}}},f={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-container"},[i("el-form",{ref:"topicFrm",staticClass:"code-add__frm",attrs:{model:e.topicFrm,rules:e.frmRules,"label-width":"100px"}},[i("el-form-item",{attrs:{prop:"title",label:"题目名称"}},[i("el-input",{attrs:{name:"title",placeholder:"题目名称"},model:{value:e.topicFrm.title,callback:function(t){e.$set(e.topicFrm,"title",t)},expression:"topicFrm.title"}})],1),e._v(" "),i("el-form-item",{attrs:{prop:"answer",label:"题目答案"}},e._l(e.topicFrm.answers,function(t,a){return i("el-row",{key:a,class:{"mb-20":a!==e.topicFrm.answers.length-1}},[i("el-col",{attrs:{span:12}},[i("el-input",{attrs:{name:"answerTitle"+a,clearable:!0,placeholder:"请输入答案"},model:{value:t.title,callback:function(i){e.$set(t,"title",i)},expression:"answer.title"}})],1),e._v(" "),i("el-col",{attrs:{span:12}},[2==e.type?i("el-checkbox",{staticClass:"ml-20 mr-10",model:{value:t.isTrue,callback:function(i){e.$set(t,"isTrue",i)},expression:"answer.isTrue"}},[e._v("正确答案")]):e._e(),e._v(" "),1==e.type?i("el-radio",{staticClass:"ml-20 mr-10",attrs:{label:a},model:{value:e.selectAnswerIndex,callback:function(t){e.selectAnswerIndex=t},expression:"selectAnswerIndex"}},[e._v("正确答案")]):e._e(),e._v(" "),a===e.topicFrm.answers.length-1?[e.topicFrm.answers.length<5?i("el-button",{attrs:{type:"text",icon:"el-icon-plus"},on:{click:e.addAnswer}},[e._v("添加")]):e._e(),e._v(" "),e.topicFrm.answers.length>2?i("el-button",{attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(t){e.deleteAnswer(a)}}},[e._v("删除")]):e._e()]:e._e()],2)],1)})),e._v(" "),i("el-form-item",{attrs:{prop:"groups",label:"所属题库"}},[i("el-select",{attrs:{placeholder:"请选择所属题库",disabled:""},model:{value:e.topicFrm.groupId,callback:function(t){e.$set(e.topicFrm,"groupId",t)},expression:"topicFrm.groupId"}},[e._l(e.questionGroupsOptions,function(e){return i("el-option",{key:e.id,attrs:{label:e.title,value:e.id}})}),e._v(" "),i("div",{staticClass:"article_pages"},[i("el-pagination",{attrs:{"page-size":e.groups_page_info.pageSize,"pager-count":Math.ceil(e.groups_page_info.totalCount/e.groups_page_info.pageSize),"current-page":e.groups_page_info.pageIndex,layout:"prev, pager, next",total:e.groups_page_info.totalCount},on:{"current-change":e.currentChangeGroups}})],1)],2)],1),e._v(" "),i("el-form-item",{attrs:{prop:"groups",label:"关联文章"}},[i("el-select",{attrs:{placeholder:"请选择关联文章",filterable:""},model:{value:e.topicFrm.article_id,callback:function(t){e.$set(e.topicFrm,"article_id",t)},expression:"topicFrm.article_id"}},[e._l(e.articles,function(e){return i("el-option",{key:e.id,attrs:{label:e.article_name,value:e.id}})}),e._v(" "),i("div",{staticClass:"article_pages"},[i("el-pagination",{attrs:{"page-size":e.articl_page_info.pageSize,"pager-count":Math.ceil(e.articl_page_info.totalCount/e.articl_page_info.pageSize),"current-page":e.articl_page_info.pageIndex,layout:"prev, pager, next",total:e.articl_page_info.totalCount},on:{"current-change":e.currentChangeArticle}})],1)],2)],1),e._v(" "),i("el-form-item",{attrs:{prop:"desc",label:"题目说明"}},[i("el-input",{attrs:{type:"textarea",rows:3,name:"desc",placeholder:"请输入题目说明"},model:{value:e.topicFrm.desc,callback:function(t){e.$set(e.topicFrm,"desc",t)},expression:"topicFrm.desc"}})],1),e._v(" "),i("el-form-item",{attrs:{prop:"imageUrl",label:"题目配图(选填)"}},[i("upload-prize-avatar",{model:{value:e.topicFrm.picUrl,callback:function(t){e.$set(e.topicFrm,"picUrl",t)},expression:"topicFrm.picUrl"}}),e._v(" "),e.topicFrm.picUrl?i("el-button",{attrs:{type:"danger"},on:{click:e.deleteImg}},[e._v("删除图片")]):e._e()],1),e._v(" "),i("el-form-item",[i("el-button",{attrs:{type:"primary"},on:{click:function(t){t.preventDefault(),t.stopPropagation(),e.save(t)}}},[e._v("保存")]),e._v(" "),i("el-button",{on:{click:function(t){e.$router.back()}}},[e._v("取消")])],1)],1)],1)},staticRenderFns:[]};var _=i("VU/8")(m,f,!1,function(e){i("hY2S")},"data-v-34a45524",null);t.default=_.exports},hY2S:function(e,t,i){var a=i("qnUO");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);i("rjj0")("591688fa",a,!0)},qnUO:function(e,t,i){(e.exports=i("FZ+f")(!1)).push([e.i,"\n.article_pages[data-v-34a45524]{\n  text-align: right;\n  margin: 5px 0 0;\n}\n",""])}});