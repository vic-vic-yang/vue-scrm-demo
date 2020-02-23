import Api from '../index';
import { Message } from 'element-ui';

export const PrizeTemplate = {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * */
    return Api.get('/v1/prizeManage/prize-template/get-list', {
      params
    })
      .then(res => res.data);
  },
  get(id) {
    /**
     * @id {string|number} - 奖品模板id
     * */
    return Api.get('/v1/prizeManage/prize-template/get-template', {
      params: {
        id: id
      }
    })
      .then(res => res.data);
  },
  operation(params) {
    /**
     * @params {object} - {id,prize_type,name,avatar,info,price,deliver_type,status}
     * @id  奖品ID，0-新增，其他-编辑
     * @prize_type  奖品类型：1-实物，2-微信红包
     * @name  奖品名称
     * @avatar  封面图地址，请使用api上传后提交链接
     * @info  奖品介绍
     * @price  奖品价值（元）
     * @deliver_type  兑奖方式：1-快递物流，2-线下兑奖
     * @status  状态：0-停用，1-停用
     * */
    return Api.post('/v1/prizeManage/prize-template/add', params)
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: res.message || '操作失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: params.id === 0 ? '添加成功' : '修改成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  del(id) {
    /**
     * @id {string|number} - 奖品模板id
     * */
    return Api.delete('/v1/prizeManage/prize-template/delete', {
      data: { id: id }
    })
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: '删除失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: '删除成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  selectList(prizeType) {
    /**
     * @prizeType {string|number} 奖品类型，1-实物，2-微信红包
     * */
    return Api.get('/v1/prizeManage/prize-template/get-template-select-list', {
      params: {
        prizeType: prizeType
      }
    })
      .then(res => res.data);
  }
};

export const PrizeInventory = {
  list(params) {
    /**
     * @params {Object} - {pageIndex,pageSize,status}
     * @pageIndex {number} 页码
     * @pageSize {number} 列表长度，默认30
     * */
    return Api.get('/v1/prizeManage/prize-inventory/get-list', {
      params
    })
      .then(res => res.data);
  },
  get(id) {
    /**
     * @id {string|number} - 奖品库存id
     * */
    return Api.get('/v1/prizeManage/prize-inventory/get-inventory', {
      params: {
        id: id
      }
    })
      .then(res => res.data);
  },
  operation(params) {
    /**
     * @params {object} - {id,prize_type,name,avatar,info,price,deliver_type,status}
     * @id  奖品ID，0-新增，其他-编辑
     * @prize_type  奖品类型：1-实物，2-微信红包
     * @prize_template_id  奖品模板
     * @name  奖品名称
     * @avatar  封面图地址，请使用api上传后提交链接
     * @info  奖品介绍
     * @price  奖品价值（元）
     * @deliver_type  兑奖方式：1-快递物流，2-线下兑奖
     * @status  状态：0-停用，1-停用
     * */
    return Api.post('/v1/prizeManage/prize-inventory/add', params)
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: res.message || '操作失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: params.id === 0 ? '添加成功' : '修改成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  },
  del(id) {
    /**
     * @id {string|number} - 奖品库存id
     * */
    return Api.delete('/v1/prizeManage/prize-inventory/delete', {
      data: { id: id }
    })
      .then(res => {
        if (res.data.success !== true) {
          Message({
            message: '删除失败',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(res);
        }
        Message({
          message: '删除成功',
          type: 'success',
          duration: 3000
        });
        return res;
      });
  }
};
