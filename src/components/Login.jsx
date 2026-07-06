import React from "react";
import { urlApi } from "../services/apirest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Login.css';

import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput
}
    from 'mdb-react-ui-kit';

class Login extends React.Component {
    //Codigo jacaScript
    state = {
        form: {
            "cedula": "",
            "password": ""
        }
    }

    manejadorOnchage = async (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.form)
    }

    manejadorLogin = () => {
        let url = urlApi + "auth/login";
        const {notificacion} = this.props;
        axios
            .post(url, this.state.form)
            .then(response => {
                if (response.data.message === "Inicio de sesión exitoso") {
                    localStorage.setItem("token", response.data.token)//Almacenar en un item el token
                    localStorage.setItem("idusuario", response.data.idusuario)//Almacenar en un item el token
                    this.props.navigate('/usuarios');//Navegamos al componente
                    notificacion(response.data.message, "success");
                } else {
                    notificacion(response.data.message, "warning");
                }
            })
            .catch(error => {
                if (error.response) {
                    notificacion(error.response.data.message, "error");
                } else if (error.request) {
                    notificacion("No se pudo conectar con el servidor", "warning");
                }
            })
    }

    render() {
        return (
            <MDBContainer className="my-5 gradient-form">

                <MDBRow>

                    <MDBCol col='6' className="mb-5">
                        <div className="d-flex flex-column ms-5">

                            <div className="text-center">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                    style={{ width: '185px' }} alt="logo" />
                                <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
                            </div>

                            <p>Please login to your account</p>


                            <MDBInput wrapperClass='mb-4' name='cedula' label='Email address' id='form1' type='email' onChange={this.manejadorOnchage} />
                            <MDBInput wrapperClass='mb-4' name='password' label='Password' id='form2' type='password' onChange={this.manejadorOnchage} />


                            <div className="text-center pt-1 mb-5 pb-1">
                                <button className="mb-4 w-100 gradient-custom-2" onClick={this.manejadorLogin}>Sign in</button>
                                <a className="text-muted" href="#!">Forgot password?</a>
                            </div>

                            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                                <p className="mb-0">Don't have an account?</p>
                                <MDBBtn outline className='mx-2' color='danger'>
                                    Danger
                                </MDBBtn>
                            </div>

                        </div>

                    </MDBCol>

                    <MDBCol col='6' className="mb-5">
                        <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">

                            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                <h4 class="mb-4">We are more than just a company</h4>
                                <p class="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                            </div>

                        </div>

                    </MDBCol>

                </MDBRow>

            </MDBContainer>
        );

    }
}
function ContenedorNavegacion(props) {
    let navigate = useNavigate();
    return <Login {...props} navigate={navigate} />
}

export default ContenedorNavegacion;