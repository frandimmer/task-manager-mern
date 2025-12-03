import React from 'react';
import './TaskItem.css';

function TaskItem({ task, onDelete, onEdit, onToggleStatus }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return '#e74c3c';
      case 'media': return '#f39c12';
      case 'baja': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada': return '#27ae60';
      case 'en-progreso': return '#3498db';
      case 'pendiente': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-AR');
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-badges">
          <span 
            className="badge priority" 
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>
          <span 
            className="badge status" 
            style={{ backgroundColor: getStatusColor(task.status) }}
          >
            {task.status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className="task-category">📁 {task.category}</span>
        {task.dueDate && (
          <span className="task-date">📅 {formatDate(task.dueDate)}</span>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task._id)} className="btn-edit">
          Editar
        </button>
        <button onClick={() => onDelete(task._id)} className="btn-delete">
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default TaskItem;