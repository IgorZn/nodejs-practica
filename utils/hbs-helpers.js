/*
*
*   HELPERS в HBS -- это функции, которые будут доступны в шаблоне, которые мы сможем
*   использовать.
*
* */

module.exports = {
    ifeq(a, b, options) {
        if (a == b) {
            return options.fn(this)
        }
        return options.inverse(this)
    }
}