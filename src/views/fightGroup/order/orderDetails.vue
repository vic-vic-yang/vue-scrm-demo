<template>
  <div class="app-container">
     <el-card class="mv-30">
        <el-row>
            <el-col :span="12" class="right-line">
                <div class="text item"><span class="fs-13 text-666">订单号：{{order_info.order_number}}</span></div>
                <div class="text item" v-if="order_info.status_cn">
                  <span class="fs-13 text-666">订单状态：</span>
                  <el-button class="fs-13" type="text" >{{order_info.status_cn.status_name||"--"}}</el-button>
                  <el-button v-if="order_goods_info[0].goods_type==1&&(order_info.status_cn.status==1||order_info.status_cn.status==2||order_info.status_cn.status==3)" style="margin-left: 30px"  @click.prevent="renewbindHandler">更新物流状态</el-button>
                </div>
            </el-col>
            <el-col :span="11" class="item-border">
                <el-steps :active="number" align-center>
                  <el-step v-for="item in process" v-if="item.time" v-bind:key="item.name" :title="item.name" :description="item.time" icon="el-icon-circle-check"></el-step>
                </el-steps>
            </el-col>
        </el-row>
    </el-card>
    <el-card class="mv-30" v-if="order_goods_info[0]&&order_goods_info[0].goods_type==1">
       <el-row>
          <el-col :span="12" >
            <div class="text item"><span class="fs-16 text-666">快递信息</span></div>
            <div class="text item"><span class="fs-13 text-666">发货时间：</span>{{order_info.express_time||"--"}}</div>
            <div class="text item"><span class="fs-13 text-666">快递公司：</span>{{order_info.express_company_cn||"--"}}</div>
            <div class="text item"><span class="fs-13 text-666">运单号号：</span>{{order_info.express_number||"--"}}</div>
          </el-col>
          <el-col :span="11" class="ml-20">
            <div class="text item"><span class="fs-16 text-666">物流状态：{{express_info.status_text}}</span></div>
            <div v-if="express_info.list" class="process_c">
              <el-steps active="1" direction="vertical" :space="200">
                <el-step style="display: -webkit-box" v-for="(item,index) in express_info.list"  v-bind:key="index" :title="item.content" :description="item.time" icon="el-icon-circle-check"></el-step>
              </el-steps>
            </div>
          </el-col>
      </el-row>
    </el-card>
    <el-card class="mv-30">
       <el-row>
         <el-col :span="6" v-if="order_goods_info[0]&&order_goods_info[0].goods_type==1">
             <div class="text item"><span class="fs-16 text-666">收货信息</span></div>
             <div class="text item"><span class="fs-13 text-666">收货人：</span>{{order_info.user_name}}</div>
             <div class="text item"><span class="fs-13 text-666">联系电话：</span>{{order_info.phone}}</div>
             <div class="text item"><span class="fs-13 text-666">收货地址：</span><span class="fs-13 text-666">{{order_info.address}}</span></div>
         </el-col>
         <el-col :span="4" class="pl-20" v-if="order_goods_info[0]&&order_goods_info[0].goods_type==1">
             <div class="text item"><span class="fs-16 text-666">配送信息</span></div>
             <div class="text item"><span class="fs-13 text-666">配送方式：</span>快递</div>
             <div class="text item"><span class="fs-13 text-666">发货时间：</span>{{order_info.express_time||"--"}}</div>
         </el-col>
         <el-col :span="4" class="pl-20" v-if="order_info.pay_status==1">
             <div class="text item"><span class="fs-16 text-666">付款信息</span></div>
             <div class="text item"><span class="fs-13 text-666">实付金额：</span>{{order_info.pay_money}}</div>
             <div class="text item"><span class="fs-13 text-666">付款方式：</span>{{order_info.pay_way_cn}}</div>
             <div class="text item"><span class="fs-13 text-666">付款时间：</span>{{order_info.pay_time}}</div>
         </el-col>
         <el-col :span="4" class="pl-20" v-if="order_info.pay_status==1">
             <div class="text item"><span class="fs-16 text-666">优惠信息</span></div>
             <div class="text item"><span class="fs-13 text-666">积分抵扣：</span>{{order_info.integral_deduction_money}}</div>
         </el-col>
         <el-col :span="4" class="pl-20">
             <div class="text item"><span class="fs-16 text-666">买家信息</span></div>
             <div class="text item"><span class="fs-13 text-666">买家信息：{{order_info.user_name}}</span></div>
         </el-col>
       </el-row>
    </el-card>
    <custom-el-table
      :tableData="tableData"
      :tableOptions="tableOptions">
    </custom-el-table>
    <div class="end">
      <div>
        <div class="text item"><span class="span">商品总价：￥{{order_info.total_money}}</span></div>
        <div class="text item"><span class="span">运费：￥{{order_info.freight}}</span></div>
        <div class="text item"><span class="span">优惠金额：￥{{order_info.integral_deduction_money}}</span></div>
        <div class="text item"><span class="span">订单金额：￥{{order_info.need_pay_money}}</span></div>
      </div>
     
    </div>
    <el-dialog title="物流信息" :visible.sync="prepositionShow">
      <el-form :model="preposition">
         <el-form-item prop="matchMode" label="物流公司">
          <el-select placeholder="请选择物流公司" v-model="preposition.companay">
            <el-option v-for="item in companayList" :key="item.id" :label="item.name_cn" :value="item.name_en"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_from" label="物流单号">
          <el-input style="width: 200px;" v-model="preposition.id" placeholder="物流单号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="prepositionShow = false">取 消</el-button>
        <el-button type="primary" @click="prepositionSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
   

