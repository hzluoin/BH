<template>
  <div class="" >
    <!--弹窗记录查看-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :width="400">
      <div slot="body">
        <p>
          <span class="ft18">请输入邀请码</span>
        </p>
        <div>
          <input v-model="nickName" maxlength="30"/>
        </div>
        <div>
          <button class="bh-btn_primary_lg" @click="commit" :disabled="disabled">
            <i class="el-icon-loading" v-if="loading"></i>
            <span v-else>确定</span>
          </button>
        </div>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
export default {
  components: {
    BhDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      nickName: '',
      loading: false
    }
  },
  computed: {
    disabled () {
      return !(this.nickName && !this.loading && this.$store.getters.getUser.inviteeCode && this.nickName !== this.$store.getters.getUser.inviteeCode)
    }
  },
  methods: {
    commit () {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/inviterCode/addInvRecordUI',
        data: {
          invterCode: this.nickName
        }
      }).then(response => {
        this.$message.success('设置成功')
        this.loading = false
        this.$emit('update:visible', false)
        this.$store.dispatch('qryUserInfo').then(response => {}, response => {})
      }, response => {
        this.loading = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  p {
    text-align: center;
  }

  input {
    height: 34px;
  }

  button {
    margin-top: 30px;
    width: 100%;
  }
</style>
