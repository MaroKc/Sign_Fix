import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row} from 'reactstrap';
import axios from 'axios'
import { MDBDataTable } from 'mdbreact';


//https://mdbootstrap.com/docs/react/tables/search/

const App = (props) => {
const studente = props.item

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
              <h5>Percentuale: </h5>     
              <h5>hoursOfLessons: </h5>
   
              </Col>
              <Col className="m-5">

              <h5>{studente.firstName}</h5>
              <h5>{studente.lastName}</h5>
              <h5>{studente.email}</h5>
              <h5>{studente.residence}</h5>
              <h5>{studente.percentage}</h5>
              <h5>{studente.hoursOfLessons}</h5>

              </Col>
          </Row>
          <button className="btn btn-outline-primary" onClick={refreshPage}> Indietro</button>
          </Card>
          </div>
  )
}

class Studenti extends Component {
  constructor(props){
    super(props)
    this.state = {
      studenti: [],
      displayCard: null
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
    data={data}
    searching={false}
    paging={false}
    noBottomColumns
    striped
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

  displayCard = (e) => {
    this.setState({
      displayCard: e
    });
  }

  render() {

    if (this.state.displayCard) {  
      return(
        <div>
      <App item={this.state.studenti.find((item) => item.email === this.state.displayCard)} />
      </div>
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
