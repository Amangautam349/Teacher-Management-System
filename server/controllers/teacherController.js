import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const TEACHER_SELECT = `
  SELECT
    t.id, t.employee_code, t.phone, t.designation, t.qualification,
    t.joining_date, t.photo_url, t.address,
    u.id AS user_id, u.full_name, u.email, u.is_active,
    d.id AS department_id, d.name AS department_name
  FROM teachers t
  JOIN users u ON u.id = t.user_id
  LEFT JOIN departments d ON d.id = t.department_id
`;

function shapeTeacher(row) {
  return {
    id: row.id,
    employeeCode: row.employee_code,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    designation: row.designation,
    qualification: row.qualification,
    joiningDate: row.joining_date,
    photoUrl: row.photo_url,
    address: row.address,
    isActive: row.is_active,
    department: row.department_id
      ? { id: row.department_id, name: row.department_name }
      : null,
  };
}

export async function getTeachers(req, res, next) {
  try {
    const { department_id, search } = req.query;
    const conditions = [];
    const params = [];

    if (department_id) {
      params.push(department_id);
      conditions.push(`t.department_id = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(u.full_name ILIKE $${params.length} OR t.employee_code ILIKE $${params.length})`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `${TEACHER_SELECT} ${where} ORDER BY u.full_name`,
      params
    );

    res.json(result.rows.map(shapeTeacher));
  } catch (err) {
    next(err);
  }
}

export async function getTeacher(req, res, next) {
  try {
    const result = await pool.query(`${TEACHER_SELECT} WHERE t.id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.json(shapeTeacher(result.rows[0]));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/teachers
 * Admin-only. Creates the login (users) row and the profile
 * (teachers) row together, in one transaction — either both
 * succeed or neither does.
 */
export async function createTeacher(req, res, next) {
  const client = await pool.connect();
  try {
    const {
      fullName, email, password, employeeCode,
      departmentId, phone, designation, qualification,
      joiningDate, address,
    } = req.body;

    if (!fullName || !email || !password || !employeeCode) {
      return res.status(400).json({
        message: 'fullName, email, password, and employeeCode are required.',
      });
    }

    await client.query('BEGIN');

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await client.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, 'teacher') RETURNING id`,
      [fullName.trim(), email.toLowerCase().trim(), passwordHash]
    );
    const userId = userResult.rows[0].id;

    const teacherResult = await client.query(
      `INSERT INTO teachers
        (user_id, department_id, employee_code, phone, designation, qualification, joining_date, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [userId, departmentId || null, employeeCode.trim(), phone || null, designation || null,
       qualification || null, joiningDate || null, address || null]
    );

    await client.query('COMMIT');

    const full = await pool.query(`${TEACHER_SELECT} WHERE t.id = $1`, [teacherResult.rows[0].id]);
    res.status(201).json(shapeTeacher(full.rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

export async function updateTeacher(req, res, next) {
  try {
    const {
      fullName, departmentId, phone, designation,
      qualification, joiningDate, address, isActive,
    } = req.body;

    const teacherCheck = await pool.query('SELECT user_id FROM teachers WHERE id = $1', [req.params.id]);
    if (teacherCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    const userId = teacherCheck.rows[0].user_id;

    if (fullName !== undefined || isActive !== undefined) {
      await pool.query(
        `UPDATE users SET
           full_name = COALESCE($1, full_name),
           is_active = COALESCE($2, is_active),
           updated_at = NOW()
         WHERE id = $3`,
        [fullName, isActive, userId]
      );
    }

    await pool.query(
      `UPDATE teachers SET
         department_id = COALESCE($1, department_id),
         phone = COALESCE($2, phone),
         designation = COALESCE($3, designation),
         qualification = COALESCE($4, qualification),
         joining_date = COALESCE($5, joining_date),
         address = COALESCE($6, address),
         updated_at = NOW()
       WHERE id = $7`,
      [departmentId, phone, designation, qualification, joiningDate, address, req.params.id]
    );

    const full = await pool.query(`${TEACHER_SELECT} WHERE t.id = $1`, [req.params.id]);
    res.json(shapeTeacher(full.rows[0]));
  } catch (err) {
    next(err);
  }
}

export async function deleteTeacher(req, res, next) {
  try {
    // ON DELETE CASCADE on teachers.user_id means deleting the user
    // removes the teacher row too — so we delete via the users table.
    const teacherCheck = await pool.query('SELECT user_id FROM teachers WHERE id = $1', [req.params.id]);
    if (teacherCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [teacherCheck.rows[0].user_id]);
    res.json({ message: 'Teacher deleted.' });
  } catch (err) {
    next(err);
  }
}
