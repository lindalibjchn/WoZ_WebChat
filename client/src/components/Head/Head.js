import React from "react";
import { Link, Switch, Route } from 'react-router-dom';
import {Navbar, Nav,NavLink, NavDropdown, Form, FormControl, Button, Modal} from 'react-bootstrap';
import Informdoc from "../Informdoc/Informdoc";
import logo from "../../icons/tudublin.jpg"

import {deleteStorage, getFromStorage, setInStorage} from "../../utils/storage";

const ref = React.createRef();
const Head = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [inforModalShow, setInforModalShow] = React.useState(false);
    // const [nickName, setnickName] = React.useState("");

    const handleClose = ()=> setModalShow(false);
    const inforhandleClose = ()=> setInforModalShow(false);
    let nickName = getFromStorage('user_name')
    if (nickName === null){
        nickName = "";
    }
    return(
     <>
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href="/">Real-Time HAI Chat</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                {/*<Nav.Link href="/infor">Information</Nav.Link>*/}
                <Nav.Link eventKey="infor" onSelect={(selectedKey) => setInforModalShow(true)}>Experiment Information</Nav.Link>
                {/*<Nav.Link eventKey="consent" onSelect={(selectedKey) => setModalShow(true)}>Users Consent</Nav.Link>*/}
            </Nav>

            <Nav className="d-md-inline" >
                <Navbar.Text >
                    <a style={{display: (nickName !== "")? "block":"none"}}>Welcome {nickName['nickName']}</a> {' '}
                </Navbar.Text>
            </Nav>
            <Nav>
                <Nav.Link  as={Link} to="/">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/Signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/Logout">Log Out</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
     <Modal
         show={modalShow}
         onHide={handleClose}
         size="lg"
         aria-labelledby="contained-modal-title-vcenter"
         centered
     >
         <Modal.Header closeButton>
             <Modal.Title id="contained-modal-title-vcenter">
                 User Consent
             </Modal.Title>
         </Modal.Header>
         <Modal.Body>
             <Informdoc inform="consent"></Informdoc>
         </Modal.Body>
     </Modal>
{/*=====================================================================================================*/}
     <Modal
         show={inforModalShow}
         onHide={inforhandleClose}
         size="lg"
         aria-labelledby="contained-modal-title-vcenter"
         centered

     >
         <Modal.Header closeButton>
             <Modal.Title id="contained-modal-title-vcenter">
                 Experiment Information
             </Modal.Title>
         </Modal.Header>
         <Modal.Body>
             <Informdoc inform="inform"></Informdoc>
         </Modal.Body>
         <Modal.Footer>
             <Button onClick={inforhandleClose}>Close</Button>
         </Modal.Footer>
     </Modal>

         <Navbar collapseOnSelect bg="dark" variant="dark" fixed="bottom">
             <Navbar.Brand href="/">
                 <img
                 alt=""
                 src={logo}
                 width="70"
                 height="45"
                 // className="d-inline-block align-top"
             />{' '}</Navbar.Brand>
             <Navbar.Toggle />
             <Navbar.Collapse className="justify-content-end">
                 <Navbar.Text>
                        Contact: Na Li (TU Dublin) {' '}
                          Email: D19125334@mytudublin.ie
                 </Navbar.Text>
             </Navbar.Collapse>
         </Navbar>
     </>
    )
}
export default Head;