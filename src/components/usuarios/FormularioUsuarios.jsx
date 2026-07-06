import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";
//import { SoloLetras } from '../../utils/validaciones';

const FormularioUsuarios = ({ usuarioAEditar, onClose, onGuardar, notificacion, abrirModal, datoForaneo, idForaneo }) => {

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    password: '',
    rol: '',
    correo: '',
    fecha_nacimiento: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (usuarioAEditar) {

      setForm({
        ...usuarioAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_hora_alquiler: usuarioAEditar.fecha_hora_alquiler ? usuarioAEditar.fecha_hora_alquiler.split('T')[0] : ''
        fecha_nacimiento: usuarioAEditar.fecha_nacimiento
          ? usuarioAEditar.fecha_nacimiento.slice(0, 16)
          : '',
        fecha_hora_devolucion: usuarioAEditar.fecha_hora_devolucion
          ? usuarioAEditar.fecha_hora_devolucion.slice(0, 16)
          : ''
      });
    } else {
      setForm({
        cedula: '', nombre: '', apellido: '', password: '', rol: '', correo: '', fecha_nacimiento: ''
      });
    }

  }, [usuarioAEditar]);

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
    const method = usuarioAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = usuarioAEditar
      ? urlApi + `usuarios/${usuarioAEditar.idusuario}`//Put
      : urlApi + 'usuarios';//Post

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(usuarioAEditar ? 'Usuario actualizado' : 'Usuario registrado');
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
      <h3>{usuarioAEditar ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Cedula:</label>
          <input
            type="text" name="cedula" value={form.cedula} onChange={handleChange}
            required maxLength="10"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text" name="nombre" value={form.nombre} onChange={handleChange}
            required maxLength={40}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text" name="apellido" value={form.apellido} onChange={handleChange}
            required maxLength={40}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password" name="password" value={form.password} onChange={handleChange}
            required maxLength={200}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Rol:</label>
          <input
            type="text" name="rol" value={form.rol} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Correo:</label>
          <input
            type="text" name="correo" value={form.correo} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha de nacimiento:</label>
          <input
            type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange}
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

export default FormularioUsuarios;