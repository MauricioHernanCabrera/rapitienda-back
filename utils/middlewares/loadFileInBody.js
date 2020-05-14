module.exports = function loadFileInBody(name) {
  return function(req, res, next) {
    if (req.file) {
      req.body[name] = req.file.path;
    }
    next();
  };
};
