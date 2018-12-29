const events = require('events');
const uuidv1 = require('uuid/v1');

class CustomtEmitter extends events.EventEmitter {
  constructor() {
    super();
    this.events = [];
  }

  buildEvent(event, params) {
    return {
      id: uuidv1(),
      type: event,
      timestamp: new Date(),
      data: params || {},
      result: null
    }
  }

  dispatch(
    name,
    params
  ) {
    let event = this.buildEvent(name, params);

    this.events.push(event);

    return new Promise((resolve, reject) => {

      this.emit(name, event);

      if (event.result.error)
        return reject(event.result.error)

      return resolve(event.result);
    })
  }

  register({
    name,
    action
  }) {

    this.on(name, (event) => {
      try {
        event.result = action(event.data);
      } catch (error) {
        event.result = {
          error
        }
      }
    })
  }
}

const $event = new CustomtEmitter();

module.exports = {
  $event
}