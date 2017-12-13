var express = require("express");
var app = express();
var http = require('http');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
/* serves main page */
app.get("/", function (req, res) {
  res.sendfile('index.html')
});
/* serves all the static files */
app.get(/^(.+\..+)$/, function (req, res) {
  res.sendfile(__dirname + req.params[0]);
});
app.listen(8080, function () {
  console.log("Listening on 8080");
});

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter_min = new FileSync('db/min.json');
const adapter_max = new FileSync('db/max.json');
//inicialize db const with 2 db's
const db = {
  min: low(adapter_min),
  max: low(adapter_max)
};


app.get('/api', function (req, res) {
  const $query = req.query,
    items_per_page = +$query.items || 10;

  //get user's query db, if doesn't set=> set to minimal
  let $db = ($query.db == 0 || !$query.db) ? db.min : db.max;


  let result_starred = $db.get('users').filter({
      "starred": "true"
    }).value(), //GET all starred rows(do not use search function on them)
    result_unsturred = $db.get('users').filter(i => {
      return i.starred == "false" || !i.starred
    }).value(); //GET all unstarred rows

  //if search query is defined
  if ($query.search) {
    result_unsturred = result_unsturred.filter(i => {
      let str = i.firstName + i.lastName;
      return str.toLowerCase().includes($query.search.toLowerCase());
    })
  }
  //concat starred and unstarred arrays in result array to sort/send to client
  let result = result_starred.concat(result_unsturred);

  //if we have sorting in query we just sort resulted array with Array.prototype.sort()
  if ($query.sort_type !== '' && $query.sort_name !== '') {
    if ($query.sort_type == 'asc') {
      result.sort(function (a, b) {
        if (a[$query.sort_name] > b[$query.sort_name]) {
          return 1;
        }
        if (a[$query.sort_name] < b[$query.sort_name]) {
          return -1;
        }
        return 0;
      });
    } else {
      result.sort(function (a, b) {
        if (a[$query.sort_name] < b[$query.sort_name]) {
          return 1;
        }
        if (a[$query.sort_name] > b[$query.sort_name]) {
          return -1;
        }
        return 0;
      });
    }
  }

  let pages = Math.ceil(result.length / items_per_page),
    page = ($query.page <= pages) ? $query.page : 1, //if query page is more than pages=>set page to 1
    offset = (page - 1) * items_per_page,
    users = result.slice(offset, offset + items_per_page);

  let sended_obj = {
    pages,
    page,
    users
  }

  if (result) {
    res.json(sended_obj);
  } else {
    res.status(204).send('No content!');
  }
});
app.post('/api/star', function (res, req) {
  const $body = req.req.body,
    $db = ($body.db == 0) ? db.min : db.max;
  //find row in DB with by phone and id and set starred parametr
  $db.get('users')
    .find({
      id: +$body.id,
      phone: $body.phone
    })
    .assign({
      starred: $body.val
    })
    .write();
  res.res.status(201).send('created');
})
