<template>
  <el-dialog
    append-to-body
    :title="title"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <template v-if="component">
      <component :is="component" :data="componentData" />
    </template>

    <input
      ref="excel-upload-input"
      class="excel-upload-input"
      type="file"
      accept=".xlsx, .xls, .csv"
      @change="handleClick"
    >
    <div
      class="drop"
      @drop="handleDrop"
      @dragover="handleDragover"
      @dragenter="handleDragover"
    >
      <el-button
        style="margin-right: 16px"
        :loading="downloadLoading"
        type="primary"
        @click="createTemplate"
      >
        下载模板
      </el-button>

      <span>将填写后的文件拖到此处，或</span>

      <el-button
        :loading="uploadLoading"
        style="margin-left: 16px"
        type="success"
        @click="handleUpload"
      >
        点击上传
      </el-button>
    </div>

    <div v-if="errorData.length > 0" class="error-table">
      <h1>请处理完错误后重新上传！</h1>
      <el-table
        :data="errorTableData"
        border
        highlight-current-row
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column label="错误行号" prop="row" width="180" />
        <el-table-column label="错误原因" prop="reason" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import Schema from 'async-validator'
export default {
  props: {
    title: { type: String, default: '表格导入' },
    filename: { type: String, default: '模板' },
    visible: { type: Boolean, required: true },
    dialogWidth: { type: String, default: '800px' },
    maxSize: { type: Number, default: Infinity },
    fields: { type: Object, required: true },
    rules: { type: Object, default: () => ({}) },
    uploadFunc: { type: Function, required: true },
    downloadFunc: { type: Function, default: undefined },
    component: { type: Object, default: undefined }
  },
  data() {
    return {
      downloadLoading: false,
      uploadLoading: false,
      errorData: [],
      componentData: {}
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    errorTableData() {
      const errorData = this.errorData
      const errorTableData = []
      for (const index in errorData) {
        const messageArr = []
        for (const field in errorData[index]) {
          messageArr.push(errorData[index][field])
        }
        errorTableData.push({
          row: Number(index) + 2,
          reason: messageArr.join('、')
        })
      }
      return errorTableData
    }
  },
  methods: {
    beforeUpload(file) {
      const sizeLimit = file.size / 1024 / 1024 < this.maxSize
      if (sizeLimit) {
        return true
      }
      this.$message.error(`上传文件请不要大于${this.maxSize}Mb`)
      return false
    },
    async createTemplate() {
      if (this.downloadFunc) {
        this.downloadLoading = true
        await this.downloadFunc()
        this.downloadLoading = false
        return
      }
      const wb = XLSX.utils.book_new()
      const ws_name = 'SheetJS'
      const ws_data = [[...Object.values(this.fields)]]
      const ws = XLSX.utils.aoa_to_sheet(ws_data)
      XLSX.utils.book_append_sheet(wb, ws, ws_name)
      const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
      const wbout = XLSX.write(wb, wopts)
      saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        `${this.filename}.xlsx`
      )
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    processTableData(data) {
      return data.map((e) => {
        const result = {}
        for (const key in this.fields) {
          const value = e[this.fields[key]]
          if (value) result[key] = value
        }
        return result
      })
    },
    async generateData({ header, results }) {
      await this.checkTableTitle(header)

      const tableData = this.processTableData(results)

      await this.validateData(tableData)

      if (this.errorData.length === 0) {
        this.uploadLoading = true
        await this.uploadFunc(tableData)
          .then(() => {
            this.$message.success('导入成功')
            this.$emit('success')
            this.handleClose()
          })
          .catch(() => {
            this.$message.error({
              showClose: true,
              message: '导入失败, 请重新上传!',
              duration: 0
            })
          })
        this.uploadLoading = false
      }
    },
    validateData(tableData) {
      return new Promise((resolve, reject) => {
        if (tableData.length === 0) {
          this.$notify.error({
            title: '上传数据为空'
          })
          reject()
        }

        if (this.rules) {
          const validator = new Schema(this.rules)
          const errorData = []
          tableData.forEach((item, index) => {
            validator.validate(item, (errors) => {
              if (errors) {
                errorData[index] = []
                errors.forEach((error) => {
                  errorData[index][error.field] = error.message
                })
              }
            })
          })
          this.errorData = errorData
          resolve()
        }
      })
    },
    checkTableTitle(header) {
      return new Promise((resolve, reject) => {
        const titles = Object.values(this.fields)
        titles.forEach((e) => {
          if (!header.includes(e)) {
            reject()
            this.$notify.error({
              title: '数据错处',
              message: e + ' 列未找到',
              duration: 0
            })
          }
        })
        resolve()
      })
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.uploadLoading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('只能上传一个文件!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('只支持 .xlsx, .xls, .csv 文件')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.uploadLoading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.uploadLoading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.error-table {
  margin-top: 30px;
  text-align: center;
}
h1 {
  color: #f56c6c;
}
</style>
