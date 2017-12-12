<template>
  <div id="app" class="ui container">
<form>
  <p>Choose data:
    <input type="radio" value="0" v-model="db_type">
    <label>32 rows</label>
    <input type="radio" value="1" v-model="db_type">
    <label>1000 rows</label>
    <button type="submit">update</button>
  </p>
</form>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Header</th>
          <th>id</th>
          <th>firstName</th>
          <th>lastName</th>
          <th>email</th>
          <th>phone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-show="loading"><th colspan="6">
          <div class="ui active centered inline loader"></div>
        </tr></th>
        <tr v-for="item in data" v-bind:key="item.id">
          <td>Cell</td>
          <td>{{item.id}}</td>
          <td>{{item.firstName}}</td>
          <td>{{item.lastName}}</td>
          <td>{{item.email}}</td>
          <td>{{item.phone}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr><th colspan="6">
          <div class="ui right floated pagination menu">
            <paginate
              :page-count="pages"
              :click-handler="changePage"
              :prev-text="'Prev'"
              :next-text="'Next'"
              :page-link-class="'item'"
              :no-li-surrond="true"
              :active-class="'bg'">
            </paginate>
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
      db_type:0,
      loading:false,
      msg: 'Welcome to Your Vue.js App',
      current_page:1,
      data:[],
      pages:1
    }
  },
  created(){
    this.getData(this.current_page)
  },
  methods:{
    getData(page){
      this.loading=true;
      this.axios.get('/api',{params:{page,db:1}})
      .then(res=>{
        this.data = res.data.users;
        this.loading=false;
        this.pages = res.data.pages;
        });
    },
    changePage(page){
      this.getData(page);
      this.current_page=page;
    }
  }
}
</script>
<style lang="scss">
li {
  display: inline-block !important;
}
.bg {
  background:#7fa4e0;
}
</style>
