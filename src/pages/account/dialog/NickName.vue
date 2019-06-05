<template>
  <div class="" >
    <!--弹窗记录查看-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :width="400">
      <div slot="body">
        <p>
          <span class="ft18">设置昵称</span>
        </p>
        <div>
          <input v-model="nickName" maxlength="8"/>
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
    },
    nickname: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      nickName: '',
      loading: false,
      nicknameTestResult: false
    }
  },
  computed: {
    disabled () {
      return this.nickname === this.nickName ||
        this.loading ||
        !this.nicknameTestResult
    }
  },
  watch: {
    nickName (value) {
      this.nicknameTestResult = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)
      this.nickName = this.nicknameTestResult ? value : this.nickName
    }
  },
  methods: {
    commit () {
      this.loading = false
      this.$store.dispatch('encryptConnection', {
        url: '/userinfo/changeNicknameUI',
        data: {
          nickname: this.nickName
        }
      }).then(response => {
        this.$store.commit('setUser', {nickname: this.nickName})
        this.$message.success('设置成功')
        this.loading = false
        this.$emit('update:visible', false)
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
  },
  created () {
    this.nickName = this.nickname
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
