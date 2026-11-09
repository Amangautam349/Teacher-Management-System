import pool from '../config/db.js';

/**
 * GET /api/dashboard/summary
 * Powers the dashboard's top-row stat cards.
 * Kept as one endpoint with parallel queries rather than 4 round trips.
 */
export async function getSummary(req, res, next) {
  try {
    const [teachers, departments, onLeaveToday, pendingLeaves] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM teachers'),
      pool.query('SELECT COUNT(*)::int AS count FROM departments'),
      pool.query(
        `SELECT COUNT(*)::int AS count FROM attendance
         WHERE date = CURRENT_DATE AND status = 'on_leave'`
      ),
      pool.query(`SELECT COUNT(*)::int AS count FROM leave_requests WHERE status = 'pending'`),
    ]);

    res.json({
      totalTeachers: teachers.rows[0].count,
      totalDepartments: departments.rows[0].count,
      onLeaveToday: onLeaveToday.rows[0].count,
      pendingLeaveRequests: pendingLeaves.rows[0].count,
    });
  } catch (err) {
    next(err);
  }
}
