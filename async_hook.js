const fs = require('fs');
const async_hooks = require('async_hooks');

let indent = 0;

async_hooks.createHook({
  init(asyncId, type, triggerId) {
    const cId = asyncId;
    print(`${getIndent(indent)}${type}(${asyncId}): trigger: ${triggerId} scope: ${cId}`);
  },
  before(asyncId) {
    print(`${getIndent(indent)}before:  ${asyncId}`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    print(`${getIndent(indent)}after:   ${asyncId}`);
  },
  destroy(asyncId) {
    print(`${getIndent(indent)}destroy: ${asyncId}`);
  },
}).enable();

let server = require('net').createServer((sock) => {
  sock.end('hello world\n');
//   server.close();
});

server.listen(8080, () => print('server started'));

function print(str) {
  fs.writeSync(1, str + '\n');
}

function getIndent(n) {
  return ' '.repeat(n);
}