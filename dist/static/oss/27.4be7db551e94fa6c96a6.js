webpackJsonp([27],{C6Ge:function(e,r,t){var i=t("XyO2");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);t("rjj0")("949b6802",i,!0)},HCZP:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i=t("BO1k"),a=t.n(i),o=t("y1uk"),p=t("Djz4"),l=t("5aCZ"),n=t("QbVN"),s=t("aU9J"),m=t("0xDb"),u={name:"contentEditorActivity",components:{Tinymce:l.a,imgCropper:s.a,uploadPrizeAvatar:n.a},data:function(){return{groupId:this.$route.params.id,action:this.$route.params.id?"modify":"add",images:[],public_address_options:[],groupFrm:{activity_name:"",type:1,time:[],activity_address:"",sponsor:"",description:"",img:[],authorizer_appid:"",mp_img:"",entry_conditions:[],entry_condition:[],manual_check:0,link:"",appid:"",remark:"",show_type:1},frmRules:{activity_name:[{required:!0,message:"请输入活动标题"}],type:[{required:!0,message:"请选择活动类型"}],time:[{required:!0,message:"请输入活动时间"}],img:[{required:!0,message:"请上传活动配图"}],authorizer_appid:[{required:!0,message:"请选择公众号"}],mp_img:[{required:!0,message:"请上传公众号配图"}],manual_check:[{required:!0,message:"请选择是否开启报名审核"}],link:[{required:!0,message:"请输入活动链接"}],appid:[{required:!0,message:"请输入appId"}],show_type:[{required:!0,message:"请选择展示方式"}],description:[{required:!0,message:"请输入活动描述"}]},matchModeOptions:[{value:1,label:"报名活动"},{value:2,label:"外部链接"},{value:3,label:"小程序跳转"}],signGroupsOptions:[{id:1,title:"需要填写姓名"},{id:2,title:"需要填写手机号"},{id:3,title:"需要填写身份证号码"},{id:4,title:"需要验证手机号"},{id:5,title:"需要验证实名信息"},{id:6,title:"需要选手关注公众号"}],pickerOptions:{disabledDate:function(e){return e.getTime()<Date.now()-864e5}}}},computed:{if_mp_img:function(){return!!this.groupFrm.entry_conditions.includes("需要选手关注公众号")}},created:function(){this.getAuthorizer(),this.groupId&&this.getData()},methods:{getData:function(){var e=this;p.a.activity.get(this.groupId).then(function(r){e.groupFrm.activity_name=r.activity_name,e.groupFrm.type=r.type-0,e.groupFrm.activity_address=r.address,e.groupFrm.description=r.detail,e.groupFrm.sponsor=r.sponsor,e.groupFrm.appid=r.appid,e.groupFrm.remark=r.remark,e.groupFrm.link=r.link,e.groupFrm.manual_check=r.apply_audit,e.groupFrm.mp_img=r.mp_img,e.groupFrm.show_type=r.show_type,e.groupFrm.authorizer_appid=r.authorizer_appid,r.start_time&&r.end_time&&(e.groupFrm.time=[Object(m.c)(r.start_time),Object(m.c)(r.end_time)]),e.groupFrm.img=r.images.map(function(e){return{file_path:e}}),e.groupFrm.entry_conditions=r.apply_condition,r.apply_condition.forEach(function(r){var t=!0,i=!1,o=void 0;try{for(var p,l=a()(e.signGroupsOptions);!(t=(p=l.next()).done);t=!0){var n=p.value;n.id===r-0&&e.groupFrm.entry_conditions.push(n.title)}}catch(e){i=!0,o=e}finally{try{!t&&l.return&&l.return()}finally{if(i)throw o}}})})},getAuthorizer:function(){var e=this;o.a.getAuthorizer().then(function(r){e.public_address_options=r.data})},get_pic:function(e){this.groupFrm.img=e},save:function(){var e=this,r={type:this.groupFrm.type,show_type:this.groupFrm.show_type,appid:this.groupFrm.appid,remark:this.groupFrm.remark,link:this.groupFrm.link,activity_name:this.groupFrm.activity_name,start_time:this.groupFrm.time[0],end_time:this.groupFrm.time[1],images:[],mp_img:this.groupFrm.mp_img,address:this.groupFrm.activity_address,sponsor:this.groupFrm.sponsor,detail:this.groupFrm.description,apply_condition:[],apply_audit:this.groupFrm.manual_check,authorizer_appid:this.groupFrm.authorizer_appid};this.groupId&&(r.id=this.groupId),r.images=this.groupFrm.img.map(function(e){return e.file_path}),this.signGroupsOptions.forEach(function(t){e.groupFrm.entry_conditions.includes(t.title)&&r.apply_condition.push(t.id)}),this.$refs.groupFrm.validate(function(t){t&&("modify"===e.action?p.a.activity.edit(r):p.a.activity.add(r)).then(function(r){e.$router.back()})})}}},c={render:function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",{staticClass:"app-container"},[t("el-form",{ref:"groupFrm",staticClass:"code-add__frm",attrs:{model:e.groupFrm,rules:e.frmRules,"label-width":"80px"}},[t("el-form-item",{attrs:{prop:"type",label:"活动类型"}},[t("el-select",{attrs:{placeholder:"活动类型"},model:{value:e.groupFrm.type,callback:function(r){e.$set(e.groupFrm,"type",r)},expression:"groupFrm.type"}},e._l(e.matchModeOptions,function(e,r){return t("el-option",{key:r,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),1==e.groupFrm.type?[t("el-form-item",{attrs:{prop:"activity_name",label:"活动标题"}},[t("el-input",{attrs:{name:"matchName",clearable:!0,placeholder:"请输入活动标题"},model:{value:e.groupFrm.activity_name,callback:function(r){e.$set(e.groupFrm,"activity_name",r)},expression:"groupFrm.activity_name"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"time",label:"活动时间"}},[t("el-date-picker",{attrs:{editable:!1,type:"datetimerange","range-separator":"至","start-placeholder":"开始时间","end-placeholder":"结束时间","value-format":"yyyy-MM-dd HH:mm:ss",align:"left","picker-options":e.pickerOptions},model:{value:e.groupFrm.time,callback:function(r){e.$set(e.groupFrm,"time",r)},expression:"groupFrm.time"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"activity_address",label:"活动地址"}},[t("el-input",{attrs:{name:"matchAddress",clearable:!0,placeholder:"请输入活动地址"},model:{value:e.groupFrm.activity_address,callback:function(r){e.$set(e.groupFrm,"activity_address",r)},expression:"groupFrm.activity_address"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"sponsor",label:"主办方"}},[t("el-input",{attrs:{name:"sponsor",clearable:!0,placeholder:"请输入主办方"},model:{value:e.groupFrm.sponsor,callback:function(r){e.$set(e.groupFrm,"sponsor",r)},expression:"groupFrm.sponsor"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"img",label:"活动配图"}},[t("img-cropper",{attrs:{pic:e.groupFrm.img,width:750,height:422},on:{get_pic:e.get_pic}}),e._v(" "),t("small",{staticClass:"text-999"},[e._v("建议尺寸：800*500像素，你可以拖拽图片调整顺序，最多上传15张")])],1),e._v(" "),e.if_mp_img?[t("el-form-item",{attrs:{prop:"authorizer_appid",label:"公众号"}},[t("el-select",{attrs:{placeholder:"请选择公众号"},model:{value:e.groupFrm.authorizer_appid,callback:function(r){e.$set(e.groupFrm,"authorizer_appid",r)},expression:"groupFrm.authorizer_appid"}},e._l(e.public_address_options,function(e){return t("el-option",{key:e.id,attrs:{label:e.nick_name,value:e.authorizer_appid}})}))],1),e._v(" "),t("el-form-item",{attrs:{prop:"mp_img",label:"公众号配图","label-width":"90px"}},[t("upload-prize-avatar",{model:{value:e.groupFrm.mp_img,callback:function(r){e.$set(e.groupFrm,"mp_img",r)},expression:"groupFrm.mp_img"}})],1)]:e._e(),e._v(" "),t("el-form-item",{attrs:{prop:"entry_conditions",label:"报名要求"}},[t("el-checkbox-group",{staticClass:"requirement",model:{value:e.groupFrm.entry_conditions,callback:function(r){e.$set(e.groupFrm,"entry_conditions",r)},expression:"groupFrm.entry_conditions"}},e._l(e.signGroupsOptions,function(e,r){return t("el-checkbox",{key:r,attrs:{label:e.title}})})),e._v(" "),t("small",{staticClass:"text-999"},[e._v("多选为所有规则都需要满足才能报名，不选则为没有限制")])],1),e._v(" "),t("el-form-item",{attrs:{prop:"manual_check",label:"报名审核"}},[t("el-radio-group",{model:{value:e.groupFrm.manual_check,callback:function(r){e.$set(e.groupFrm,"manual_check",r)},expression:"groupFrm.manual_check"}},[t("el-radio",{attrs:{label:0}},[e._v("关")]),e._v(" "),t("el-radio",{attrs:{label:1}},[e._v("开")])],1)],1),e._v(" "),t("el-form-item",{attrs:{prop:"description",label:"活动详情"}},[t("tinymce",{attrs:{placeholder:"请输入活动详情",height:300},model:{value:e.groupFrm.description,callback:function(r){e.$set(e.groupFrm,"description",r)},expression:"groupFrm.description"}})],1)]:[2==e.groupFrm.type?t("el-form-item",{attrs:{prop:"link",label:"活动链接"}},[t("el-input",{attrs:{name:"link",clearable:!0,placeholder:"请输入活动链接"},model:{value:e.groupFrm.link,callback:function(r){e.$set(e.groupFrm,"link",r)},expression:"groupFrm.link"}})],1):e._e(),e._v(" "),3==e.groupFrm.type?[t("el-form-item",{attrs:{prop:"appid",label:"appId"}},[t("el-input",{attrs:{name:"appid",clearable:!0,placeholder:"请输入小程序appId"},model:{value:e.groupFrm.appid,callback:function(r){e.$set(e.groupFrm,"appid",r)},expression:"groupFrm.appid"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"remark",label:"备注"}},[t("el-input",{attrs:{name:"remark",clearable:!0,placeholder:"请输入备注"},model:{value:e.groupFrm.remark,callback:function(r){e.$set(e.groupFrm,"remark",r)},expression:"groupFrm.remark"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"link",label:"小程序路径","label-width":"90px"}},[t("el-input",{attrs:{name:"link",clearable:!0,placeholder:"请输入小程序路径"},model:{value:e.groupFrm.link,callback:function(r){e.$set(e.groupFrm,"link",r)},expression:"groupFrm.link"}})],1)]:e._e(),e._v(" "),t("el-form-item",{attrs:{prop:"show_type",label:"展示方式"}},[t("el-radio-group",{model:{value:e.groupFrm.show_type,callback:function(r){e.$set(e.groupFrm,"show_type",r)},expression:"groupFrm.show_type"}},[t("el-radio",{attrs:{label:1}},[e._v("图片")]),e._v(" "),t("el-radio",{attrs:{label:2}},[e._v("活动卡片")])],1)],1),e._v(" "),t("el-form-item",{attrs:{prop:"activity_name",label:"活动标题"}},[t("el-input",{attrs:{name:"matchName",clearable:!0,placeholder:"请输入活动标题"},model:{value:e.groupFrm.activity_name,callback:function(r){e.$set(e.groupFrm,"activity_name",r)},expression:"groupFrm.activity_name"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"img",label:"活动配图"}},[t("img-cropper",{attrs:{pic:e.groupFrm.img,type:"only",width:1==e.groupFrm.show_type?351:312,height:1==e.groupFrm.show_type?217:234},on:{get_pic:e.get_pic}})],1)],e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary"},on:{click:function(r){r.preventDefault(),r.stopPropagation(),e.save(r)}}},[e._v("保存")]),e._v(" "),t("el-button",{on:{click:function(r){e.$router.back()}}},[e._v("取消")])],1)],2)],1)},staticRenderFns:[]};var d=t("VU/8")(u,c,!1,function(e){t("C6Ge")},"data-v-27e02d4b",null);r.default=d.exports},XyO2:function(e,r,t){(e.exports=t("FZ+f")(!1)).push([e.i,"\n.editor-item[data-v-27e02d4b]{\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  width: 470px;\r\n  -webkit-box-pack: justify;\r\n      -ms-flex-pack: justify;\r\n          justify-content: space-between;\n}\n.requirement[data-v-27e02d4b]{\r\n  width: 500px;\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -ms-flex-wrap: wrap;\r\n      flex-wrap: wrap;\r\n  -webkit-box-pack: justify;\r\n      -ms-flex-pack: justify;\r\n          justify-content: space-between;\n}\n.requirement .el-checkbox[data-v-27e02d4b]{\r\n  margin-left: 0;\n}\r\n",""])}});