<template>
  <div class="transition-container">
    <el-button
      v-if="reviewData.id"
      size="small"
      :type="btnColor"
      @click="showDialog"
    >
      {{ btnName }}
    </el-button>
    <el-button
      v-if="multiple"
      type="success"
      icon="el-icon-edit"
      :disabled="selected.length === 0"
      @click="showDialog"
    >
      批量审核
    </el-button>
    <el-dialog
      :title="btnName"
      :visible.sync="dialogVisible"
      append-to-body
      width="800px"
    >
      <el-collapse v-if="!multiple" v-model="activeNames">
        <el-collapse-item title="查看历史记录" name="history">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in reviewData.transitionContexts"
              :key="index"
              :timestamp="parseTime(new Date(activity.time))"
            >
              <div>
                <div>
                  {{ parseContext(activity.context, 'user') }}
                </div>
                <div>
                  {{ parseContext(activity.context, 'transition') }}
                </div>
                <div>
                  {{ parseContext(activity.context, 'reason') }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-collapse-item>
      </el-collapse>

      <div class="step-form">
        <el-input
          v-model="reason"
          type="textarea"
          :rows="2"
          placeholder="请输入理由"
        />
        <div>
          <el-button
            v-for="(item, index) in transitions"
            :key="index"
            size="small"
            type="primary"
            @click="confirmTransition(item.name)"
          >
            {{ translator(item.name) }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  props: {
    todoList: { type: Array, default: () => [] },
    itemId: { type: Number, default: null },
    multiple: { type: Boolean, default: false },
    selected: { type: Array, default: () => [] },
    apiPrefix: { type: String, required: true }
  },
  data() {
    return {
      dialogVisible: false,
      transitions: [],
      reason: '',
      activeNames: 'table'
    }
  },
  computed: {
    ...mapGetters(['storeId', 'user']),
    reviewData() {
      return this.todoList.find((e) => e.id === this.itemId) || {}
    },
    btnColor() {
      return this.reviewData.status === 'offer' ? 'danger' : 'primary'
    },
    btnName() {
      const status = this.reviewData.status || 'draft'
      switch (status) {
        case 'draft':
          return '提交'
        case 'offer':
          return '取消'
        default:
          return '审核'
      }
    }
  },
  methods: {
    parseTime,
    translator(name) {
      return name
    },
    showDialog() {
      let itemId = this.itemId
      if (this.multiple) {
        // all items are the same, so use first item
        const selectedId = this.selected[0].id
        itemId = selectedId
      }
      this.$api.get(`${this.apiPrefix + itemId}/transitions`).then((res) => {
        this.transitions = res.data
      })
      this.dialogVisible = true
    },
    parseContext(text, type) {
      if (text) {
        const textData = JSON.parse(text)
        switch (type) {
          case 'transition':
            return `流程：${this.translator(textData[type])}`
          case 'reason':
            return `理由：${textData[type]}`
          case 'user':
            return `用户：${textData[type]}`
          default:
            return ''
        }
      } else {
        return ''
      }
    },
    async confirmTransition(transition) {
      const data = {
        context: JSON.stringify({
          reason: this.reason,
          user: this.user.username,
          transition: transition
        })
      }
      const postList = []

      if (this.multiple) {
        this.selected.forEach((e) => {
          postList.push(e.id)
        })
      } else {
        postList.push(this.itemId)
      }

      const waitPromise = []
      postList.forEach(async (e) => {
        waitPromise.push(
          await this.$api.post(`${this.apiPrefix + e}/do/${transition}`, data)
        )
        const res = await this.$api.get(`${this.apiPrefix + e}`)
        this.$emit('confirm', { id: e, data: res.data })
      })
      Promise.all(waitPromise).then(() => {
        this.reason = ''
        this.$message({ message: '成功', type: 'success' })
        this.dialogVisible = false
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.step-form {
  margin-top: 20px;
  text-align: center;
  .el-textarea {
    margin-bottom: 10px;
  }
}
</style>
