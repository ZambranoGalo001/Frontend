import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";

//import { SoloLetras } from '../../utils/validaciones';


const FormularioEspecialidad = ({ especialidadEditar, onClose, onGuardar, notificacion, abrirModal, datoForaneo, idForaneo }) => {

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    nombre_especialidad: '',
    descripcion_especialidad: '' 
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (especialidadEditar) {

      setForm({
        ...especialidadEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_hora_alquiler: especialidadEditar.fecha_hora_alquiler ? especialidadEditar.fecha_hora_alquiler.split('T')[0] : ''
        fecha_hora_alquiler: especialidadEditar.fecha_hora_alquiler
          ? especialidadEditar.fecha_hora_alquiler.slice(0, 16)
          : '',
        fecha_hora_devolucion: especialidadEditar.fecha_hora_devolucion
          ? especialidadEditar.fecha_hora_devolucion.slice(0, 16)
          : ''
      });
    } else {
      setForm({
        nombre_especialidad: '', descripcion_especialidad: ''
      });
    }

  }, [especialidadEditar]);

  useEffect(() => {
    // Si idForaneo tiene un valor real (no es vacío ni "0")
    if (idForaneo && idForaneo !== "0") {
      setForm(estadoAnterior => ({
        ...estadoAnterior,
        cliente_idcliente: idForaneo // Actualizamos el ID interno del formulario
      }));
    }
  }, [idForaneo]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    console.log(form);
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    // Determinar si es POST (crear) o PUT (editar)
    const method = especialidadEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = especialidadEditar
      ? urlApi + `especialidades/${especialidadEditar.idalquiler}`//Put
      : urlApi + 'especialidades';//Post

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(especialidadEditar ? 'Especialidad actualizado' : 'Especialidad registrado');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{especialidadEditar ? 'Editar Alquiler' : 'Nuevo Alquiler'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="text" name="nombres" value={form.nombres} onChange={handleChange}
            required maxLength="40"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Especialidad:</label>
          <input
            type="name" name="nombre_especialidad" value={form.nombre_especialidad} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Descripcion:</label>
          <input
            type="text" name="descripcion_especialidad" value={form.descripcion_especialidad} onChange={handleChange}
            required
            className="form-control"
          />
        </div>





        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEspecialidad;