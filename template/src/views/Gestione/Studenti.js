import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Alert, TabPane } from 'reactstrap';
import { AppSidebarToggler } from '@coreui/react';
import axios from 'axios'
import { MDBDataTable, MDBBtn  } from 'mdbreact';
import InfoStudente from './InfoStudente'

//https://mdbootstrap.com/docs/react/tables/search/



//data="http://localhost:8080/listStudents"




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
          dateOfBirth: item.dateOfBirth,
          residence: item.residence,
          fiscalCode: item.fiscalCode,         
          hoursOfLessons: item.hoursOfLessons,
          percentage: item.percentage, 
          ritirato: item.ritirato,         
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

      const nonRitirato = this.state.studenti.filter(el => el.ritirato === 0)
      const ritirato = this.state.studenti.filter(el => el.ritirato === 1)

      if (ritirato != null)
        return (
          <div>
            <Card>
              <CardHeader >
                <div className="text-center font-weight-bold">STUDENTI</div>
              </CardHeader>
              <CardBody>
                <MDBDataTable
                  responsive
                  hover
                  data={{ columns: data.columns, rows: nonRitirato }}
                  searching={false}
                  paging={false}
                  noBottomColumns={true}
                // autoWidth={true}
                // refresh
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader >
                <div className="text-center font-weight-bold">STUDENTI  RITIRATI</div>
              </CardHeader>
              <CardBody>
                <MDBDataTable
                  responsive
                  hover
                  data={{ columns: data.columns, rows: ritirato }}
                  searching={false}
                  paging={false}
                  noBottomColumns={true}
                // autoWidth={true}
                // refresh
                />
              </CardBody>
            </Card>

          </div>
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
if(this.state.displayCard){
  return <InfoStudente studente={this.state.studenti.find((studente) => studente.email === this.state.displayCard)}  />
}else{
  return this.tabPane()
}
    return (
      <>
        <div>
            {this.tabPane()}   
        </div>
        );

      </>
    );
  }
}

export default Studenti;
