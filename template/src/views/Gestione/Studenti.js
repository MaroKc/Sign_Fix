import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import axios from 'axios'
import { MDBDataTable } from 'mdbreact';
import InfoStudente from './InfoStudente'


class Studenti extends Component {
  constructor(props) {
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
    axios.get('http://localhost:8080/listStudents/'+this.props.classe["id"])
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
          hoursOfLessons: this.formatHours(item.hoursOfLessons),
          percentage: item.percentage,
          ritirato: item.ritirato,
          clickEvent: () => this.displayCard(item.email)
        }));
        this.setState({ studenti });
      })
      .catch(err => console.error(err));
  }

  formatHours (hours){
    var startLessonAppoggio= (hours.toString()).split('.')
    var startLesson= ''

    if(startLessonAppoggio[1]){
      var startLessonSecondaParte=  startLessonAppoggio[1].length == 1 ? startLessonAppoggio[1]+'0' :  startLessonAppoggio[1]
      startLesson= startLessonAppoggio[0]+': '+startLessonSecondaParte
      return startLesson
    }
    else{
      return startLessonAppoggio[0]
    }
}

  displayCard = (e) => {
    this.setState({
      displayCard: e
    });
  }

  displayTable = () => {
    this.setState({
      displayCard: null
    });
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

      if (ritirato != 0) {
        return (
          <div>
          <Card>
            <CardHeader >
              <div className="text-center font-weight-bold">STUDENTI</div>
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
      } else {
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
                />
              </CardBody>
            </Card>
          </div>
        )
      }
    }
    if(this.state.displayCard){
      return <InfoStudente studente={this.state.studenti.find((studente) => studente.email === this.state.displayCard)} getStudents={this.getStudents} displayTable={this.displayTable}/>
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

export default Studenti;


