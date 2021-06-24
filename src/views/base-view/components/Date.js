const yearInput = {
  property: 'year',
  component: {
    props: ['form'],
    data() {
      return {
        value: ''
      }
    },
    watch: {
      'form.year': {
        handler(val) {
          if (val) this.value = new Date(val.toString())
        }
      }
    },
    render(h) {
      return (
        <el-date-picker
          style='width:100px'
          v-model={this.value}
          clearable
          type='year'
          value-format='yyyy'
          placeholder='年份'
          on-change={val => {
            this.form.year = val
          }}
        ></el-date-picker>
      )
    }
  }
}

const monthInput = {
  property: 'month',
  component: {
    props: ['form'],
    data() {
      return {
        value: ''
      }
    },
    watch: {
      'form.month': {
        handler(val) {
          if (val) this.value = new Date(val.toString())
        }
      }
    },
    render(h) {
      return (
        <el-date-picker
          style='width:100px'
          v-model={this.value}
          clearable
          type='month'
          format='M'
          value-format='M'
          placeholder='月份'
          on-change={val => {
            this.form.month = val
          }}
        ></el-date-picker>
      )
    }
  }
}

export { yearInput, monthInput }
