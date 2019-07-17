const logger = require('../logs/winston')(__filename)



a = () => {
    b()
}
b = () => {
    c()
}
c = () => {
    d()
}
d = () => {
    logger.info("test")
}
a()