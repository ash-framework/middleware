module.exports = class Middleware {
  register (context) {
    context.request.test = {one: true}
  }
}
