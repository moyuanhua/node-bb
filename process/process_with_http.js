
const http = require('http');

async function sleep(){
    return new Promise((resolve) => {
        let i = 0;
        setInterval(() => {
            if(i===10){
                resolve()
            }
            i++;
        }, 1000);
    })
}

function sleepSync(){
    let time = new Date().getTime() + 10 * 1000 * 1000;
    while(new Date().getTime() < time){
        console.log(new Date().getTime(),time)
    }
    return;
}

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

server.listen(7001)



function test() { 
    console.log('settimeOut',new Date().getTime())
    setTimeout(() => {
        test()
    }, 100);
}

function test2() {
    console.log('process.nextTick',new Date().getTime())
    process.nextTick(() => test2());
}

function test3() {
    console.log('setImmediate',new Date().getTime())
    // process.nextTick(() => test2());
    setImmediate(()=>{
        test3()
    })
}

// http.Server.on('')

