<template>
  <div id="app" class="ui container">
<form>
  <p>Choose data:
    <input type="radio" value="0">
    <label>32 rows</label>
    <input type="radio" value="1">
    <label>1000 rows</label>
    <button type="submit">update</button>
  </p>
</form>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Header</th>
          <th>Header</th>
          <th>Header</th>
          <th>Header</th>
          <th>Header</th>
          <th>Header</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
          <td>Cell</td>
        </tr>
      </tbody>
      <tfoot>
        <tr><th colspan="6">
          <div class="ui right floated pagination menu">
            <a class="icon item">
              <i class="left chevron icon"></i>
            </a>
            <a class="item">1</a>
            <a class="item">2</a>
            <a class="item">3</a>
            <a class="item">4</a>
            <a class="icon item">
              <i class="right chevron icon"></i>
            </a>
          </div>
        </th>
      </tr></tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'б
      current_page:1,
      data:[]
    }
  },
  created(){
    this.axios.get('/api',{params:{id:257}})
    .then(res=>console.log(res))
  }
}
</script>
