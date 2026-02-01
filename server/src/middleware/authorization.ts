import { Request, Response, NextFunction } from 'express';
import { settings } from '../lib/settings';

/**
 * Require authenticated user
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.auth) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};

/**
 * Require user to have at least one of the specified roles
 */
export const requireRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!req.auth.user.hasAnyRole(roles)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: roles,
      });
      return;
    }

    next();
  };
};

/**
 * Require user to have all of the specified roles
 */
export const requireAllRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!req.auth.user.hasAllRoles(roles)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        required: roles,
      });
      return;
    }

    next();
  };
};

/**
 * Require admin role
 */
export const requireAdmin = requireRoles(settings.authAdminGroup);
