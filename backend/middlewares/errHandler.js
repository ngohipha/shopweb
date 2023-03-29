const notFound = (req, res ,next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(404)
    next(error)
}
const errHandle = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    if (!res.status) {
      return res.json({
        success: false,
        mes: error?.message
      })
    }
    return res.status(statusCode).json({
      success: false,
      mes: error?.message
    })
  }

module.exports = {
    notFound , errHandle
}