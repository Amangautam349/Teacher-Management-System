import { Router } from 'express';
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.post('/', requireRole('super_admin'), createDepartment);
router.put('/:id', requireRole('super_admin'), updateDepartment);
router.delete('/:id', requireRole('super_admin'), deleteDepartment);

export default router;
