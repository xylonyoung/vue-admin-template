<template>
  <div class="account-container">
    <div class="top">
      <el-image
        :src="require('@/assets/logo.svg')"
        fit="contain"
        @click="$router.push('/')"
      />
      <!-- <div v-if="token">
        <el-button type="danger" @click="$router.push('/dashboard')">进入管理平台</el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click="$router.push('/login')">
          登录
        </el-button>
        <el-button type="success" @click="$router.push('/register')">
          注册
        </el-button>
      </div> -->
    </div>

    <transition name="slide" mode="out-in">
      <router-view :key="key" />
    </transition>

    <div class="center-img">
      <video v-if="background === 'video'" autoplay muted :src="centerVideo" />
      <el-image v-else :src="centerImg" fit="contain" />
    </div>

    <div class="footer">Copyright © 2048 Banana Inc. All rights reserved.</div>

    <snow />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Snow from './snow.vue'
export default {
  components: { Snow },
  data() {
    return {
      background: 'video',
      centerImg:
        'https://www.apple.com/v/iphone-12/e/images/overview/hero/hero_endframe__fc7apyu3c7au_large.jpg',
      centerVideo:
        'https://www.apple.com/105/media/us/iphone-12/2020/7f5b7de7-9f8c-41eb-bf3b-f294773108e6/anim/hero/large.mp4'
    }
  },
  computed: {
    ...mapGetters(['token']),
    key() {
      return this.$route.path
    }
  }
}
</script>
<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}
.slide-enter {
  opacity: 0;
  transform: translateY(-50%);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(50%);
}

.account-container {
  position: relative;
  min-height: 100vh;
  .mobile {
    margin: 0;
    width: calc(100% - 60px);
  }
}
.top {
  padding: 0 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  margin: 0 auto;
  .el-image {
    width: 90px;
  }
}

.center-img {
  width: 100%;
  height: calc(100vh - 290px);
  top: 100px;
  background-color: #f1eff1;
  video {
    height: 100%;
  }
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 50px;
  color: #fff;
  // background-color: #151515;
}

::v-deep .account-form {
  position: absolute;
  top: 100px;
  right: 20%;
  padding: 30px;
  width: 300px;
  background-color: #fff;
  z-index: 9;
  .title {
    padding-bottom: 30px;
    text-align: center;
    font-size: 24px;
    color: #f56600;
  }
  .submit-btn {
    width: 100%;
    // padding: 20px 0;
    .el-button {
      width: 100%;
    }
  }
  .account {
    display: flex;
    justify-content: center;
    color: #999;
    a + a {
      position: relative;
      margin-left: 20px;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 16px;
        border-left: 2px solid#999;
        transform: translate(-10px, 0);
      }
    }
  }
}
</style>
