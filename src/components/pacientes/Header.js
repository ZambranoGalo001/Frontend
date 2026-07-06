import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";




function Header() {
    return (
        <div>
            <center>
                <Link to = '/Pacientes'>
                    <Button style={{marginRight: "10px"}}>pacientes</Button>
                </Link>
                <Link to = './usuarios'>
                    <Button style={{marginRight: "10px"}}>usuarios</Button>
                </Link>
                <Link to = '/especialidades'>
                    <Button style={{marginRight: "10px"}}>especialidades</Button>
                </Link>
            </center>
        </div>
    );
}

export default Header;