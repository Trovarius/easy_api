module.exports = (options) => (req, res, next) => {
  const responseStatus = (statusCode) => (data) => res.status(statusCode).json(data);

  res.ok = responseStatus(200);
  res.created = responseStatus(201);
  res.accepted = responseStatus(202);
  res.noContent = responseStatus(204);
  res.resetContent = responseStatus(205);
  res.partialContent = responseStatus(206);

  res.multipleChoices = responseStatus(300);
  res.notModified = responseStatus(304);

  res.badRequest = responseStatus(400);
  res.unauthorized = responseStatus(401);
  res.paymentRequired = responseStatus(402);
  res.forbidden = responseStatus(403);
  res.notfound = responseStatus(404);
  res.methodNotAllowed = responseStatus(405);
  res.notAcceptable = responseStatus(406);
  res.requestTimeout = responseStatus(408);
  res.lengthRequired = responseStatus(411);
  res.tooManyRequests = responseStatus(429);

  res.internalServerError = responseStatus(500);
  res.notImplemented = responseStatus(501);
  res.badGateway = responseStatus(502);
  res.serviceUnavailable = responseStatus(503);
  res.gatewayTimeout = responseStatus(504);

  next();
}