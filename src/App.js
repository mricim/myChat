import React, { useState } from "react";

import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { Row, Col } from "react-bootstrap";

import "./App.css";

const ExampleToast = ({ children }) => {
  const [show, toggleShow] = useState(true);

  return (
    <Toast show={show} onClose={() => toggleShow(!show)}>
      <Toast.Header>
        <strong className="mr-auto">React-Bootstrap</strong>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};

const App = () => (
  <Container className="p-3">
    <Container className="p-5 mb-4 bg-light rounded-3">
      <h1 className="header">Welcome To React-Bootstrap</h1>
      <ExampleToast>
        We now have Toasts
        <span role="img" aria-label="tada">
          🎉
        </span>
      </ExampleToast>
      <Button
        onClick={() =>
          window.open("https://github.com/mricim/myChat", "_blank")
        }
      >
        GitHub
      </Button>
    </Container>

    <Container className="p-5 mb-4 bg-light rounded-3">
         <Form>
            <Form.Group className="mb-3" controlId="formBasicId">
               <Form.Label>Id</Form.Label>
               <Form.Control id="id" type="number" placeholder="Enter id" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicName">
               <Form.Label>Name</Form.Label>
               <Form.Control id="name" type="string" placeholder="Enter name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicAge">
               <Form.Label>Age</Form.Label>
               <Form.Control id="age" type="string" placeholder="Enter age" />
            </Form.Group>
            <Button variant="primary" type="button" onClick={WebSocketTest}>
               Submit
            </Button>
         </Form>

      </Container>

      <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="2">
          <ListGroup defaultActiveKey="#link1" id="userslist">
            <ListGroup.Item action href="#link0">
              Link 0
            </ListGroup.Item>
            <ListGroup.Item action href="#link1">
              Link 1
            </ListGroup.Item>
            <ListGroup.Item action href="#link2" disabled>
              Link 2
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  </Container>
);

function listarUsuarios() {
  if ("WebSocket" in window) {
     // Let us open a web socket
     var ws = new WebSocket("wss://3063ffz2de.execute-api.eu-central-1.amazonaws.com/sandbox");

     ws.onopen = function () {


        // Web Socket is connected, send data using send()
        ws.send(`{"action":"users"}`);
     };

     ws.onmessage = function (event) {
        var received_msg = event.data;

        var listaUsuarios = JSON.parse(received_msg);
        document.getElementById("userslist").innerHTML = ''
        for (let index = 0; index < listaUsuarios.length; index++) {
           document.getElementById("userslist").innerHTML += `<li class="list-group-item" href="#link0" >${Object.values(listaUsuarios[index])[4]}</li>`
           
           //<ListGroup.Item action href="#link0" >${Object.values(listaUsuarios[index])[4]}</ListGroup.Item>
           //`<div>${Object.values(listaUsuarios[index])[4]}</div>`
        }
        //console.log(listaUsuarios[0][usuername])
        //console.log(Object.values(listaUsuarios[0])[4])
     };

     ws.onclose = function () {

        // websocket is closed.
        alert("Connection is closed...");
     };

  } else {

     // The browser doesn't support WebSocket
     alert("WebSocket NOT supported by your Browser!");
  }

}

function WebSocketTest() {
  console.log("entro a la function")
  if ("WebSocket" in window) {


     // Let us open a web socket
     var ws = new WebSocket("wss://3063ffz2de.execute-api.eu-central-1.amazonaws.com/sandbox");

     ws.onopen = function () {


        // Web Socket is connected, send data using send()
        ws.send(`{"action":"user", "userid": "${document.getElementById("id").value}", "username": "${document.getElementById("name").value}", "userage": "${document.getElementById("age").value}"}`);
        alert("Message is sent...");
     };

     ws.onmessage = function (event) {
        var received_msg = event.data;
        alert("Message is received..." + received_msg);
     };

     ws.onclose = function () {

        // websocket is closed.
        //alert("Connection is closed...");
     };
     listarUsuarios()
  } else {

     // The browser doesn't support WebSocket
     alert("WebSocket NOT supported by your Browser!");

  }
}

listarUsuarios()
export default App;
