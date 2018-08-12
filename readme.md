# hyperdb-storage


> Use a [hyperdb](https://npm.im/hyperdb) as a storage backend for any hyper*-structure (eg. [hypercore](https://npm.im/hypercore), [hyperdrive](https://npm.im/hyperdrive), [hypertrie](https://npm.im/hypertrie)).

```
npm i hyperdb-storage
```

## Example

```js
const hyperdb = require('hyperdb')
const storage = require('hyperdb-storage')

// This hyperdb is stored on disk.
const db = hyperdb('my.db')

// This hyperdb is stored inside the hyperdb `db`.
// All of its contents are stored under the prefix 'example-db'.
const nestedDb = hyperdb(storage(db, 'example-db'))

// You can also store other hyper*-structures...
const nestedFeed = hypercore(storage(db, 'example-feed'))

// ...or store a Dat inside a hyperdb.
const nestedDat = Dat(storage(db, 'example-dat'))
```

## API

```js
storage(db, prefix, [storageOverrides])
```

- `db` is an instance of [hyperdb](https://npm.im/hyperdb).
- `prefix` is a string. All 'files' will be stored under this prefix.
- `storageOverrides` is an optional object which maps the [SLEEP](https://github.com/datproject/docs/blob/master/papers/sleep.md#file-descriptions) file names to storage providers.

    A storage provider is either a string defining the directory where you want to store files, or a function which takes a filename string and returns a [random-access-storage](https://github.com/random-access-storage) instance.

    Example:

    ```js
    // The metadata for this hyperdb is stored inside `db`, but the data files are
    // stored on disk, and the secret keys are stored in the system keychain.
    const keychain = require('random-access-keychain')
    const exampleDb = hyperdb(storage(db, 'example-db', {
      data: 'data',
      secret_key: file => keychain('hyperdb secret key', file),
    }))
    ```

**Important:** You need to be careful with conflicts in the parent db if you have granted write access to multiple keys. You should use the conflict resolution options in the `hyperdb` constructor, eg:

```js
hyperdb('my.db', {
  firstNode: true, // just return the first node found
  // ...or...
  reduce: (a, b) => a, // perform app-specific conflict resolution
})
```

If you don't use either of these, and more than one node is found for a given key, this module will emit a warning and use the first node.


## Contribute

PRs accepted.

## License

MIT © 2018 harry lachenmayer
