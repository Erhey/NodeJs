

function* generator(i) {

    while (i < 10) {
        yield i++;
    }
}
var gen = generator(1);
let value = gen.next().value
while (value < 20) {
    console.log(value)
    value = gen.next().value
}
