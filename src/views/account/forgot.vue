<template>
  <div class="account-form">
    <div class="title">重置密码</div>
    <el-form
      ref="resetForm"
      :rules="rules"
      :model="resetForm"
      hide-required-asterisk
    >
      <el-form-item label="" prop="phone">
        <el-input
          v-model="resetForm.phone"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item label="" prop="verificationCode">
        <el-input
          v-model="resetForm.verificationCode"
          placeholder="请输入验证码"
        >
          <el-button slot="append">发送验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="" prop="newPassword">
        <el-input
          v-model="resetForm.newPassword"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="" prop="confirmPassword">
        <el-input
          v-model="resetForm.confirmPassword"
          placeholder="请再次输入密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <div class="submit-btn">
      <el-button type="warning" @click="onSubmit('resetForm')">确定</el-button>
    </div>
    <div class="account">
      <router-link to="/login">返回登录</router-link>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      resetForm: {},
      rules: {
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }
        ],
        verificationCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      },
      fileList: []
    }
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$request.post('forgot', this.resetForm).then((res) => {
            this.$router.push('/login')
            this.$message.success('成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
