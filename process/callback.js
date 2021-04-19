function a(cb) {
    console.log('before cb')
    cb();
    console.log('after cb')
}

a(() => {
    console.log('in cb')
})

console.log('after a')