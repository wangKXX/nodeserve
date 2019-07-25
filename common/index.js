module.exports = {
  commonResp: (status, message, data) => {
    return {
      status,
      message,
      data
    }
  }
}