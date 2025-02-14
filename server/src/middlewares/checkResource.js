const checkResource = (Model) => async (req, res, next) => {
    try {
      const resource = await Model.findByPk(req.params.id);
      if (!resource) {
        const error = new Error('Ресурс не найден');
        error.name = 'NotFoundError';
        throw error;
      }
      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = checkResource;