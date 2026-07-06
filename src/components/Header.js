import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <center>
                <Link to = '/usuarios'>
                    <Button style={{marginRight: "10px"}}>Usuarios</Button>
                </Link>
                <Link to = '/pacientes'>
                    <Button style={{marginRight: "10px"}}>Pacientes</Button>
                </Link>
                <Link to = '/especialidades'>
                    <Button style={{marginRight: "10px"}}>Especialidades</Button>
                </Link>
                <Link to = '/diagnosticos'>
                    <Button style={{marginRight: "10px"}}>Diagnosticos</Button>
                </Link>
                
            </center>
        </div>
    );
}

export default Header;