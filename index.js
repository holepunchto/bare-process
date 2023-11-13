/* global Bare */
const EventEmitter = require('bare-events')
const os = require('bare-os')
const env = require('bare-env')
const hrtime = require('bare-hrtime')

class Process extends EventEmitter {
  get platform () {
    return os.platform()
  }

  get arch () {
    return os.arch()
  }

  get title () {
    return os.getProcessTitle()
  }

  set title (title) {
    os.setProcessTitle(title)
  }

  get pid () {
    return os.pid()
  }

  get ppid () {
    return os.ppid()
  }

  get argv () {
    return Bare.argv
  }

  get execPath () {
    return os.execPath()
  }

  get exitCode () {
    return Bare.exitCode
  }

  set exitCode (code) {
    Bare.exitCode = code
  }

  get version () {
    return Bare.version
  }

  get versions () {
    return Bare.versions
  }

  get env () {
    return env
  }

  get hrtime () {
    return hrtime
  }

  exit (code) {
    Bare.exit(code)
  }

  suspend () {
    Bare.suspend()
  }

  resume () {
    Bare.resume()
  }

  cwd () {
    return os.cwd()
  }

  chdir (directory) {
    os.chdir(directory)
  }

  kill (pid, signal) {
    os.kill(pid, signal)
  }

  nextTick (cb, ...args) {
    queueMicrotask(cb.bind(null, ...args))
  }

  [Symbol.for('bare.inspect')] () {
    return {
      __proto__: { constructor: Process },

      platform: this.platform,
      arch: this.arch,
      title: this.title,
      pid: this.pid,
      ppid: this.ppid,
      argv: this.argv,
      execPath: this.execPath,
      exitCode: this.exitCode,
      version: this.version,
      versions: this.versions,
      env: this.env
    }
  }
}

const process = module.exports = new Process()

function forwardEvent (event, from = Bare, to = process) {
  to
    .on('newListener', (name) => {
      if (name === event) {
        if (to.listenerCount(event) === 0) {
          from.on(event, onevent)
        }
      }
    })
    .on('removeListener', (name) => {
      if (name === event) {
        if (event.listenerCount(event) === 0) {
          from.off(event, onevent)
        }
      }
    })

  function onevent (...args) {
    to.emit(event, ...args)
  }
}

forwardEvent('uncaughtException')
forwardEvent('unhandledRejection')
forwardEvent('beforeExit')
forwardEvent('exit')
