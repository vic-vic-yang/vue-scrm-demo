<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 14:20:38
 * @LastEditTime: 2019-12-06 19:30:54
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="custom-el__table">
    <el-table border
              :data="tableData"
              ref="customTable"
              style="width: 100%"
              @cell-click="cellClickHandler"
              :height="height"
              :max-height="maxHeight"
              @select="handleSelect"
              @select-all="handleSelectAll"
              @selection-change="handleSelectionChange">
      <slot>
        <el-table-column v-if="ifmultipleSelection"
                         type="selection"
                         width="55">
        </el-table-column>
        <template v-for="(column,index) in tableOptions">
          <el-table-column v-if="column.prop==='USER_ACTION'&&column.actions&&column.actions.length"
                           :key="index"
                           :formatter="column.formatter"
                           :label="column.label || '操作'"
                           :type="column.type || ''"
                           :align="column.align || 'center'"
                           :width="column.width || getActionColumnWidth(column.actions)">
            <template slot-scope="scope">
              <div class="some-flex">
                <template v-for="(action,index) in column.actions">
                  <template v-if="action.type === 'select'">
                    <el-select :key="index" v-model="scope.row.pattern" @change="handleSelectChange(scope.row)" placeholder="请选择">
                      <el-option
                        v-for="item in action.arr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else-if="action.type === 'MORE'">
                    <el-dropdown :key="index"
                                style="margin-left:10px">
                      <el-button size="mini"
                                class="small-padding fixed-width">
                        {{action.label}}</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in action.operations"
                                          :key="index"
                                          :command="item.prop ? scope.row[item.prop] : item">
                          <el-button style="margin-top: 10px" :operate="item.operate" @click.stop="handleCommand(item.prop ? item.prop : item,scope.row)">
                            {{item.prop ? scope.row[item.prop] : item}}
                          </el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <template v-else-if="action.type === 'MORENEW'">
                    <el-dropdown :key="index" v-if="actionBtnShow(action,scope.row)"
                                :operate="actionOperate(action,scope.row)"
                                style="margin-right:10px">
                      <el-button size="mini"
                                :disabled="actionDsb(action,scope.row)"
                                :type="getActionBtnType(action,scope.row)"
                                class="small-padding fixed-width">
                        {{actionLabel(action, scope.row)}}</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in actionOpt(action, scope.row)"
                                          :key="index"
                                          :command="item.prop ? scope.row[item.prop] : item">
                          <div @click.stop="handleCommand(item.prop ? item.prop : item,scope.row)">
                            {{item.prop ? scope.row[item.prop] : item}}
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <template v-else-if="action.type === 'checkbox'">
                    <el-checkbox
                      :key="index"
                      v-model="scope.row.checked"
                      :label="column.label"
                      @change="actionHandler(action,scope.row)"></el-checkbox>
                  </template>
                  <template v-else-if="action.actionType === 'select'">
                    <el-select :style="returnStyle(action.width)" :key="index" v-if="action.actionType === 'select'" v-model="scope.row.status" placeholder="请选择"
                      size="mini"
                      @change="handleSelectChange2(scope.row)"
                    >
                      <el-option
                        v-for="item in action.labels"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else>
                    <el-button
                      :operate="actionOperate(action,scope.row)"
                      v-if="actionBtnShow(action,scope.row)"
                              :key="index"
                              :type="getActionBtnType(action,scope.row)"
                              :disabled="actionDsb(action,scope.row)"
                              size="mini"
                              class="small-padding fixed-width"
                              @click.stop="actionHandler(action,scope.row)">
                      {{actionLabel(action, scope.row)}}
                    </el-button>
                  </template>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column :key="index" v-else-if="column.prop === 'SELECTION'"
                           type="selection"
                           width="55">
          </el-table-column>
          <!-- <el-table-column :key="index" v-else-if="column.prop === 'weights'"
                           :label="column.label"
                           :prop="column.prop"
                           :type="column.type || ''"
                           :align="column.align || 'center'">

          </el-table-column> -->
          <template v-else>
            <el-table-column :key="index"
                             :label="column.label"
                             :prop="column.prop"
                             :formatter="column.formatter"
                             :type="column.type || ''"
                             :align="column.align || 'center'"
                             :width="column.width || 'auto'"
                             :sortable="!!column.sortable">
              <template slot-scope="scope">
                <template v-if="column.options &&column.options.type==='tag'">
                  <el-tag :type="scope.row.tag_type || tagTypeHandler(column, scope.row)">
                    {{scope.row[column.prop]}}
                  </el-tag>
                </template>
                <template v-else-if="column.editAble && column.showInput && clickIndex === scope.$index">
                  <el-input v-model="scope.row[column.prop]" :max="column.max || 100" :type="column.type" size="mini" @blur="blurInput(scope)" autofocus ref="input"></el-input>
                </template>
                <template v-else-if="column.options &&column.options.type==='html'">
                  <div v-html="scope.row[column.prop]"></div>
                </template>
                <template v-else-if="column.options &&column.options.type==='img'">
                  <!--<div :style="{width: (column.options.width || 100) + 'px', height: (column.options.height || 100) + 'px'}" class="img-style">-->
                  <el-image
                    :style="{width: (column.options.width || 100) + 'px', height: (column.options.height || 100) + 'px'}"
                    :src="scope.row[column.prop]"
                    :preview-src-list="srcListHandler(scope.row[column.prop])">
                  </el-image>
                  <!--</div>-->
                </template>
                <template v-else-if="column.options &&column.options.type==='edit'">
                  <span>{{scope.row[column.prop]}}</span>
                  <el-popover
                    placement="bottom"
                    :title="column.label"
                    width="200"
                    v-model="scope.row.visible"
                    trigger="manual">
                    <i slot="reference" :ref="'iconEdit' + scope.row.id" @click="editShowHandler(scope.row[column.prop], scope.row)" class="el-icon-edit"></i>
                    <div class="form-group">
                      <el-input v-model="edit_text" :min="0" :max="column.max || 100" :placeholder="'请输入' + column.label"/>
                      <el-button size="mini" @click="setPopoverVisible(scope.row, false)" style="float: right;margin: 10px 0 0 0;">取消</el-button>
                      <el-button size="mini" type="primary" @click="editTdHandler(scope, column, scope.row[column.prop])" style="float: right;margin: 10px 10px 0 0;">确定</el-button>
                    </div>
                  </el-popover>
                </template>
                <template v-else>
                  <p :class="[column.className,'m-0']">{{scope.row[column.prop]}}</p>
                </template>
              </template>
            </el-table-column>
          </template>
        </template>
      </slot>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination v-if="pagination && total> 0"
                     background
                     @size-change="sizeChangeHandler"
                     @current-change="pageChangeHandler"
                     :current-page.sync="currentPage"
                     :page-sizes="pageSizes"
                     :page-size="size"
                     :layout="customLayout"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
