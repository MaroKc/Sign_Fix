import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import axios from 'axios'
import { MDBDataTable, MDBBtn } from 'mdbreact';
import InfoDocente from './InfoDocente';

//https://mdbootstrap.com/docs/react/tables/search/

class Docenti extends Component {
  constructor(props) {
    super(props)
    this.state = {
      docenti: [],
      dettagliDocente: [],
      displayCard: null
    }
  }

  componentDidMount() {
    this.getTeachers();
    this.teacherDetails();
  }

  getTeachers = () => {
    axios.get('http://localhost:8080/listTeachers')
      .then(res => res.data)
      .then((data, index) => {
        const docenti = [];
        data.map(item => docenti.push({
          firstName: item.first_name,
          lastName: item.last_name,
          emailDocente: item.email_responsible,
          companiesId: item.companies_id,
          ritirato: item.ritirato,
          clickEvent: () => this.displayCard(item.companies_id)
        }));
        this.setState({ docenti });
      })
      .catch(err => console.error(err));
  }

teacherDetails = () => {
  axios.get('http://localhost:8080/teachersDetails')
      .then(res => {
      const dettagli = res.data;
      var dettagliDocente = [];
      dettagli.map(item =>
          dettagliDocente.push({
              companyName: item.company_name,
              lessonName: item.lesson,
              totalHours: item.total_hours,
              companyId: item.company_id
          })
      );
      this.setState({dettagliDocente: dettagliDocente})

      })
      .catch(err => console.error(err));
  }


  displayCard = (e) => {
    this.setState({
      displayCard: e
    });
  }

  displayTable = () => {
    this.setState({
      displayCard: null
    })
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
            field: 'emailDocente',
          }
        ],
        rows: this.state.docenti
      };

      const nonRitirato = this.state.docenti.filter(el => el.ritirato === 0)
      const ritirato = this.state.docenti.filter(el => el.ritirato === 1)
    
      if (ritirato != 0) {
        return (
          <div>
          <Card>
            <CardHeader >
              <div className="text-center font-weight-bold">DOCENTI</div>
            </CardHeader>
            <CardBody className="ml-4 mr-4">
              <MDBDataTable
                responsive
                hover
                data={{ columns: data.columns, rows: nonRitirato }}
                searching={false}
                paging={false}
                noBottomColumns={true}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader >
              <div className="text-center font-weight-bold">DOCENTI ARCHIVIATI</div>
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
      } else {
        return (
          <div>
            <Card>
              <CardHeader >
                <div className="text-center font-weight-bold">DOCENTI</div>
              </CardHeader>
              <CardBody>
                <MDBDataTable
                  responsive
                  hover
                  data={{ columns: data.columns, rows: nonRitirato }}
                  searching={false}
                  paging={false}
                  noBottomColumns={true}
                />
              </CardBody>
            </Card>
          </div>
        )
      }
    }
    if(this.state.displayCard){
      return <InfoDocente docente={this.state.docenti.find((docente) => docente.companiesId === this.state.displayCard)} details={this.state.dettagliDocente.find((docente) => docente.companyId === this.state.displayCard)} getTeachers={this.getTeachers} displayTable={this.displayTable}/>
    }else{
      return (
        <>
          {DatatablePage()}
        </>
      )
    }
  }

  render() {
    return this.tabPane()
  }
}

export default Docenti;