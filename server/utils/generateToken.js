import jwt from 'jsonwebtoken';

/**
 * Signs a JWT carrying just enough to identify + authorize the user.
 * Keep the payload small — anything else should be fetched from the DB.
 */
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
