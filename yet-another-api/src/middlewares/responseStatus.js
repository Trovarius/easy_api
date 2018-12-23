module.exports = (options) => (req, res, next) => {
  const responseStatus = (statusCode) => (data) => res.status(statusCode).json(data);

  req.ok = responseStatus(200);
  req.created = responseStatus(201);
  req.accepted = responseStatus(202);
  req.noContent = responseStatus(204);
  req.resetContent = responseStatus(205);
  req.partialContent = responseStatus(206);

  req.multipleChoices = responseStatus(300);
  req.notModified = responseStatus(304);

  req.badRequest = responseStatus(400);
  req.unauthorized = responseStatus(401);
  req.paymentRequired = responseStatus(402);
  req.forbidden = responseStatus(403);
  req.notfound = responseStatus(404);
  req.methodNotAllowed = responseStatus(405);
  req.notAcceptable = responseStatus(406);
  req.requestTimeout = responseStatus(408);
  req.lengthRequired = responseStatus(411);
  req.tooManyRequests = responseStatus(429);

  req.internalServerError = responseStatus(500);
  req.notImplemented = responseStatus(501);
  req.badGateway = responseStatus(502);
  req.serviceUnavailable = responseStatus(503);
  req.gatewayTimeout = responseStatus(504);
}