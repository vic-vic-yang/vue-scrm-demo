<template>
  <div class="item-card-container">
    <div class="item-card">
      <div class="cover" v-if="cover">
        <el-image
          style="width: 100%;height: 100%"
          fit="cover"
          :src="cover || taskItem.pic[0].file_path"
        ></el-image>
      </div>
      <div class="info">
        <div class="name">{{name || taskItem.name}}</div>
        <div v-if="type === 'prize'" class="prize">
          <div class="desc">价值：{{taskItem.worth}}</div>
          <div class="desc">库存：{{taskItem.store}}</div>
        </div>
        <div v-if="type === 'task'" class="task">
          <div class="desc">{{taskItem.prize_info.name}}</div>
        </div>
      </div>
    </div>
    <div class="mask">
      <div class="options">
        <el-button type="primary" icon="el-icon-edit" circle @click="edit"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle @click="del"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'item-card',
    props: {
      cover: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'prize'
      },
      index: {
        type: Number,
        default: ''
      },
      taskItem: {
        type: Object,
        default: {}
      }
    },
    methods: {
      edit() {
        this.$emit('editHandler', this.taskItem);
      },
      del() {
        this.$emit('delHandler', this.index);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .item-card-container{
    position: relative;
    cursor: pointer;

    .item-card{
      width: 200px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      align-items: center;
    }

    .info{
      max-width: 120px;
      height: 80px;
      display: flex;
      flex-direction: column;;
      justify-content: space-between;
    }

    .cover{
      width: 80px;
      height: 80px;
      background: #ddd;
      display: flex;;
      justify-content: center;
      align-items: center;
    }

    .name{
      font-size: 14px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-height: 18px;
      margin-top: 5px;
    }

    .prize{
      margin-bottom: 3px;
    }

    .task{
      margin-bottom: 10px;
    }

    .desc{
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;
      padding: 0 10px 0;
      line-height: 16px;
    }

    &:hover .mask{
      display: block;
    }
  }

  .mask{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    display: none;
    border-radius: 5px;
    overflow: hidden;
  }

  .options {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    button:first-child {
      margin-right: 30px;
    }

    button:last-child {
      margin-left: 30px;
    }
  }
</style>
