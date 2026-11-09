/**
 * Catches anything passed to next(err) and returns a consistent JSON shape.
 * Keeps controllers free of repetitive try/catch error formatting.
 */
export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Something went wrong on the server.';

  // Postgres unique_violation
  if (err.code === '23505') {
    return res.status(409).json({ message: 'That record already exists.' });
  }

  res.status(status).json({ message });
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
}
