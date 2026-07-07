import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";


const FormularioPaciente = ({
  pacientesAEditar,
  onClose,
  onGuardar,
  notificacion,
  abrirModal,
  datoForaneo,
  idForaneo
}) => {

  // Estado inicial
  const [form, setForm] = useState({
    direccion_pac: '',
    telefono_pac: '',
    fk_idusuario: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Detectar edición
  useEffect(() => {

    if (pacientesAEditar) {

      setForm({
        ...pacientesAEditar,

        direccion_pac: pacientesAEditar.direccion_pac || '',
        telefono_pac: pacientesAEditar.telefono_pac || '',
        fk_idusuario: pacientesAEditar.fk_idusuario || ''
      });

    } else {

      setForm({
        direccion_pac: '',
        telefono_pac: '',
        fk_idusuario: localStorage.getItem('idusuario')
      });

    }

  }, [pacientesAEditar]);

  useEffect(() => {

    if (idForaneo && idForaneo !== "0") {

      setForm(estadoAnterior => ({
        ...estadoAnterior,
        fk_idusuario: idForaneo
      }));

    }

  }, [idForaneo]);

  // Capturar cambios
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    console.log(form);

  };

  // Guardar
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    const method = pacientesAEditar ? 'put' : 'post';

    const url = pacientesAEditar
      ? urlApi + `pacientes/${pacientesAEditar.idpaciente}`
      : urlApi + 'pacientes';

    try {

      await axios({
        method: method,
        url: url,
        data: form,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      notificacion(
        pacientesAEditar
          ? 'Paciente actualizado'
          : 'Paciente registrado'
      );

      onGuardar();
      onClose();

    } catch (err) {

      if (err.response && err.response.data) {

        setError(
          err.response.data.message || 'Error al guardar'
        );

      } else {

        setError('Ocurrió un error inesperado');

      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="formulario-container">

      <h3>
        {pacientesAEditar
          ? 'Editar Paciente'
          : 'Nuevo Paciente'}
      </h3>

      {error && (
        <p className="alert alert-danger">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        <div className="form-group">

          <label>Dirección:</label>

          <input
            type="text"
            name="direccion_pac"
            value={form.direccion_pac}
            onChange={handleChange}
            required
            className="form-control"
          />

        </div>

        <div className="form-group">

          <label>Teléfono:</label>

          <input
            type="text"
            name="telefono_pac"
            value={form.telefono_pac}
            onChange={handleChange}
            required
            className="form-control"
          />

        </div>

        

        <div
          className="botones-accion"
          style={{ marginTop: '15px' }}
        >

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>

  );

};

export default FormularioPaciente;