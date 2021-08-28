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
        :created-func="uploadValidator.createdFunc"
        :component="uploadValidator.component"
        @success="resetTableData()"
      />

      <querier
        v-model="queryData"
        style="margin-left: 8px"
        :querier-config="querierConfig"
        @confirm="resetTableData()"
      />

      <component
        :is="item"
        v-for="(item, index) in components"
        :key="index"
        v-model="tableData"
        @submit="formSubmit"
      />
    </el-row>

    <el-row>
      <base-table
        v-model="tableData"
        v-loading="tableLoading"
        :entity="entity"
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

        <template #actions="{ row }">
          <div style="display: flex">
            <transition
              v-if="hasTodo"
              style="margin-right: 8px"
              :row="row"
              :path="entityPath"
              @confirm="getTableData()"
            />
            <el-button
              v-if="!disableActions.includes('edit')"
              size="small"
              @click="editForm(row.id)"
            >
              修改
            </el-button>
            <el-popconfirm
              v-if="!disableActions.includes('delete')"
              style="margin-left: 8px"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              :title="deleteMessage"
              @confirm="handleDelete(row.id)"
            >
              <el-button slot="reference" size="small" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </div>
        </template>
      </base-table>
    </el-row>

    <el-row style="margin-top: 16px">
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
        v-model="formData"
        :entity="entity"
        :config="formConfigProcessed"
        :props="formProps"
        :events="formEvents"
        @submit="formSubmit"
      />
    </el-dialog>
  </div>
</template>
<script>
import { buildEntityPath } from '@/utils/path'
import UploadValidator from '@/components/UploadValidator'
import Transition from '@/components/Transition'
import BaseTable from '@/components/Base/Table'
import BaseForm from '@/components/Base/Form'
import Querier from '@/components/Querier'

export default {
  components: { BaseTable, BaseForm, Querier, UploadValidator, Transition },
  data() {
    return {
      entity: null,
      hasTodo: false,
      disableActions: [],
      deleteMessage: '确定删除吗？',
      queryData: null,
      querierConfig: [],
      tableData: [],
      tableProps: {},
      tableDefaultQuery: { page: 1, limit: 20 },
      tableQuery: {},
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
      components: []
    }
  },
  computed: {
    entityPath() {
      return buildEntityPath(this.entity)
    }
  },
  created() {
    this.initConfig()
  },
  methods: {
    resetTableData() {
      this.tableQueryProcessed = {
        ...this.tableDefaultQuery,
        ...this.tableQuery,
        ...this.mergeFilter()
      }
      this.getTableData()
    },
    getTableData() {
      this.tableLoading = true
      const params = { ...this.tableQueryProcessed }
      this.$request
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
    async initConfig() {
      this.entity = this.$route.meta.entity
      const lastPath = this.$route.path
        .match(/[^\/]+(?!.*\/)/)[0]
        .replace('-', '/')
      const page = await import(`@/config/pages/${lastPath}`)
      const config = page.default
      const keys = Object.keys(config)
      keys.forEach((e) => {
        this[e] = config[e]
      })

      this.tableEvents = {
        ...this.tableEvents,
        'selection-change': this.handleSelectionChange
      }

      this.tableConfig.forEach((e, index) => {
        if (e === 'id') {
          this.$set(this.tableConfig, index, {
            property: 'id',
            props: { width: '80px' }
          })
        }
      })

      let hasDefault = false
      this.querierConfig.forEach((e) => {
        if (e?.default) {
          hasDefault = true
        }
      })
      if (!hasDefault) {
        this.resetTableData()
      }
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
      const res = await this.$request.get(this.downloadConfig.api, { params })
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
      this.$request.delete(this.entityPath + `/${id}`).then(() => {
        this.tableUpdate('delete', id)
        this.$message.success('删除成功')
      })
    },
    tableUpdate(type, param) {
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
    formSubmit(formData) {
      const data = { ...formData }
      let method = 'post'
      let url = this.entityPath
      if (this.formType === 'edit') {
        method = 'put'
        url += `/${this.formData.id}`
      }

      this.$request({ method, url, data }).then((res) => {
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
        const res = await this.$request.get(this.entityPath + `/${id}`)
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
  padding: 16px;
}
.top-menu {
  display: flex;
  .querier-container {
    margin-left: 8px;
  }
}
.action {
  display: flex;
  .transition {
    margin-right: 8px;
  }
}
</style>
