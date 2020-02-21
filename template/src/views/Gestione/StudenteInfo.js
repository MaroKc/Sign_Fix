
import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';




class StudenteInfo extends Component {
constructor(props){
    super(props)
}
  render() {

    const studente = this.props.studenti.find( info => info.email === this.props.match.params.email)
    console.log(this.props.studenti)
    const studenteInfo = studente ? Object.entries(studente) : [['email', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User id: {this.props.match.params.email}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        studenteInfo.map(([key, value]) => {
                          return (
                            <tr key={key}>
                              <td>{`${key}:`}</td>
                              <td><strong>{value}</strong></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}


export default StudenteInfo;



class klj extends React.Component {

    render() {
        const studente = this.props.studenti.find(item => item.id === Number(this.props.match.params.id))
        return (
            <div>
                {console.log(studente.email)}
                <Card>
                    <Row>
                        <Col className="text-left font-weight-bold">
                            <h5>Nome: </h5>
                            <h5>Cognome: </h5>
                            <h5>Email: </h5>
                            <h5>Residenza: </h5>
                            <h5>percentage: </h5>
                            <h5>hoursOfLessons:</h5>
                        </Col>
                        <Col>
                            <p>{studente.firstName}</p>
                            <p>{studente.lastName}</p>
                            <p>{studente.email}</p>
                            <p>{studente.residence}</p>
                            <p>{studente.percentage}</p>
                            <p>{studente.hoursOfLessons}</p>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}


