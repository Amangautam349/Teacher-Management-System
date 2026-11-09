import { Router } from 'express';
import {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teacherController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

// Teachers can view the directory; only admins can view another
// teacher's full record is the same endpoint for now (MVP) —
// tighten this later if you want teachers restricted to their own profile.
router.get('/', getTeachers);
router.get('/:id', getTeacher);

router.post('/', requireRole('super_admin'), createTeacher);
router.put('/:id', requireRole('super_admin'), updateTeacher);
router.delete('/:id', requireRole('super_admin'), deleteTeacher);

export default router;
