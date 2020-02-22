import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Alert, TabPane } from 'reactstrap';
import axios from 'axios'



const infoStudente = (props) => {
  const studente = props.studente

  
  function refreshPage() {
    window.location.reload(false);
  }

    return(
            <div>
               
              <Card>
            <Row>
                <Col className="text-left font-weight-bold m-5">
                <h5>Nome: </h5>
                <h5>Cognome: </h5>
                <h5>Email: </h5>
                <h5>Residenza: </h5>
                <h5>Data di nascita: </h5>     
                <h5>Codice fiscale: </h5>
                </Col>
                <Col className="m-5">
                <h5>{studente.firstName}</h5>
                <h5>{studente.lastName}</h5>
                <h5>{studente.email}</h5>
                <h5>{studente.residence}</h5>
                <h5>{studente.dateOfBirth}</h5>
                <h5>{studente.fiscalCode}</h5>
  
                </Col>
            </Row>
            <button className="btn btn-outline-primary" onClick={refreshPage}> Indietro</button>
            </Card>
            </div>
    )
  }

  export default infoStudente