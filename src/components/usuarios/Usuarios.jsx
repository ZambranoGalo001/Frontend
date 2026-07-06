import React from "react";
import axios from "axios";
import { urlApi } from "../../services/apirest";
import { confirm } from "../Confirmation";
import FormularioUsuarios from "./FormularioUsuarios";
import Header from "../Header";

class Usuarios extends React.Component {
    state = {
        registros: [],
        pagina_actual: 1,
        cadena_busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        limite: 10,
        mostralModal: false,
        usuarioSeleccionado: null
    }
    

    mostrarModalNuevo = () => {
        this.setState({
            mostralModal: true,
            usuarioSeleccionado: null
        })
    }

    mostrarModalEditar = (id) => {
        this.setState({
            mostralModal: true,
            usuarioSeleccionado: id
        })
    }

    cerrarModal = () => {
        this.setState({mostralModal: false})
    }

    alGuardar = () => {
        this.cargarDatos();// Recargamos Datos
        this.cerrarModal();// Cerrar ventana modal
    }

    componentDidMount = () => {
        this.cargarDatos();
    }

    //Si hay muchos datos pasar a la siguiente/anterior página
    paginaSiguiente = () => {
        if (this.state.pagina_actual < this.state.total_paginas) {
            this.setState(
                { pagina_actual: this.state.pagina_actual + 1 },
                () => { this.cargarDatos(); }
            )
        }
    }
    paginaAnterior = () => {
        if (this.state.pagina_actual > 1) {
            this.setState(
                { pagina_actual: this.state.pagina_actual - 1 },
                () => { this.cargarDatos(); }
            )
        }
    }

    cargarDatos = () => {
        //Código que se ejecuta al cargar la página
        let url = urlApi + "usuarios?page=" + this.state.pagina_actual + "&string=" + this.state.cadena_busqueda + "&limit=" + this.state.limite;
        axios
            .get(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPage
                })
            })
            .catch(error => {
                const { notificacion } = this.props;
                notificacion(error);
            })
    }

    busqueda = async e => {
        if (e.charCode === 13) {
            this.setState({
                cadena_busqueda: e.target.value,
                pagina_actual: 1
            }, () => { this.cargarDatos() })
        }
    }

    eliminar = async (id, nombre) => {
        if (await confirm('¿Está seguro de eliminar el usuario = ' + nombre + "?")) {
            const { notificacion } = this.props;
            let url = urlApi + "usuarios/" + id;
            axios
                .delete(url, { headers: { 'Authorization': `Bearer ${this.state.token}` } })
                .then(response => {
                    notificacion("Registro eliminado");
                    this.componentDidMount();
                })
                .catch(error => {
                    notificacion(error.response.data.error || "Error al elminiar");
                })
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className='col-10 position-relative top-0 start-50 translate-middle-x'>
                    <h1>Usuarios</h1>
                    <button type="button" className="btn btn-primary" onClick={this.mostrarModalNuevo}>Nuevo Registro</button>
                    <input type="text" className="form-control mt-3" placeholder="Búsqueda por cedula, nombre y apellido" onKeyPress={this.busqueda} />
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">cedula</th>
                                <th scope="col">nombre</th>
                                <th scope="col">apellido</th>
                                <th scope="col">rol</th>
                                <th scope="col">correo</th>
                                <th scope="col">fecha_nacimiento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{value.idusuario}</th>
                                        <td>{value.cedula}</td>
                                        <td>{value.nombre}</td>
                                        <td>{value.apellido}</td>
                                        <td>{value.rol}</td>
                                        <td>{value.correo}</td>
                                        <td>{value.fecha_nacimiento}</td>
                                        <td>
                                            <svg
                                                onClick={() => this.mostrarModalEditar(value)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#5856d6"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                <path d="M16 5l3 3" />
                                            </svg>
                                            <svg
                                                onClick={() => this.eliminar(value.idusuario, value.nombre)}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#f70505e3"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                                <path d="M12 10l4 4m0 -4l-4 4" />
                                            </svg>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <button type="button" className="btn btn-secondary" onClick={this.paginaAnterior} style={{ marginRight: "10px" }}>Anterior</button>
                    <input type="text" readOnly value={this.state.pagina_actual + " de " + this.state.total_paginas} style={{ marginRight: "10px", textAlign: "center", width: "120px" }} />
                    <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiente}>Siguiente</button>
                </div>
                {this.state.mostralModal && (
                    <div className="modal-overlay" style={modalStyles.overlay}>
                        <div className="modal-content" style={modalStyles.content}>
                            <FormularioUsuarios 
                                usuarioAEditar={this.state.usuarioSeleccionado}
                                onClose={this.cerrarModal}
                                onGuardar={this.alGuardar}
                                notificacion={this.props.notificacion}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

//Estilos para ventana modal
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    content: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
}

export default Usuarios;