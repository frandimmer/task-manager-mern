import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/taskService';
import './TaskForm.css';

function CreateTask() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pendiente',
    priority: 'media',
    category: 'General',
    dueDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setLoading(true);

    try {
      await createTask(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <div className="form-header">
          <h2>Nueva Tarea</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Volver
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Terminar el proyecto"
              maxLength="100"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles de la tarea (opcional)"
              rows="4"
              maxLength="500"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pendiente">Pendiente</option>
                <option value="en-progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prioridad</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ej: Trabajo, Personal"
              />
            </div>

            <div className="form-group">
              <label>Fecha límite</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;