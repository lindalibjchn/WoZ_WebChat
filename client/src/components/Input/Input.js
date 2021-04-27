import React from "react";
import './Input.css';
// import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Form, Button,Container,Col,Row } from "react-bootstrap";

const Input =({message, setMessage, sendMessage})=>(
    <Container>
       <Row>
           <Col>
              <input className= "input" type="text" placeholder="Type a message..."
                     value={message}
                     onChange={(event) =>setMessage(event.target.value)}
                     onKeyPress={(event)=>event.key === 'Enter'?sendMessage(event) : null}
              />
               <Button className="sendButton" onClick={(event)=>sendMessage(event)}>Send</Button>
           </Col>
       </Row>
    </Container>
)

export default Input;