</template>

<script>
    import customElTable from '@/components/customElTable';
    import { Message } from 'element-ui';
    import Order from '@/api/fightGroup/order';
    import { getAuthType } from '@/utils/auth';
    export default {
      components: {
        customElTable
      },
      data() {
        return {
          prepositionShow: false,
          preposition: {
            companay: '',
            id: ''
          },
          order_goods_info: {},
          order_info: {},
          express_info: {},
          process: [
            {
              name: '买家下单',
              time: ''
            },
            {
              name: '买家付款',
              time: ''
            },
            {
              name: '商家发货',
              time: ''
            },
            {
              name: '交易完成',
              time: ''
            }
          ],
          number: 4,
          tableOptions: [
            {
              label: '商品编号',
              prop: 'id',
              width: 100
            },
            {
              label: '商品',
              prop: `html`,
              options: {
                type: 'html'
              },
              width: 500
            },
            {
              label: '单价（元）',
              prop: 'price'
            },
            {
              label: '数量',
              prop: 'num'
            },
            {
              label: '合计（元）',
              prop: 'totle_price'
            },
            {
              label: '商品状态',
              prop: 'status'
            },
            {
              label: '交易状态',
              prop: 'pay_statue'
            }
          ],
          tableData: [],
          companayList: []
        };
      },
      created() {
        this.getData();
        this.getExpress();
      },
      methods: {
        getData() {
          (getAuthType() ? Order.supplierDetail({id: this.$route.params.id}) : Order.detail({id: this.$route.params.id}))
            .then(data => {
              console.log(data);
              this.order_goods_info = data.order_goods_info;
              this.order_info = data.order_info;
              this.express_info = data.express_info;
              this.express_info.status_text = this.getExpressState(data.express_info.state);
              this.setTiem(data.order_info);
              this.setProducts(data);
              this.setExpress(data.express_info);
              this.tabLoading = false;
            }).catch(() => {
              this.tabLoading = false;
            });
        },
        getExpressState(state = 0) {
          let text = '';
          switch (state) {
            case -2: text = '未知'; break;
            case -1: text = '单号或代码错误'; break;
            case 0: text = '暂无轨迹'; break;
            case 1: text = '快递收件'; break;
            case 2: text = '在途中'; break;
            case 3: text = '派件'; break;
            case 4: text = '签收'; break;
            case 5: text = '问题件'; break;
            case 6: text = '疑难件'; break;
            case 7: text = '退回'; break;
            case 8: text = '退件签收'; break;
            case 9: text = '快递收件（揽件）'; break;
            case 10: text = '转投'; break;
          }
          return text;
        },
        getExpress() {
          (getAuthType() ? Order.supplierExpress({}) : Order.express({}))
            .then(data => {
              console.log(data);
              this.companayList = data;
            }).catch(() => {
            });
        },
        setTiem(data) {
          this.process[0].time = data.create_time;
          this.process[1].time = data.pay_time;
          this.process[2].time = data.express_time;
          this.process[3].time = data.finish_time;
        },
        setProducts(data) {
          var tableDataNew = [];
          for (var item of data.order_goods_info) {
            var parm = {
              id: item.id,
              html: `<div class="goods-info" style="display: flex;justify-content: flex-start;margin: 0 15px;">
                          <div class="img"><img width="144" height="120" src="${item.pic && item.pic[0].file_path}" /></div>
                          <div class="content" style="margin-left: 20px;display: flex;flex-direction: column;align-items: self-start;">
                            <p class="name" style="text-align: left">${item.goods_name}</p>
                            <span style="font-size:13px;color:'#999'">${item.goods_attr && item.goods_attr.attr_name1 ? (item.goods_attr.attr_name1 + ': ' + item.goods_attr.attr_value1) : ''}</span>
                            <span style="font-size:13px;color:'#999'">${item.goods_attr && item.goods_attr.attr_name2 ? (item.goods_attr.attr_name2 + ': ' + item.goods_attr.attr_value2) : ''}</span>
                            <span style="font-size:13px;color:'#999'">${item.goods_attr && item.goods_attr.attr_name3 ? (item.goods_attr.attr_name3 + ': ' + item.goods_attr.attr_value3) : ''}</span>
                          </div>
                        <div>`,
              price: item.price,
              num: item.num,
              totle_price: item.total_money,
              status: item.goods_status.sell_status_name,
              pay_statue: data.order_info.status_cn.status_name
            };
            tableDataNew.push(parm);
          }
          this.tableData = tableDataNew;
        },
        setExpress(data) {
          this.preposition = {
            companay: data.com,
            id: data.nu
          };
        },
        renewbindHandler() {
          this.prepositionShow = true;
        },
        prepositionSave() {
          console.log(this.preposition);
          if (!this.preposition.companay) {
            Message({
              message: '请选择物流公司',
              type: 'error',
              duration: 3000
            });
            return;
          }
          if (!this.preposition.id) {
            alert('请填写物流单号');
            return;
          }
          var params = {
            order_id: this.order_info.id,
            express_company: this.preposition.companay,
            express_number: this.preposition.id
          };
          console.log(params);
          (getAuthType() ? Order.addSupplierExpress(params) : Order.addExpress(params))
            .then(() => {
              Message({
                message: '修改成功',
                type: 'success',
                duration: 3000
              });
              this.getData();
            });
          this.prepositionShow = false;
        }
      }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .card{
    flex:1
  }
  .text {
    font-size: 14px;
  }

  .item {
    padding: 5px 0;

  }
  .span{
     display: inline-block;
     min-width: 120px;
     text-align: right;
  }
  .right-line{
  
    border-right:1px solid rgb(0,0,0);
    padding: 20px
  }
  .item-border{
    border:1px solid red;
    margin-left: 20px;
    padding: 20px
  
  }
  .icon{
    font-size: 24px
  }
  .icon-sure{
    font-size: 24px;
    color: green
  }
  .row{
    display: flex;
    flex-direction: row 
  }
  .process{
    display: flex;
    flex-direction: column; 
    align-items: center
  }
  .line{
    height: 2px;
    background-color: black;
    flex: 1
  }
  .end{
    display: flex;
    flex-direction:row;
    justify-content: flex-end;
  }
  .infinite-list{
    height: 100px
  }
  .process_c{
    overflow:auto;
    height:160px;
  }
</style>
