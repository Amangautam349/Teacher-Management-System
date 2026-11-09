import pool from '../config/db.js';

export async function getDepartments(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT d.id, d.name, d.description, d.created_at,
              COUNT(t.id)::int AS teacher_count
       FROM departments d
       LEFT JOIN teachers t ON t.department_id = d.id
       GROUP BY d.id
       ORDER BY d.name`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getDepartment(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM departments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function createDepartment(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Department name is required.' });
    }

    const result = await pool.query(
      'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *',
      [name.trim(), description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateDepartment(req, res, next) {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      `UPDATE departments SET name = COALESCE($1, name), description = COALESCE($2, description)
       WHERE id = $3 RETURNING *`,
      [name, description, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteDepartment(req, res, next) {
  try {
    const result = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }
    res.json({ message: 'Department deleted.' });
  } catch (err) {
    next(err);
  }
}
