webpackJsonp([62],{"2oiY":function(t,e,a){var n=a("Zmqq");"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a("rjj0")("3ded6598",n,!0)},StG4:function(t,e,a){"use strict";var n=a("gyMJ");e.a={list:function(t){return n.a.get("/content/util/members",{params:t}).then(function(t){return t.data})},get:function(t){return n.a.get("/content/util/members/"+t).then(function(t){return t.data})}}},VfQs:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("YK4W"),i=a("StG4"),o={name:"userMatchRecord",components:{DetailCard:a("afCy").a,customElTable:n.a},data:function(){return{userId:this.$route.params.id,tableOptions:[{label:"收藏数",prop:"collections"},{label:"浏览次数",prop:"view"},{label:"参加活动数",prop:"activities"},{label:"评论数",prop:"comments"}],pageLoading:!0,userDetail:{}}},created:function(){var t=this;i.a.get(this.userId).then(function(e){e.playerInfo=[e.playerInfo],t.userDetail=e,t.pageLoading=!1}).catch(function(){t.pageLoading=!1})}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.pageLoading,expression:"pageLoading"}],staticClass:"app-container"},[a("detail-card",{attrs:{title:"基础信息"}},[a("div",{staticClass:"item-detail-content"},[a("p",[t._v("姓名 : "+t._s(t.userDetail.user_name?t.userDetail.user_name:"--"))]),t._v(" "),a("p",[t._v("微信昵称 : "+t._s(t.userDetail.nickname?t.userDetail.nickname:"--"))]),t._v(" "),a("span",[t._v("手机号码 :")]),t._v(" "),a("div",{staticClass:"item-detail"},t._l(t.userDetail.contacts,function(e,n){return a("p",{key:n},[t._v(t._s(e.phone?e.phone:" --"))])})),t._v(" "),a("span",[t._v("地址 :")]),t._v(" "),a("div",{staticClass:"item-detail"},t._l(t.userDetail.contacts,function(e,n){return a("p",{key:n},[t._v(t._s(e.province||" --")+t._s(e.city)+t._s(e.zone)+t._s(e.detail))])}))])]),t._v(" "),a("detail-card",{attrs:{title:"更多信息"}},[a("custom-el-table",{attrs:{tableData:t.userDetail.playerInfo,tableOptions:t.tableOptions}})],1)],1)},staticRenderFns:[]};var l=a("VU/8")(o,s,!1,function(t){a("2oiY")},"data-v-7ad01d4c",null);e.default=l.exports},Zmqq:function(t,e,a){(t.exports=a("FZ+f")(!1)).push([t.i,"\n.item-detail-content[data-v-7ad01d4c] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: auto;\n}\n.item-detail-content span[data-v-7ad01d4c] {\n    margin-top: 16px;\n}\n.item-detail-content p[data-v-7ad01d4c] {\n    display: inline-block;\n    margin-right: 40px;\n    margin-bottom: 0;\n}\n.item-detail[data-v-7ad01d4c] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  height: auto;\n}\n.flex-box-autoFix[data-v-7ad01d4c] {\n  overflow: hidden;\n}\n",""])}});