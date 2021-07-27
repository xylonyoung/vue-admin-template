<template>
  <div class="account-form">
    <div class="title">账号登录</div>
    <el-form
      ref="loginForm"
      :rules="rules"
      :model="loginForm"
      hide-required-asterisk
      @keyup.enter.native="onSubmit('loginForm')"
    >
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="role">
          <el-radio
            v-for="(item, index) in roles"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="submit-btn">
      <el-button type="warning" @click="onSubmit('loginForm')">确定</el-button>
    </div>
    <!-- <div class="account">
      <router-link to="/register">立即注册</router-link>
      <router-link to="/forgot">忘记密码？</router-link>
    </div> -->
  </div>
</template>
<script>
import { setRole } from '@/utils/auth'
import { roles, defaultLoginRole } from '@/config'

export default {
  data() {
    return {
      loginForm: {},
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
        ]
      },
      role: defaultLoginRole,
      roles,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              setRole(this.role)
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
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
