import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/taskService';
import { logout } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import TaskItem from '../components/TaskItem';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la tarea');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/editar-tarea/${id}`);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'todas') return true;
    return task.status === filter;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Mis Tareas</h1>
          <div className="header-actions">
            <span className="user-name">Hola, {user?.name}</span>
            <button onClick={handleLogout} className="btn-secondary">
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <h2>No tenés tareas todavía</h2>
            <p>Empezá creando tu primera tarea</p>
            <button onClick={() => navigate('/crear-tarea')} className="btn-create-large">
              Crear primera tarea
            </button>
          </div>
        ) : (
          <>
            <div className="filters">
              <button 
                className={filter === 'todas' ? 'active' : ''} 
                onClick={() => setFilter('todas')}
              >
                Todas ({tasks.length})
              </button>
              <button 
                className={filter === 'pendiente' ? 'active' : ''} 
                onClick={() => setFilter('pendiente')}
              >
                Pendientes ({tasks.filter(t => t.status === 'pendiente').length})
              </button>
              <button 
                className={filter === 'en-progreso' ? 'active' : ''} 
                onClick={() => setFilter('en-progreso')}
              >
                En Progreso ({tasks.filter(t => t.status === 'en-progreso').length})
              </button>
              <button 
                className={filter === 'completada' ? 'active' : ''} 
                onClick={() => setFilter('completada')}
              >
                Completadas ({tasks.filter(t => t.status === 'completada').length})
              </button>
            </div>

            <div className="tasks-list">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task._id} 
                  task={task} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="no-tasks-filtered">
                  <p>No hay tareas en esta categoría</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate('/crear-tarea')} 
              className="btn-add-task"
            >
              + Agregar nueva tarea
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;