const defaultBtnLabel = {
  edit: '编辑',
  del: '删除',
  pass: '通过',
  reject: '拒绝',
  forbid: '禁用'
};
const defaultBtnOp = {
  edit: 'update',
  del: 'delete',
  pass: 'update',
  reject: 'update',
  forbid: 'update'
};

export default {
  name: 'customElTable',
  data: function() {
    return {
      autofocus: true,
      clickIndex: 0,
      edit_text: '',
      visible: false
    };
  },
  props: {
    value: {
      type: Number,
      default: 1
    },
    tableOptions: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number
    },
    pageSizes: {
      type: Array,
      default: () => [20, 50, 100]
    },
    size: {
      type: Number,
      default: 20
    },
    layout: {
      type: String
    },
    height: {
      type: [String, Number]
    },
    maxHeight: {
      type: [String, Number]
    },
    ifmultipleSelection: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    customLayout() {
      if (this.layout) return this.layout;
      const defaultLayout = 'total,prev,pager,next,jumper';
      if (this.pageSizes && this.pageSizes.length > 0) return 'total,sizes,prev,pager,next,jumper';
      return defaultLayout;
    },
    currentPage: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      }
    }
  },
  methods: {
    editTdHandler(scope, column, prop) {
      if (column.max && this.edit_text > column.max) {
        this.$message({
          type: 'error',
          message: `最大只能输入${column.max}`
        });
        return;
      }
      if (this.edit_text === prop) {
        this.$message({
          type: 'info',
          message: `未改变`
        });
        return;
      }
      this.setPopoverVisible(scope.row, false);
      this.$emit('popoverHandler', scope, this.edit_text);
    },
    editShowHandler(data, row) {
      this.tableData.map(item => {
        var ref = 'iconEdit' + item.id;
        this.$refs[ref][0].style.opacity = 0;
      });
      this.setPopoverVisible(row, true);
      this.edit_text = data;
    },
    setPopoverVisible(row, status) {
      var ref = 'iconEdit' + row.id;
      this.tableData.map(item => {
        item.visible = false;
        var condition = this.$route.path === '/taskCenter/task/list' ? item.id === row.id && row.target === item.target : item.id === row.id;
        if (condition) {
          item.visible = status;
          if (status) {
            this.$refs[ref][0].style.opacity = 1;
          } else {
            this.$refs[ref][0].style.opacity = 0;
          }
        }
      });
    },
    srcListHandler(data) {
      var arr = [];
      arr.push(data);
      return arr;
    },
    returnStyle(width) {
      return 'margin: 0 10px;width:' + width + 'px;';
    },
    handleSelectChange2(row) {
      this.$emit('handleSelectChange2', row);
    },
    handleSelectChange(row) {
      this.$emit('handleSelectChange', row);
    },
    sizeChangeHandler(size) {
      this.$emit('size-change', size);
    },
    pageChangeHandler(page) {
      this.currentPage = page;
      this.$emit('page-change', page);
    },
    actionHandler(action, scope) {
      const actionType = this.getActionType(action);
      switch (actionType) {
        case 'edit':
          return this.$emit('edit', scope);
        case 'editor':
          return this.$emit('edit', scope);
        case 'del':
          return this.$emit('delete', scope);
        case 'delete':
          return this.$emit('delete', scope);
        case 'pass':
          return this.$emit('pass', scope);
        case 'reject':
          return this.$emit('reject', scope);
        default:
          this.$emit('action', actionType, scope);
      }
    },
    getActionType(action) {
      return typeof action === 'object' ? action.type : action;
    },
    getActionBtnType(action, scope) {
      if (typeof action === 'object') {
        if (typeof action.options === 'function') {
          const actionOptions = action.options(scope);
          return actionOptions ? actionOptions.btn : false;
        } else if (action.btn) {
          return action.btn;
        }
      }
      const type = typeof action === 'object' ? action.type : action;
      return ({
        edit: 'primary',
        del: 'danger'
      })[type] || 'default';
    },
    actionBtnShow(action, scope) {
      if (this.getActionBtnType(action, scope)) {
        if (typeof action === 'object') {
          if (typeof action.showBtn === 'function') return action.showBtn(action, scope);
          if (typeof action.showBtn === 'boolean') return action.showBtn;
        }
        return true;
      }
      return false;
    },
    actionDsb(action, scope) {
      // 报名活动编辑按钮才可点击
      if (action.itemOnly && scope.type !== 1) {
        return true;
      }
      if (scope.status === '1' && action === 'pass') { // 通过
        return true;
      }
      if (scope.status === '2' && action === 'reject') { // 不通过
        return true;
      }
      if (typeof action === 'object') {
        if (typeof action.disableds === 'function') return action.disableds(scope);
        if (typeof action.disableds === 'boolean') return action.disableds;
      }
      return false;
    },
    actionMoreDsb(action, scope) {
      // 报名活动编辑按钮才可点击
      if (!action.label) {
        return false;
      }
      return true;
    },
    getActionColumnWidth(actions) {
      let len = 0;
      const actionLen = actions.length;
      for (let i = 0; i < actionLen; i++) {
        len += this.actionLabel(actions[i]).length;
      }
      return len * 18 + actionLen * 22 + (actionLen + 1) * 10;
    },
    actionLabel(action, item) {
      if (typeof action === 'object') {
        if (typeof action.options === 'function') action = action.options(item);
        return action.label;
      }
      return defaultBtnLabel[action];
    },
    actionOpt(action, item) {
      if (typeof action === 'object') {
        if (typeof action.options === 'function') action = action.options(item);
        return action.opt;
      }
      return [];
    },
    actionOperate(action, item) {
      if (typeof action === 'object') {
        if (action.operate) {
          return action.operate;
        }
        if (typeof action.options === 'function') {
          action = action.options(item);
        }
        return action.operate;
      }
      return defaultBtnOp[action] || '';
    },
    cellClickHandler(row, column, cell) {
      if (row.itemIndex) { // 活动中心--存在相同id的情况，通过下标区分
        this.clickIndex = this.tableData.findIndex(obj => {
          return obj.itemIndex === row.itemIndex;
        });
      } else {
        this.clickIndex = this.tableData.findIndex(obj => {
          return obj.id === row.id;
        });
      }
      this.$emit('cell-click', this.clickIndex, column.property);
      this.$nextTick(() => {
        if (this.$refs.input && this.$refs.input[0]) {
          this.$refs.input[0].focus();
        }
      });
    },
    handleSelect(selection, row) {
      // 选中时触发，会返回对应的行
      this.$emit('handleSelect', row);
    },
    handleSelectionChange(data) {
      // 选择项发生变化时会触发，返回所有选中行
      this.$emit('handleSelectionChange', data);
    },
    handleCommand(action, scope) {
      this.$emit('more', action, scope);
    },
    blurInput(scope) {
      this.$emit('blurInput', scope, this.$refs.input[0].value);
    },
    tagTypeHandler(column, row) {
      if (column.options.propValues) {
        return column.options.propValues[row[column.options.prop] + ''];
      }
      const typesArr = ['danger', 'success', 'info', 'warning', ''];
      return column.options.prop ? typesArr[row[column.options.prop] * 1] : typesArr[2];
    },
    handleSelectAll(selection) {
      this.$emit('handleSelectAll', selection);
    }
  }
};
</script>

<style scoped>
.pagination-wrapper {
  margin: 20px 0;
}

.small-padding {
  padding: 7px 10px !important;
}

.some-flex{
  display: flex;
  justify-content: center;
}

.img-style{
  display: flex;;
  justify-content: center;
  align-items: center;
  background: #ddd;
  margin: 0 auto;
  padding: 0 10px;
}

.el-icon-edit{
  opacity: 0;
}

.el-icon-edit:hover{
  cursor: pointer;
}

.el-table__row:hover .el-icon-edit{
  opacity: 1 !important;
}

</style>
