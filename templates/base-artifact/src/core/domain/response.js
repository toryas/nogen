export default class Response {
  constructor(statusCode, code, message, payload) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.payload = payload;
  }
  getStatusCode() {
    return this.statusCode;
  }
  getCode() {
    return this.code;
  }
  getMessage() {
    return this.message;
  }
  getPayload() {
    return this.payload;
  }

  getBody() {
    let body = {
      code: this.code,
      message: this.message
    }
    if (this.payload instanceof Error) {
      body.error = this.payload;
    } else {
      body.payload = this.payload
    }
    return body;
  }
  setStatusCode(statusCode) {
    this.statusCode = statusCode;
  }
  setCode(code) {
    this.code = code;
  }
  setMessage(message) {
    this.message = message;
  }
  setPayload(payload) {
    this.payload = payload;
  }

}
