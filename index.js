/* global Bare */
const EventEmitter = require('bare-events')
const Pipe = require('bare-pipe')
const tty = require('bare-tty')
const os = require('bare-os')
const env = require('bare-env')
const hrtime = require('bare-hrtime')

class Process extends EventEmitter {
  constructor () {
    super()

    this._stdin = null
    this._stdout = null
    this._stderr = null
  }

  get stdin () {
    if (this._stdin === null) {
      this._stdin = tty.isTTY(0) ? new tty.ReadStream(0) : new Pipe(0)
      this._stdin.fd = 0
    }
    return this._stdin
  }

  get stdout () {
    if (this._stdout === null) {
      this._stdout = tty.isTTY(1) ? new tty.WriteStream(1) : new Pipe(1)
      this._stdout.fd = 1
    }
    return this._stdout
  }

  get stderr () {
    if (this._stderr === null) {
      this._stderr = tty.isTTY(2) ? new tty.WriteStream(2) : new Pipe(2)
      this._stderr.fd = 2
    }
    return this._stderr
  }

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
        if (to.listenerCount(event) === 0) {
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
forwardEvent('suspend')
forwardEvent('idle')
forwardEvent('resume')
