import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>
            <center>
                <Link to = '/especialidades'>
                    <Button style={{marginRight: "10px"}}>especialidad</Button>
                    <Button style={{marginRight: "10px"}}>usuario</Button>
                    <Button style={{marginRight: "10px"}}>pacientes</Button>

                </Link>
            </center>
        </div>
    );
}

export default Header;