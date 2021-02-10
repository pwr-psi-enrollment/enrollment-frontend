const bundle = require('bundle-js');

let output = bundle({
    entry : './src/index.js',
    dest: './dist/jHawk.js',
    print: false
});
//
// let anotherOutput = bundle({
//     entry : './src/index.js',
//     dest: 'E:/Programowanie/php/aws-client/public/js/hawk.js',
//     print: false
// });

console.log("Compilation successful!");