<template>
  <div class="account-form">
    <div class="title">账号注册</div>
    <el-form
      ref="registerForm"
      :rules="rules"
      :model="registerForm"
      hide-required-asterisk
    >
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="registerForm.phone" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item prop="verificationCode">
        <el-input
          v-model="registerForm.verificationCode"
          placeholder="请输入验证码"
        >
          <el-button slot="append">发送验证码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="agreement">
        <el-checkbox v-model="registerForm.agreement" />
        <router-link target="_blank" to="/agreement" style="margin-left: 10px">
          <el-button type="text">已阅读并同意：用户协议</el-button>
        </router-link>
      </el-form-item>
    </el-form>
    <div class="submit-btn">
      <el-button type="warning" @click="onSubmit('registerForm')">
        确定
      </el-button>
      <el-button type="success" @click="onSubmit('registerForm')">
        微信一键注册
      </el-button>
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
      registerForm: {},
      rules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }
        ],
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
                callback(new Error('请输入新密码'))
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
          this.$api.post('mobile-register', this.registerForm).then((res) => {
            this.$router.push('/login')
            this.$message.success('成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>
<style lang="scss" scoped>
.submit-btn {
  display: flex;
}
</style>
