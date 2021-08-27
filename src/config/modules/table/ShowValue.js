export default function(options) {
  return {
    props: ['value'],
    render(h) {
      return <span>{options[this.value]}</span>
    }
  }
}
