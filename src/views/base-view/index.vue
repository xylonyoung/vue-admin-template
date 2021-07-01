<template>
  <div class="base-container">
    <el-row style="display: flex">
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
        @success="resetTableData()"
      />

      <querier
        v-model="queryData"
        style="margin-left: 10px"
        :querier-config="querierConfig"
        @confirm="resetTableData()"
      />

      <component
        :is="item"
        v-for="(item, index) in topBarComponents"
        :key="index"
        v-model="tableData"
        @submit="formSubmit"
      />
    </el-row>

    <el-row>
      <base-table
        v-loading="tableLoading"
        :data.sync="tableData"
        :entity="entityData"
        :config="tableConfig"
        :props="tableProps"
        :events="tableEvents"
        :disable-actions="disableActions.includes('action')"
      >
        <template v-if="selection" #selection>
          <el-table-column
            type="selection"
            width="55"
            :selectable="selectableFunc"
          />
        </template>

        <template #actions="{ data }">
          <div style="display: flex">
            <transition
              v-if="hasTodo"
              style="margin-right: 10px"
              :todo-list="todoList"
              :item-id="data.id"
              :api-prefix="entityPath"
              @confirm="tableUpdate"
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
              style="margin-left: 10px"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @onConfirm="handleDelete(data.id)"
            >
              <el-button slot="reference" size="small" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </div>
        </template>
      </base-table>
    </el-row>

    <el-row style="margin-top: 20px">
      <el-pagination
        :current-page.sync="tableQueryProcessed.page"
        :page-sizes="[20, 50, 100]"
        :page-size="tableQueryProcessed.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableQueryProcessed.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <el-dialog
      :title="formType === 'edit' ? '修改' : '新增'"
      :visible.sync="formDialogVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <base-form
        :data.sync="formData"
        :entity="entityData"
        :config="formConfigProcessed"
        :props="formProps"
        :events="formEvents"
        @submit="formSubmit"
      />
    </el-dialog>
  </div>
</template>
<script>
import buildEntityPath from '@/components/Base/buildEntityPath'
import BaseTable from '@/components/Base/Table'
import BaseForm from '@/components/Base/Form'
import UploadValidator from '@/components/UploadValidator'
import Transition from '@/components/Transition'
import Querier from '@/components/Querier'
import config from './config'
export default {
  components: { BaseTable, BaseForm, Querier, UploadValidator, Transition },
  data() {
    return {
      entity: null,
      entityData: {},
      hasTodo: false,
      todoList: [],
      disableActions: [],
      queryData: null,
      querierConfig: [],
      tableData: [],
      tableProps: {},
      tableQuery: { page: 1, limit: 20 },
      tableQueryProcessed: {},
      tableEvents: {},
      tableConfig: [],
      tableLoading: false,
      formType: '',
      formData: {},
      formProps: {},
      formEvents: {},
      formConfig: [],
      formConfigForCreate: [],
      formConfigProcessed: [],
      formDialogVisible: false,
      selection: false,
      selectableFunc: () => true,
      downloadLoading: false,
      downloadConfig: null,
      uploadVisible: false,
      uploadValidator: null,
      topBarComponents: []
    }
  },
  computed: {
    entityPath() {
      return buildEntityPath(this.entity)
    }
  },
  async created() {
    this.setData()
    this.entityData = await this.$store.dispatch(
      'entity/getEntity',
      this.entity
    )
  },
  methods: {
    resetTableData() {
      this.tableQueryProcessed = { ...this.tableQuery, ...this.mergeFilter() }
      this.getTableData()
    },
    getTableData() {
      this.tableLoading = true
      const params = { ...this.tableQueryProcessed }
      this.$api
        .get(this.entityPath, { params })
        .then((res) => {
          this.tableLoading = false
          const { data, paginator } = res
          this.tableData = data ?? []
          if (paginator) {
            this.tableQueryProcessed.page = paginator.current
            this.tableQueryProcessed.totalCount = paginator.totalCount
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    getTodo() {
      this.$api.get(this.entityPath).then((res) => {
        this.todoList = res.data
      })
    },
    setData() {
      this.entity = this.$route.meta.entity
      const lastPath = this.$route.path.match(/[^\/]+(?!.*\/)/)[0]
      const keys = Object.keys(config[lastPath])
      keys.forEach((e) => {
        this[e] = config[lastPath][e]
      })
      this.tableEvents = {
        ...this.tableEvents,
        'selection-change': this.handleSelectionChange
      }

      if (this.hasTodo) this.getTodo()

      this.resetTableData()
    },
    mergeFilter() {
      const queryList = []
      checkAndPush(this.tableQuery['@filter'])
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
    async handleDownload() {
      this.downloadLoading = true
      const params = this.mergeFilter()
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
    handleSizeChange(val) {
      this.tableQueryProcessed.limit = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableQueryProcessed.page = val
      this.getTableData()
    },
    handleSelectionChange(e) {
      // TODO
      console.log(e)
      this.selected = e
    },
    handleDelete(id) {
      this.$api.delete(this.entityPath + `/${id}`).then(() => {
        this.tableUpdate('delete', id)
        this.$message.success('删除成功')
      })
    },
    tableUpdate(type, param) {
      if (this.hasTodo) this.getTodo()

      if (type === 'post') {
        this.tableData.unshift(param)
      }

      let index
      if (type === 'put') {
        index = this.tableData.findIndex((e) => e.id === param.id)
        this.tableData.splice(index, 1, param)
      }

      if (type === 'delete') {
        index = this.tableData.findIndex((e) => e.id === param)
        this.tableData.splice(index, 1)
      }
    },
    formSubmit() {
      const data = {}
      for (const key in this.formData) {
        const prop = this.formData[key]
        // skip the property which is not in the config
        if (
          prop === undefined ||
          !this.formConfig.some((e) => (e.property ?? e) === key)
        ) {
          continue
        }

        data[key] = prop
      }

      let method = 'post'
      let url = this.entityPath
      if (this.formType === 'edit') {
        method = 'put'
        url += `/${this.formData.id}`
      }

      this.$api({ method, url, data }).then((res) => {
        this.$message.success('成功')
        this.formDialogVisible = false
        this.tableUpdate(method, res?.data)
      })
    },
    async editForm(id) {
      let formData = {}
      let formConfigProcessed = [...this.formConfig]
      if (id) {
        this.formType = 'edit'
        const res = await this.$api.get(this.entityPath + `/${id}`)
        if (res.data) formData = { ...res.data }
      } else {
        this.formType = 'create'
        if (this.formConfigForCreate.length > 0) {
          formConfigProcessed = [...this.formConfigForCreate]
        }
      }

      this.formData = formData
      this.formConfigProcessed = formConfigProcessed
      this.formDialogVisible = true
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
