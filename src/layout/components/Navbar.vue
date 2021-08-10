<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar :size="40" :src="avatar">
            <i class="el-icon-user-solid" style="font-size: 36px" />
          </el-avatar>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            {{ name }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="dialogVisible = true">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="400px">
      <el-input
        v-model="oldPassword"
        placeholder="请输入旧密码"
        show-password
      />
      <el-input
        v-model="newPassword"
        style="margin: 24px 0"
        placeholder="请输入新密码"
        show-password
      />
      <el-input
        v-model="confirmPassword"
        placeholder="请再次输入新密码"
        show-password
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialogVisible: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    confirm() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.$message.error('请填写所有密码')
        return
      }

      if (this.oldPassword === this.newPassword) {
        this.$message.error('旧密码和新密码一样！')
        return
      }

      if (this.newPassword !== this.confirmPassword) {
        this.$message.error('新密码不一致！')
        return
      }

      this.$request
        .put('/api/user/change-password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        })
        .then((res) => {
          this.dialogVisible = false
          this.oldPassword = ''
          this.newPassword = ''
          this.confirmPassword = ''
          this.$message.success('密码修改成功！')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

::v-deep .el-dropdown-menu__item {
  text-align: center;
}
</style>
