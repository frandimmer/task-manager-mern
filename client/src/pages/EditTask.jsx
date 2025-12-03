import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTask, updateTask } from '../services/taskService';
import './TaskForm.css';

function EditTask() {
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
  const [loadingTask, setLoadingTask] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const task = await getTask(id);
      
      // Formatear la fecha para el input tipo date
      let formattedDate = '';
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        formattedDate = date.toISOString().split('T')[0];
      }

      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        category: task.category || 'General',
        dueDate: formattedDate
      });
    } catch (error) {
      console.error('Error al cargar tarea:', error);
      setError('Error al cargar la tarea');
    } finally {
      setLoadingTask(false);
    }
  };

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
      await updateTask(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTask) {
    return (
      <div className="loading-container">
        <div className="loading">Cargando tarea...</div>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <div className="form-header">
          <h2>Editar Tarea</h2>
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;