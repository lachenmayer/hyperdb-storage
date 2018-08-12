const rafify = require('rafify')
const rakv = require('random-access-key-value')

module.exports = function hyperdbStorage(db, prefix, storageOverrides = {}) {
  function get(key, cb) {
    return db.get(key, (err, nodes) => {
      if (Array.isArray(nodes)) {
        if (nodes.length > 1) {
          console.warn(
            'hyperdb-storage: The storage db has conflicting nodess for key:',
            key,
            '- using the first nodes.'
          )
        }
        nodes = nodes[0]
      }
      return cb(err, nodes != null ? nodes.value : nodes)
    })
  }
  return file => {
    if (file in storageOverrides) {
      return rafify(storageOverrides[file])
    }
    return rakv(
      { get, put: db.put.bind(db), batch: db.batch.bind(db) },
      prefix + '/' + file
    )
  }
}
