export const yearInput = {
  property: 'year',
  component: {
    props: ['value'],
    render(h) {
      return (
        <el-date-picker
          style='width:100px'
          v-model={this.value}
          clearable
          type='year'
          value-format='yyyy'
          placeholder='年份'
        ></el-date-picker>
      )
    }
  }
}

export const monthInput = {
  property: 'month',
  component: {
    props: ['value'],
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
        ></el-date-picker>
      )
    }
  }
}
