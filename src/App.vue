<template>
  <div id="app" class="ui container">
    <div class="ui form">
      <div class="inline fields">
        <label>DB:</label>
        <div class="field">
          <div class="ui radio checkbox">
            <input type="radio" value="0" v-model="db_type">
            <label>small</label>
          </div>
        </div>
        <div class="field">
          <div class="ui radio checkbox">
            <input type="radio" value="1" v-model="db_type">
            <label>full</label>
          </div>
        </div>
        <div class="ui submit button" @click="getData(1)">Select</div>
        <label>Items per page:</label>
        <div class="field">
          <select v-model="items" @change="getData(1)" class="ui dropdown">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <label>Search:</label>
        <div class="field">
          <input type="text" placeholder="Search" v-model="search" @change="getData(1)">
        </div> 
      </div>
    </div>
    <table class="ui celled table sortable definition">
      <thead>
        <tr>
          <th></th>
          <th @click="setSort('id')" :class="(sort.name=='id')?(sort.type=='asc')?'sorted ascending':'sorted descending':''">id</th>
          <th @click="setSort('firstName')" :class="(sort.name=='firstName')?(sort.type=='asc')?'sorted ascending':'sorted descending':''">firstName</th>
          <th @click="setSort('lastName')" :class="(sort.name=='lastName')?(sort.type=='asc')?'sorted ascending':'sorted descending':''">lastName</th>
          <th @click="setSort('email')" :class="(sort.name=='email')?(sort.type=='asc')?'sorted ascending':'sorted descending':''">email</th>
          <th @click="setSort('phone')" :class="(sort.name=='phone')?(sort.type=='asc')?'sorted ascending':'sorted descending':''">phone</th>
        </tr>
      </thead>
      <tbody>
        <tr v-show="loading">
          <th colspan="6">
            <div class="ui active centered inline loader"></div>
        </tr>
        </th>
        <tr v-for="item in data" :data-key="item.id" :data-phone="item.phone" @click="selectRow(item)" v-bind:key="item.id">
          <td @click="setStarred(item)">
            <i class="star icon" :class="(item.starred==true||item.starred=='true')?'':'empty'"></i>
          </td>
          <td>{{item.id}}</td>
          <td>{{item.firstName}}</td>
          <td>{{item.lastName}}</td>
          <td>{{item.email}}</td>
          <td>{{item.phone}}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="6">
            <div class="ui right floated pagination menu">
              <paginate ref="paginated" :page-count="pages" :click-handler="getData" :force-pagce="current_page" :prev-text="'Prev'" :prev-class="'item'"
                :next-text="'Next'" :next-class="'item'" :page-link-class="'item'" :active-class="'bg'">
              </paginate>
            </div>
          </th>
        </tr>
      </tfoot>
    </table>
    <div v-if="Object.keys(current_item).length!=0" class="ui centered card">
      <div class="content">
        <div class="header">Выбран пользователь:{{current_item.firstName+' '+current_item.lastName}}</div>
        <div class="description ui form">
          Описание:
          <br>
          <textarea cols="30" rows="10" v-model="current_item.description" class="field"></textarea>
          <br> Адрес:
          <b>{{current_item.adress.streetAddress}}</b>
          <br> Город:
          <b>{{current_item.adress.city}}</b>
          <br> Провинция/штат:
          <b>{{current_item.adress.state}}</b>
          <br> Индекс:
          <b>{{current_item.adress.zip}}</b>
          <br>
        </div>
      </div>
    </div>
    <div class="ui segment">
      <h4 class="ui right aligned header">created by <i>@Chank1e</i>, 2017. <u>for Finom</u></h4>
    </div>
  </div>
</template>


<script>
export default {
  name: 'app',
  data() {
    return {
      db_type: 0,
      loading: false,
      current_page: 1,
      data: [],
      pages: 1,
      search: '',
      items: 10,
      current_item: {},
      sort: {
        name: '',
        type: ''
      }
    }
  },
  mounted() {
    this.getData(this.current_page);
  },
  methods: {
    setSort(name) {
      if (!this.sort.type) {
        this.sort.type = 'asc';
      } else {
        if (this.sort.name != name) {
          this.sort.type = 'asc';
        } else {
          this.sort.type = (this.sort.type == 'desc') ? 'asc' : 'desc';
        }

      }
      this.sort.name = name;
      this.getData(1);
    },
    getData(page = 1) {
      this.changePage(page);
      this.loading = true;
      //console.time('request time:')
      this.axios.get('/api', {
          params: {
            page,
            db: this.db_type,
            search: this.search,
            items: this.items,
            sort_name: this.sort.name,
            sort_type: this.sort.type
          }
        })
        .then(res => {
          //console.timeEnd('request time:')
          this.data = res.data.users;
          this.loading = false;
          this.pages = res.data.pages;
        });
    },
    changePage(page) {
      this.removeSelectedRows();
      this.current_page = page;
      this.$refs.paginated.selected = this.current_page - 1;
    },
    selectRow(item) {
      this.removeSelectedRows();
      document.querySelector(`tr[data-key="${item.id}"][data-phone="${item.phone}"]`).classList.add('selected');
      this.current_item = item;
    },
    setStarred(item) {
      if (!item.starred || item.starred == false || item.starred == "false") {
        item.starred = true;
      } else if (item.starred == true || item.starred == "true") {
        item.starred = false;
      }
      this.$forceUpdate();
      this.axios.post('/api/star', Vue.param({
        id: item.id,
        phone: item.phone,
        db: this.db_type,
        val: item.starred
      }));
    },
    removeSelectedRows() {
      document.querySelectorAll('tr[data-key]').forEach(i => i.classList.remove('selected'));
    }
  }
}
</script>
<style lang="scss">
tr {
  cursor:pointer;
  &.selected {
    background: #c6c6c6;
  }
}
ul {
  padding-left:0 !important;
}
li {
  display: inline-block !important;
}
.bg {
  background:rgba(33, 133, 208,.5);
  border-radius:50%;
}
</style>
