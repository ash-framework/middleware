module.exports = class Middleware {
  register (context) {
    context.request.two = true
  }
}
