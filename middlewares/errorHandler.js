const errorHandler = (err, req, res, next) => {
  if (!err.statusCode) {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      // check the status and display a message based on it
      message: statusCode === 500 ? "An error occurred on the server" : message,
    });
  } else {
    console.error(err);
    res.status(err.statusCode).send({ message: err.message });
  }
};

module.exports = errorHandler;
