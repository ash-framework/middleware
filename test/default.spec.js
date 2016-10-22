/* global describe, it */
const assert = require('assert')
const middleware = require('../src')
const express = require('express')
const path = require('path')
const request = require('supertest-as-promised')

describe('middleware', function () {
  it('loads middleware from middleware folder', function () {
    const app = express()
    const defn = function () {
      this.middleware('security')
    }

    middleware(defn, app, path.join(__dirname, 'middleware'))

    app.get('/', function (req, res) {
      res.send(req.test)
    })

    return request(app).get('/')
      .expect(200)
      .then(res => assert.strictEqual(res.body, true))
  })

  it('loads middleware from middleware folder with options', function () {
    const app = express()
    const options = {enabled: true}
    const defn = function () {
      this.middleware('security', options)
    }

    middleware(defn, app, path.join(__dirname, 'middleware'))

    app.get('/', function (req, res) {
      res.send(req.options)
    })

    return request(app).get('/')
      .expect(200)
      .then(res => assert.deepEqual(res.body, options))
  })

  it('loads middleware functions', function () {
    const app = express()
    const bodyParser = require('body-parser')
    const defn = function () {
      this.middleware(bodyParser.json())
    }

    middleware(defn, app, path.join(__dirname, 'middleware'))

    app.post('/', function (req, res) {
      res.send(req.body)
    })

    return request(app).post('/').send({test: true})
      .expect(200)
      .then(res => assert.deepEqual(res.body, {test: true}))
  })

  it('loads middleware from middleware folder with nested structure', function () {
    const app = express()
    const defn = function () {
      this.middleware('security', function () {
        this.middleware('one')
        this.middleware('two')
        this.middleware('three')
      })
    }

    middleware(defn, app, path.join(__dirname, 'middleware'))

    app.get('/', function (req, res) {
      res.send({
        one: req.one,
        two: req.two,
        three: req.three
      })
    })

    return request(app).get('/')
      .expect(200)
      .then(res => {
        assert.strictEqual(res.body.one, true)
        assert.strictEqual(res.body.two, true)
        assert.strictEqual(res.body.three, true)
      })
  })

  it('missing name argument', function () {
    const app = express()
    const defn = function () {
      this.middleware()
    }

    const test = () => middleware(defn, app, path.join(__dirname, 'middleware'))
    assert.throws(test)
  })

  it('invalid name argument', function () {
    const app = express()
    const defn = function () {
      this.middleware(1)
    }

    const test = () => middleware(defn, app, path.join(__dirname, 'middleware'))
    assert.throws(test)
  })

  it('invalid options argument', function () {
    const app = express()
    const defn = function () {
      this.middleware('security', 1)
    }

    const test = () => middleware(defn, app, path.join(__dirname, 'middleware'))
    assert.throws(test)
  })

  it('invalid file', function () {
    const app = express()
    const defn = function () {
      this.middleware('fake')
    }

    const test = () => middleware(defn, app, path.join(__dirname, 'middleware'))
    assert.throws(test)
  })

  it('missing class', function () {
    const app = express()
    const defn = function () {
      this.middleware('noclass')
    }

    const test = () => middleware(defn, app, path.join(__dirname, 'middleware'))
    assert.throws(test)
  })

  it('missing register method', function () {
    const app = express()
    const defn = function () {
      this.middleware('noregister')
    }

    const test = () => middleware(defn, app, path.join(__dirname, 'middleware'))
    assert.throws(test)
  })
})
