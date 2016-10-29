'use strict'

var flow = require('../../')
var assert = require('assert')

describe('flow(), tests from "jayyvis/node-flow"\n', function() {

  it('runs all steps exactly once', function(done) {
    var count = {'one':0, 'two':0, 'three': 0}

    flow(
      function one() {
        count['one']++
        this.next()
      },
      function two() {
        count['two']++

        var self = this
        setTimeout(function() {
          self.next()
        }, 0)
      },
      function three() {
        count['three']++
        this.next()
      }
    )
    .then(callback)
    .catch(callback)

    function callback(err) {
      assert(!err, '[error]'+err)
      for (var k in count) assert.equal(count[k], 1)
      done()
    }
  })

  it('passes arguments to subsequent steps', function(done) {
    flow(
      function one() {
        this.next(null, 'cool')
      },
      function two(msg) {
        assert.equal(msg, 'cool')
        this.next(null, 'it', 'passes', 'all', 'args')
      },
      function three(arg1, arg2, arg3, arg4) {
        assert.equal(arg1, 'it')
        assert.equal(arg2, 'passes')
        assert.equal(arg3, 'all')
        assert.equal(arg4, 'args')
        this.next(null, 'wow')
      }
    )
    .then(r => callback(null, r))
    .catch(callback)

    function callback(err, result) {
      assert(!err, '[error]'+err)
      assert.equal(result, 'wow', 'wrong result')
      done()
    }
  })

  it('stops running further steps on error', function(done) {
    flow(
      function one() {
        this.next()
      },
      function two(msg) {
        this.next('error in step2')
      },
      function three() {
        assert.fail('reaching step3 when there is an error in step2')
      }
    )
    .catch(callback)

    function callback(err) {
      assert.equal(err, 'error in step2', 'wrong error message')
      done()
    }
  })

  it('handles thrown out error', function(done) {
    flow(
      function one() {
        this.next()
      },
      function two(msg) {
        throw 'error in step2'
      },
      function three() {
        assert.fail('reaching step3 when there is an error in step2')
      }
    )
    .catch(callback)

    function callback(err) {
      assert.equal(err, 'error in step2', 'wrong error message')
      done()
    }
  })

  it('gets out when there are no steps', function(done) {
    flow()
    .then(done)
    .catch(callback)

    function callback(err) {
      assert(!err, '[error]'+err)
    }
  })

  it('(disabled) errors when there is no callback given', function(done) {
    /*assert.throws(function() {
      flow(
        function one() {
          assert.fail('uncaught error')
        }
      )
    })*/
    done()
  })

})
