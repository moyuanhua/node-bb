const http = require('http');

console.log(http.METHODS)
console.log(http.STATUS_CODES)


const server = http.createServer(function(req,res){
    process.nextTick(async ()=> {
        console.log('begin nextick')
        // sleepSync()
        await sleep();
        console.log('after nextick')
    })
    // console.log('get req');

    res.writeHead(200, {'Content-type' : 'text/html'});
    res.write('<h1>Node.js</h1>');
    res.end('<p>Hello World</p>');
});

server.on('listening',()=>{
    console.log('listening on 7001')
    // consol
    // test3()
    // test2();
})

process.once('SIGINT',(e)=>{
    console.log(e);
})

server.listen(7001)