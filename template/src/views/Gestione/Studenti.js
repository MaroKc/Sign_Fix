import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Alert, TabPane } from 'reactstrap';
import { AppSidebarToggler } from '@coreui/react';
import axios from 'axios'
import { MDBDataTable, MDBBtn  } from 'mdbreact';


//https://mdbootstrap.com/docs/react/tables/search/



//data="http://localhost:8080/listStudents"
// const App = (props) => {

// const studente = props.studenti 
// const getStudents = () => {
//     return(<Studenti />)
// }
//   return(
//           <div>
//             {console.log(studente.email)}
//             <Card>
//           <Row>
//               <Col className="text-left font-weight-bold m-5">
//               <h5>Nome: </h5>
//               <h5>Cognome: </h5>
//               <h5>Email: </h5>
//               <h5>Residenza: </h5>
//               <h5>Percentuale: </h5>     
//               <h5>hoursOfLessons: </h5>
   
//               </Col>
//               <Col className="m-5">

//               <h5>{studente.firstName}</h5>
//               <h5>{studente.lastName}</h5>
//               <h5>{studente.email}</h5>
//               <h5>{studente.residence}</h5>
//               <h5>{studente.percentage}</h5>
//               <h5>{studente.hoursOfLessons}</h5>

//               </Col>
//           </Row>
//           <button className="btn btn-outline-primary" onClick={getStudents()}> Indietro</button>
//           </Card>
//           </div>
//   )
// }

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


class Studenti extends Component {
  constructor(props){
    super(props)
    this.state = {
      studenti: [],
      displayCard: false
    }

  }


  
  componentDidMount() {
    this.getStudents();
  }

  getStudents = () => {
    axios.get('http://localhost:8080/listStudents')
      .then(res => res.data)
      .then((data, index) => {
        const studenti = [];
        data.map(item => studenti.push({
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          residence: item.residence,
          hoursOfLessons: item.hoursOfLessons,
          percentage: item.percentage,
          clickEvent: () => this.displayCard(item.email)
        }));

        this.setState({ studenti });
      })
      .catch(err => console.error(err));
  }

  
  tabPane() {
    const DatatablePage = () => {
      const data = {
        columns: [
          {
            label: 'Nome',
            field: 'firstName',
          },
          {
            label: 'Cognome',
            field: 'lastName',
          },
          {
            label: 'Email',
            field: 'email',
          },
           {
           label: 'Ore totali',
           field: 'hoursOfLessons',
           },
           {
           label: '% Ore totali',
           field: 'percentage',
           },
        ],
        rows: this.state.studenti,
      };

    return (
    <MDBDataTable 
    responsive
    hover 
    data={{ columns: data.columns, rows: data.rows }}
    searching={false}
    paging={false}
    noBottomColumns={true}
    // autoWidth={true}
    // refresh
    />
    );
  }
  return (
  <>
      {DatatablePage()}
  </>
  )
}


  displayCard = () => {
    this.setState({
      displayCard: !this.state.displayCard
    });

  }

  render() {
  


    if (this.state.displayCard) {
      
      return(
      
      <App key={this.state.studenti.find(item => item.email)} studenti={this.state.studenti.find(item => item.email)} />
      )}

    return (
      <>
        <Card>
          <CardHeader >
            <div className="text-center font-weight-bold">STUDENTI</div>
          </CardHeader>
          <CardBody>
          {this.tabPane()}
          </CardBody>
      </Card>
      </>
    );
  }
}

export default Studenti;
