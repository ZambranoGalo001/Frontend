import logo from './logo.svg';
import './css/App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Usuarios from './components/usuarios/Usuarios';
import Pacientes from './components/pacientes/Pacientes';


class App extends React.Component {

  notificacion(mensaje, tipo = 'info', duracion = 2500) {
    let container = document.querySelector('.notif-container');//Accedo al contenedor
    const notif = document.createElement('div');//Crear un elemento de la notifacion
    notif.className = `notif-toast ${tipo}`;// agrego clases al elemento
    notif.innerText = mensaje;//Agrego mensaje al elemento
    container.appendChild(notif);//agregamos el elemento al contenedor
    requestAnimationFrame(() => {//Activar animación de entrada
      requestAnimationFrame(() => {
        notif.classList.add('show');//Mostramos la notificación
      });
    });
    setTimeout(() => {
      notif.classList.remove('show');
      notif.classList.add('fade-out');
      notif.addEventListener('transitionend', () => {
        notif.remove(); //eliminar el elemento
      });
    }, duracion);
  };

  render() {
    return (
      <div className="App">
        <div className='notif-container'></div>
        <Router>
          <Routes>
            <Route path='/' element={<Login notificacion={this.notificacion} />} />
            <Route path='/usuarios' element={<Usuarios notificacion={this.notificacion} />}></Route>
            <Route path='/pacientes' element={<pacientes notificacion={this.notificacion} />}></Route>
          </Routes>
        </Router>
      </div>
    );
  };
}

export default App;
