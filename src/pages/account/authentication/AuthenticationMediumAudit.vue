<template>
  <div class="bh-root">
    <p style="text-align: center;font-size: 48px;color: #FF7C44;">{{cause}}</p>
    <p style="text-align: center;font-size: 48px;color: #FF7C44;cursor: pointer;" v-if="!/人工审核中/.test(cause)" @click="commit">点这里！重新审核</p>
  </div>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    cause () {
      const level = Number(this.user.identityAuthenticator)
      switch (level) {
        case 2:
          return '人工审核中'
        case 2.1:
          return '审核失败-_-!  原因:不是手持证件照'
        case 2.2:
          return '审核失败-_-!  原因:图片不清晰'
        case 2.3:
          return '审核失败-_-!  原因:不是本人'
        case 2.4:
          return this.user.identityAuthenticationFailedReason
      }
    }
  },
  methods: {
    commit () {
      this.$store.commit('setUser', {
        identityAuthenticator: 1
      })
    }
  }
}
</script>

<style scoped>
</style>
