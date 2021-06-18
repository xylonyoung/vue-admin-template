<template>
  <div class="base-container">
    <el-row>
      <el-button
        v-if="!disableActions.includes('new')"
        type="primary"
        icon="el-icon-circle-plus"
        @click="editForm()"
      >
        新增
      </el-button>
      <el-button
        v-if="uploadValidator"
        type="primary"
        icon="el-icon-upload"
        @click="uploadVisible = true"
      >
        上传
      </el-button>
      <el-button
        v-if="downloadConfig"
        type="success"
        icon="el-icon-download"
        :loading="downloadLoading"
        @click="handleDownload"
      >
        下载
      </el-button>
      <upload-validator
        v-if="uploadValidator"
        :visible.sync="uploadVisible"
        :title="uploadValidator.title"
        :filename="uploadValidator.filename"
        :fields="uploadValidator.fields"
        :rules="uploadValidator.rules"
        :upload-func="uploadValidator.uploadFunc"
        :download-func="uploadValidator.downloadFunc"
        :component="uploadValidator.component"
        @success="uploadSuccess"
      />
      <querier
        v-model="queryData"
        :querier-config="querierConfig"
        @confirm="querierChange"
      />
      <component
        :is="item"
        v-for="(item, index) in topBarComponents"
        :key="index"
        @update="formSubmit"
      />
    </el-row>
    <el-row>
      <base-table :data="tableData" />
    </el-row>
    <!-- <list-admin
      :key="listKey"
      v-model="tableData"
      :entity-conf="entity"
      :list-display="listDisplay"
      :query="listQueryData"
      :disabled-actions="['new', 'delete', 'edit', ...disableActions]"
      :table-event="{ 'selection-change': handleSelectionChange }"
    >
      <template v-if="selection" #tableSelection>
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectableFunc"
        />
      </template>

      <template
        v-if="!disableActions.includes('action')"
        #extraAction="{ data }"
      >
        <div class="action">
          <transition
            v-if="hasTodo"
            class="transition"
            :todo-list="todoList"
            :item-id="data.id"
            :api-prefix="apiPrefix"
            @confirm="listUpdate"
          />
          <el-button
            v-if="!disableActions.includes('edit')"
            size="small"
            @click="editForm(data.id)"
          >
            修改
          </el-button>
          <el-popconfirm
            v-if="!disableActions.includes('delete')"
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            style="margin-left: 10px"
            @onConfirm="handleDelete(data.id)"
          >
            <el-button slot="reference" size="small" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </div>
      </template>
    </list-admin> -->

    <el-dialog
      :title="formType === 'edit' ? '修改' : '新增'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <form-admin
        :id="formId"
        :key="formKey"
        v-model="formData"
        :entity-conf="entity"
        :fields="formFieldsSwitch"
      >
        <template #action="{ submit }">
          <el-button
            type="primary"
            icon="el-icon-edit-outline"
            @click="submit(formSubmit)"
          >
            保存
          </el-button>
        </template>
      </form-admin>
    </el-dialog>
  </div>
</template>
<script>
import BaseTable from '@/components/BaseTable'
import Querier from '@/components/Querier'
import UploadValidator from '@/components/UploadValidator'
import Transition from '@/components/Transition'
import config from './config'
import pluralize from 'pluralize'
export default {
  components: { BaseTable, Querier, UploadValidator, Transition },
  data() {
    return {
      entity: null,
      listKey: 0,
      tableData: [],
      listDisplay: [],
      listQuery: {},
      disableActions: [],
      dialogVisible: false,
      formId: null,
      formKey: 0,
      formData: {},
      formFieldsForCreate: null,
      formFields: [],
      formType: '',
      selection: false,
      selectableFunc: () => true,
      hasTodo: false,
      todoList: [],
      queryData: null,
      querierConfig: [],
      downloadLoading: false,
      downloadConfig: null,
      uploadVisible: false,
      uploadValidator: null,
      topBarComponents: []
    }
  },
  computed: {
    apiPrefix() {
      const name = this.entity?.name ?? this.entity
      return `${this.entity?.prefix ?? 'manage'}/${this._.kebabCase(
        pluralize(name)
      )}/`
    },
    formFieldsSwitch() {
      if (this.formType === 'create' && this.formFieldsForCreate) {
        return this.formFieldsForCreate
      }
      return this.formFields
    },
    listQueryData() {
      return { ...this.listQuery, ...this.mergeQuery() }
    }
  },
  created() {
    this.setData()
  },
  methods: {
    getTodo() {
      const path = `${this.apiPrefix}todo`
      this.$api.get(path).then((res) => {
        this.todoList = res.data
      })
    },
    uploadSuccess() {
      this.listKey++
    },
    setData() {
      this.entity = this.$route.meta.entity
      const lastPath = this.$route.path.match(/[^\/]+(?!.*\/)/)[0]
      const keys = Object.keys(config[lastPath])
      keys.forEach((e) => {
        this[e] = config[lastPath][e]
      })

      if (this.hasTodo) this.getTodo()
    },
    async handleDownload() {
      this.downloadLoading = true
      const params = this.mergeQuery()
      const res = await this.$api.get(this.downloadConfig.api, { params })
      if (res.data.length === 0) {
        this.$message.warning('暂无数据')
        this.downloadLoading = false
        return
      }
      const filterVal = this.downloadConfig.filterVal
      const data = await this.downloadConfig.formatFunc.call(
        this,
        filterVal,
        res.data
      )
      const excel = await import('@/vendor/Export2Excel')
      excel.export_json_to_excel({
        header: this.downloadConfig.tHeader,
        data,
        filename: this.downloadConfig.filename
      })
      this.downloadLoading = false
    },
    mergeQuery() {
      const queryList = []
      checkAndPush(this.listQuery['@filter'])
      checkAndPush(this.queryData)

      const result = {}
      if (queryList.length > 0) {
        result['@filter'] = queryList.join(' && ')
      }

      return result

      function checkAndPush(string) {
        if (string) queryList.push(string)
      }
    },
    handleSelectionChange(e) {
      // TODO
      console.log(e)
      this.selected = e
    },
    querierChange() {
      this.listKey++
    },
    handleDelete(id) {
      const entity = new EntityManage(this.entity)
      entity.delete(id).then(() => {
        this.listUpdate({ id })
        this.$message.success('删除成功')
      })
    },
    formSubmit({ data }) {
      this.$message.success('成功')
      this.dialogVisible = false
      const param = { data }
      if (this.formType === 'edit') param.id = this.formId
      this.listUpdate(param)
    },
    listUpdate({ id, data }) {
      if (this.hasTodo) this.getTodo()

      if (id) {
        const index = this.tableData.findIndex((e) => e.id === id)
        if (data) {
          this.tableData.splice(index, 1, data)
        } else {
          this.tableData.splice(index, 1)
        }
      } else {
        this.tableData.unshift(data)
      }
    },
    editForm(id) {
      if (id) {
        this.formId = id
        this.formType = 'edit'
      } else {
        this.formId = null
        this.formType = 'create'
      }
      this.formData = {}
      this.formKey++
      this.dialogVisible = true
    }
  }
}
</script>
<style lang='scss' scoped>
.base-container {
  padding: 20px;
}
.top-menu {
  display: flex;
  .querier-container {
    margin-left: 10px;
  }
}
.action {
  display: flex;
  .transition {
    margin-right: 10px;
  }
}
</style>
