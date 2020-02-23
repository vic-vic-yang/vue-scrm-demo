<template>
  <div class="app-container" v-loading="pageLoading">
    <el-form
      :model="gameNameFrm"
      :rules="frmRules"
      ref="gameNameFrm"
      label-width="80px">
      <el-form-item prop="name" label="称号名称">
        <el-input
          v-model="gameNameFrm.name"
          name="name"
          :clearable="true"
          placeholder="请输入称号名称">
        </el-input>
      </el-form-item>
      <el-form-item prop="desc" label="称号描述">
        <el-input
          v-model="gameNameFrm.desc"
          type="textarea"
          :rows="3"
          name="desc"
          placeholder="请输入称号描述">
        </el-input>
      </el-form-item>
      <el-form-item label="得分比">
        <el-input-number
          v-model="gameNameFrm.startPercent"
          :min="0"
          :max="99"
          name="startPercent">
        </el-input-number>
        <span>%</span>
        <span>-</span>
        <el-input-number
          v-model="gameNameFrm.endPercent"
          :min="(gameNameFrm.startPercent + 1)"
          :max="100"
          name="endPercent">
        </el-input-number>
        <span>%</span>
      </el-form-item>
      <el-form-item prop="imageUrl" label="称号配图">
        <upload-prize-avatar v-model="gameNameFrm.imageUrl"></upload-prize-avatar>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent.stop="save">保存</el-button>
        <el-button @click.prevent.stop="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Game from '@/api/answer/game';
  import uploadPrizeAvatar from '@/components/Upload/singleImage';

  export default {
    name: 'gameEditor',
    components: {
      uploadPrizeAvatar
    },
    data() {
      return {
        gameId: this.$route.params.gameId,
        nameId: this.$route.params.id,
        action: this.$route.params.id ? 'modify' : 'add',
        gameNameFrm: {
          name: '',
          desc: '',
          startPercent: 20,
          endPercent: 40,
          imageUrl: ''
        },
        frmRules: {
          name: [
            {
              required: true, message: '比赛名称必填'
            }
          ],
          imageUrl: [
            {
              required: true, message: '请上传称号配图'
            }
          ],
          desc: [
            {
              required: true, message: '请输入称号描述'
            }
          ]
        },
        pageLoading: true
      };
    },
    watch: {
      'gameNameFrm.startPercent': {
        handler(val) {
          if (this.gameNameFrm.endPercent < val) {
            this.$set(this.gameNameFrm, 'endPercent', val + 1);
          }
        }
      }
    },
    created() {
      this.getData()
        .then(() => {
          this.pageLoading = false;
        })
        .catch(() => {
          this.pageLoading = false;
        });
    },
    methods: {
      getData() {
        if (!this.gameId || !this.nameId) return Promise.resolve();
        return Game.name.get(this.gameId, this.nameId).then(res => {
          this.gameNameFrm = res;
          return res;
        });
      },
      save() {
        this.$refs.gameNameFrm.validate(valid => {
          if (valid) {
            (this.action === 'modify'
              ? Game.name.edit(this.gameId, this.nameId, this.gameNameFrm)
              : Game.name.add(this.gameId, this.gameNameFrm)).then(() => {
              this.$router.back();
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
