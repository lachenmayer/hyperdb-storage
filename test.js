const test = require('tape')
const hyperdb = require('hyperdb')
const ram = require('random-access-memory')

const storage = require('./')

test('can put & get in a hyperdb stored inside a hyperdb', t => {
  const db = hyperdb(ram)
  const nestedDb = hyperdb(storage(db, 'nested'), { valueEncoding: 'json' })
  nestedDb.put('/some/key', { some: 'value' }, err => {
    t.error(err, 'put works')
    nestedDb.get('some/key', (err, nodes) => {
      t.error(err, 'get works')
      t.deepEqual(nodes[0].value, { some: 'value' })
      t.end()
    })
  })
})

test('works with firstNode conflict resolution', t => {
  const db = hyperdb(ram)
  const nestedDb = hyperdb(storage(db, 'nested'), {
    valueEncoding: 'json',
    firstNode: true,
  })
  nestedDb.put('/some/key', { some: 'value' }, err => {
    t.error(err, 'put works')
    nestedDb.get('some/key', (err, node) => {
      t.error(err, 'get works')
      t.deepEqual(node.value, { some: 'value' })
      t.end()
    })
  })
})
