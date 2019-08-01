const rp = require('request-promise')


class Poller {
  constructor(options, condition=this.defaultCondition, maxTries = 15, gap = 1000) {
    this.options = options
    this.condition = condition
    this.maxTries = maxTries
    this.gap = gap
  }

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  defaultCondition(response) {
    if(response.status === 'success' || response.status === 'error') {
      return true
    } else return false
  }

  async again() {
    await this.timeout(this.gap)
    const response = JSON.parse(await rp(this.options))
    return response
  }

  async poll() {
    while(this.maxTries--) {
      console.log(this.maxTries)
      const response = await this.again()
      console.log(response)
      if(this.condition(response)) {
        return response
      }
    }
  // TODO: Throw Timeout Error
  }
}

module.exports = Poller
