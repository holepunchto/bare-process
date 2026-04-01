const abort = require('bare-abort')
const EventEmitter = require('bare-events')
const Signal = require('bare-signals')
const os = require('bare-os')
const env = require('bare-env')
const hrtime = require('bare-hrtime')
const stdio = require('bare-stdio')

class Process extends EventEmitter {
  constructor() {
    super()

    this._startTime = hrtime.bigint()

    EventEmitter.forward(Bare, this, [
      'uncaughtException',
      'unhandledRejection',
      'beforeExit',
      'exit',
      'suspend',
      'wakeup',
      'idle',
      'resume'
    ])

    const signals = new Signal.Emitter()

    signals.unref()

    EventEmitter.forward(signals, this, Object.keys(os.constants.signals))
  }

  get stdin() {
    return stdio.in
  }

  get stdout() {
    return stdio.out
  }

  get stderr() {
    return stdio.err
  }

  get platform() {
    return os.platform()
  }

  get arch() {
    return os.arch()
  }

  get title() {
    return os.getProcessTitle()
  }

  set title(title) {
    os.setProcessTitle(title)
  }

  get pid() {
    return os.pid()
  }

  get ppid() {
    return os.ppid()
  }

  get argv() {
    return Bare.argv
  }

  get execPath() {
    return os.execPath()
  }

  get exitCode() {
    return Bare.exitCode
  }

  set exitCode(code) {
    Bare.exitCode = code
  }

  get version() {
    return Bare.version
  }

  get versions() {
    return Bare.versions
  }

  get env() {
    return env
  }

  get hrtime() {
    return hrtime
  }

  abort() {
    abort()
  }

  exit(code) {
    Bare.exit(code)
  }

  suspend() {
    Bare.suspend()
  }

  resume() {
    Bare.resume()
  }

  cwd() {
    return os.cwd()
  }

  chdir(directory) {
    os.chdir(directory)
  }

  kill(pid, signal) {
    os.kill(pid, signal)
  }

  uptime() {
    return Number(hrtime.bigint() - this._startTime) / 1e9
  }

  cpuUsage(previous) {
    return os.cpuUsage(previous)
  }

  threadCpuUsage(previous) {
    return os.threadCpuUsage(previous)
  }

  resourceUsage() {
    return os.resourceUsage()
  }

  availableMemory() {
    return os.availableMemory()
  }

  constrainedMemory() {
    return os.constrainedMemory()
  }

  memoryUsage() {
    return os.memoryUsage()
  }

  nextTick(cb, ...args) {
    queueMicrotask(cb.bind(null, ...args))
  }

  [Symbol.for('bare.inspect')]() {
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

module.exports = new Process()
