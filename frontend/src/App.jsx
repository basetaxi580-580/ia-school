import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faCircleCheck,
  faEnvelope,
  faFilter,
  faMagnifyingGlass,
  faSchool,
  faTrash,
  faUserGraduate,
  faUserPen,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { api } from './api';

const emptyStudent = () => ({
  studentCode: '',
  fullName: '',
  email: '',
  program: '',
  groupName: '',
  status: 'Activo',
  advisor: '',
  notes: '',
});

const statusOptions = ['Todos', 'Activo', 'Inactivo', 'Egresado'];

export default function App() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyStudent());
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = !term || [student.studentCode, student.fullName, student.email, student.program, student.groupName, student.advisor || '']
        .join(' ')
        .toLowerCase()
        .includes(term);
      const matchesStatus = statusFilter === 'Todos' || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  async function refresh() {
    try {
      setBusy(true);
      setError('');
      const [studentsData, summaryData] = await Promise.all([api.list(), api.summary()]);
      setStudents(studentsData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la información');
    } finally {
      setBusy(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setBusy(true);
      setError('');
      const payload = {
        ...form,
        studentCode: form.studentCode.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        program: form.program.trim(),
        groupName: form.groupName.trim(),
        advisor: form.advisor.trim(),
        notes: form.notes.trim(),
      };

      if (editingId) {
        await api.update(editingId, payload);
      } else {
        await api.create(payload);
      }

      setForm(emptyStudent());
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(err.message || 'No se pudo guardar el estudiante');
    } finally {
      setBusy(false);
    }
  }

  function edit(student) {
    setEditingId(student.id);
    setForm({
      studentCode: student.studentCode || '',
      fullName: student.fullName || '',
      email: student.email || '',
      program: student.program || '',
      groupName: student.groupName || '',
      status: student.status || 'Activo',
      advisor: student.advisor || '',
      notes: student.notes || '',
    });
  }

  async function remove(student) {
    if (!student.id) return;
    if (!window.confirm(`¿Eliminar a ${student.fullName}?`)) return;
    try {
      setBusy(true);
      setError('');
      await api.remove(student.id);
      await refresh();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el estudiante');
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setForm(emptyStudent());
    setEditingId(null);
    setError('');
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">IA</div>
          <div>
            <p>IA School</p>
            <span>ERP académico</span>
          </div>
        </div>

        <nav className="menu">
          <a href="#dashboard">
            <FontAwesomeIcon icon={faSchool} />
            <span>Dashboard</span>
          </a>
          <a href="#students">
            <FontAwesomeIcon icon={faUsers} />
            <span>Estudiantes</span>
          </a>
        </nav>

        <div className="side-card">
          <strong><FontAwesomeIcon icon={faBookOpen} /> Stack</strong>
          <span>React + Spring Boot + MongoDB</span>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Proyecto independiente</p>
            <h1>IA School</h1>
          </div>
          <div className="topbar-badges">
            <span><FontAwesomeIcon icon={faCircleCheck} /> API {busy ? 'trabajando' : 'lista'}</span>
            <span><FontAwesomeIcon icon={faEnvelope} /> Mongo conectado</span>
          </div>
        </header>

        <section id="dashboard" className="hero card">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h2>Control de estudiantes</h2>
            <p className="subtitle">
              Administra registros, filtra por estado y mantiene el CRUD conectado al backend y a Mongo.
            </p>
          </div>
          <div className="stats">
            <div><span>Total</span><strong>{summary?.totalStudents ?? students.length}</strong></div>
            <div><span>Activos</span><strong>{summary?.activeStudents ?? 0}</strong></div>
            <div><span>Egresados</span><strong>{summary?.graduatedStudents ?? 0}</strong></div>
            <div><span>Programas</span><strong>{summary?.distinctPrograms ?? 0}</strong></div>
          </div>
        </section>

        <section id="students" className="module-grid">
          <article className="card form-card">
            <div className="card-head">
              <h3>{editingId ? 'Editar estudiante' : 'Nuevo estudiante'}</h3>
              <span>{editingId ? 'Modo edición' : 'Captura rápida'}</span>
            </div>

            <form className="form" onSubmit={onSubmit}>
              <label>
                <span><FontAwesomeIcon icon={faUserPen} /> Código</span>
                <input value={form.studentCode} onChange={(e) => updateField('studentCode', e.target.value)} required placeholder="IA-001" />
              </label>
              <label>
                <span><FontAwesomeIcon icon={faUserGraduate} /> Nombre completo</span>
                <input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} required placeholder="Nombre del estudiante" />
              </label>
              <label>
                <span><FontAwesomeIcon icon={faEnvelope} /> Email</span>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required placeholder="correo@iaschool.mx" />
              </label>
              <div className="two-cols">
                <label>
                  <span><FontAwesomeIcon icon={faBookOpen} /> Programa</span>
                  <input value={form.program} onChange={(e) => updateField('program', e.target.value)} required placeholder="Ingeniería de IA" />
                </label>
                <label>
                  <span><FontAwesomeIcon icon={faUsers} /> Grupo</span>
                  <input value={form.groupName} onChange={(e) => updateField('groupName', e.target.value)} required placeholder="1A" />
                </label>
              </div>
              <div className="two-cols">
                <label>
                  <span><FontAwesomeIcon icon={faCircleCheck} /> Estatus</span>
                  <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                    <option>Egresado</option>
                  </select>
                </label>
                <label>
                  <span><FontAwesomeIcon icon={faUserPen} /> Asesor</span>
                  <input value={form.advisor} onChange={(e) => updateField('advisor', e.target.value)} placeholder="Nombre del asesor" />
                </label>
              </div>
              <label>
                <span><FontAwesomeIcon icon={faBookOpen} /> Notas</span>
                <textarea rows="3" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Observaciones"></textarea>
              </label>

              <div className="actions">
                <button className="primary" type="submit" disabled={busy}><FontAwesomeIcon icon={faCircleCheck} /> {editingId ? 'Actualizar' : 'Guardar'}</button>
                <button className="ghost" type="button" onClick={resetForm}><FontAwesomeIcon icon={faFilter} /> Limpiar</button>
              </div>
            </form>

            {error ? <p className="error">{error}</p> : null}
          </article>

          <article className="card list-card">
            <div className="card-head">
              <h3>Estudiantes</h3>
              <span>{filteredStudents.length} resultados</span>
            </div>

            <div className="filters">
              <label>
                <span><FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Código, nombre, email o programa" />
              </label>
              <label>
                <span><FontAwesomeIcon icon={faFilter} /> Filtrar por estado</span>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Programa</th>
                    <th>Estado</th>
                    <th>Grupo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.studentCode}</td>
                      <td>
                        <strong><FontAwesomeIcon icon={faUserGraduate} /> {student.fullName}</strong>
                        <div className="muted">{student.email}</div>
                      </td>
                      <td>{student.program}</td>
                      <td><span className="badge">{student.status}</span></td>
                      <td>{student.groupName}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="link" onClick={() => edit(student)}><FontAwesomeIcon icon={faUserPen} /> Editar</button>
                          <button type="button" className="link danger" onClick={() => remove(student)}><FontAwesomeIcon icon={faTrash} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!filteredStudents.length ? (
                    <tr>
                      <td colSpan="6" className="empty">No hay registros.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="card recent-card">
          <div className="card-head">
            <h3><FontAwesomeIcon icon={faSchool} /> Recientes</h3>
            <span>Últimos cambios</span>
          </div>
          <div className="recent-list">
            {(summary?.recentStudents || []).map((student) => (
              <div className="recent-item" key={student.id}>
                <strong><FontAwesomeIcon icon={faUserGraduate} /> {student.fullName}</strong>
                <span>{student.studentCode} · {student.program} · {student.status}</span>
              </div>
            ))}
            {!(summary?.recentStudents || []).length ? <p className="empty">Sin datos recientes.</p> : null}
          </div>
        </section>
      </main>
    </div>
  );
}
