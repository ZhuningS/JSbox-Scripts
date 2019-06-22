var extensions = $cache.get("extensionss") || []
if ($app.env != $env.app) {
  $ui.menu({
    items: extensions,
    handler: function(title, idx) {
    $app.openURL("jsbox://run?name="+encodeURI(title))
    }
  })
  return
}


Array.prototype.move = function(from, to) {
  var object = this[from]
  this.splice(from, 1)
  this.splice(to, 0, object)
}

$ui.render({
  props: {
    title: "JSBox Favorites for Pin"
  },
  views: [
    {
      type: "button",
      props: {
        title: "添加扩展"
      },
      layout: function(make) {
        make.left.right.top.inset(10)
        make.height.equalTo(32)
      },
      events: {
        tapped: function(sender) {
          addItem()
        }
      }
    },
    {
      type: "list",
      props: {
        id: "list",
        reorder: true,
        actions: [
          {
            title: "delete",
            handler: function(sender, indexPath) {
              deleteItem(indexPath)
            }
          }
        ]
      },
      layout: function(make) {
        make.left.bottom.right.equalTo(0)
        make.top.equalTo($("button").bottom).offset(10)
      },
      events: {
        didSelect: function(sender, indexPath, title) {
          $app.openURL("jsbox://run?name="+encodeURI(title))
        },
        reorderMoved: function(from, to) {
          extensions.move(from.row, to.row)
        },
        reorderFinished: function() {
          saveItems()
        }
      }
    }
  ]
})

var listView = $("list")
listView.data = extensions

function insertItem(text) {
  extensions.unshift(text)
  listView.insert({
    index: 0,
    value: text
  })
  saveItems()
}

function deleteItem(indexPath) {
  var text = extensions[indexPath.row]
  var index = extensions.indexOf(text)
  if (index >= 0) {
    extensions.splice(index, 1)
    saveItems()
  }
}

function addItem() {
  $input.text({
    type: $kbType.text,
    placeholder: "输入脚本名字",
    handler: function(text) {
      insertItem(text)
    }
  })
}

function saveItems() {
  $cache.set("extensionss", extensions)
}
