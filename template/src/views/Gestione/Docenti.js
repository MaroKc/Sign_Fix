import React, { Component } from 'react';
import axios from 'axios'
import { MDBDataTable } from 'mdbreact';
import InfoDocente from './InfoDocente';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Row,
  Col,
  Input,
} from 'reactstrap';

//https://mdbootstrap.com/docs/react/tables/search/

class Docenti extends Component {
  constructor(props) {
    super(props)
    this.state = {
      docenti: [],
      dettagliDocente: [],
      displayCard: null,
      displayDetails: null,
      displayForm: null,
      firstName: '',
      lastName: '',
      emailDocente: '',
      companyName: '',
      idCorso: '',
      displayTab: false,
    }
  }

  componentDidMount() {
    this.getTeachers();
    this.getTeacherDetails();
  }

  getTeachers = () => {
    axios.get('http://localhost:8080/listTeachers')
      .then(res =>  {
        let docenti = [];
        res.data.data.map(item => docenti.push({
          companyName: item.name === item.emailTeacher ? "" : item.name,
          firstName: item.firstName,
          lastName: item.lastName,
          ritirato: item.ritirato,
          companyId: item.companyId,
          emailDocente: item.emailTeacher,
          clickEvent: () => this.displayCard(item.emailTeacher)
        }));
        this.setState({ docenti });
      })
      .catch(err => console.error(err));
  }

  getTeacherDetails = () => {
    axios.get('http://localhost:8080/teacherDetails')
    .then(res =>  {
      let dettagliDocente = [];
      res.data.data.map(item => dettagliDocente.push({
        companyName: item.name,
        lessonName: item.lesson,
        firstName: item.firstName,
        lastName: item.lastName,
        ritirato: item.ritirato,
        companyId: item.companyId,
        emailDocente: item.emailTeacher,
        hoursOfLessons: this.formatHours(item.hoursOfLessons),
        totalHours: this.formatHours(item.totalHours),
        clickEvent: () => this.displayCard(item.emailTeacher)
      }));
      this.setState({ dettagliDocente });
    })
    .catch(err => console.error(err));
  }


  createTeacher = () => {
    axios.post('http://localhost:8080/createTeacher/', { 
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      emailDocente: this.state.emailDocente,
      companyName: this.state.companyName, 
      idCorso: this.props.classe["id"]
     })
     .then(res => {
      if (res.data.message === "ok") {
        this.refresh();
        ToastsStore.success(" è stato aggiunto alla lista docenti!");
      }else if (res.data.message === "esistente") ToastsStore.warning("OPS, la mail è stata già inserita");

    })
    this.setState({
     firstName: '', lastName: '', emailDocente: '', companyName: ''
    })
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

displayTab = () => {
  this.setState({
    displayTab: !this.state.displayTab
  })
}

  displayCard = (e,f) => {
    this.setState({
      displayCard: e,
      displayDetails: f
    });
  }

  displayForm =() => {
    this.setState({
      displayForm: !this.state.displayForm
    })
  }

  displayTable = () => {
    this.setState({
      displayCard: null,
      displayDetails: null,
      displayForm: null
    })
  }
  
refresh = () => {
  this.getTeachers();
  this.displayTable();
  this.getTeacherDetails();
}


handleChange = (event) => {
  let name = event.target.name;
  let val = event.target.value;
    this.setState({
      [name]: val,
    });
  }

   groupBy = (objectArray, property) => {
      return objectArray.reduce(function (acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
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
          },
          {
            label: 'Identificativo/Compagnia',
            field: 'companyName',
          }
        ]
      };

      const nonRitirato =this.state.docenti.filter(el => el.ritirato === 0) 
      const ritirato = this.state.docenti.filter(el => el.ritirato === 1)
    
      if (ritirato != 0) {
        return (
          <div>
            <Card>
            <CardHeader>
                <Row>
                  <Col sm="4">
                  </Col>
                  <Col sm="4" className="my-auto text-center">
                    <span className="font-weight-bold"><h3><b>DOCENTI</b></h3></span>
                  </Col>
                  <Col sm="4" className="text-right">
                    <span> <Button className="custom-btn" className="mr-1" onClick={this.displayForm}><i className="cui-user-follow icons font-2xl d-block"></i> Aggiungi docente </Button> </span>
                  </Col>
                </Row>
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
            <Card>
            <CardHeader >
              <h4 className="text-center font-weight-bold">DOCENTI ARCHIVIATI</h4>
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
            <CardHeader>
                <Row>
                  <Col sm="4">
                  </Col>
                  <Col sm="4" className="my-auto text-center">
                    <span className="font-weight-bold"><h3><b>DOCENTI</b></h3></span>
                  </Col>
                  <Col sm="4" className="text-right">
                    <span> <Button className="custom-btn mr-1" onClick={this.displayForm}><i className="cui-user-follow icons font-2xl d-block"></i> Aggiungi docente </Button> </span>
                  </Col>
                </Row>
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
      let groupedPeople = this.groupBy(this.state.dettagliDocente, 'emailDocente');
      // console.log(groupedPeople[(this.state.dettagliDocente.find((docente) => docente.emailDocente === this.state.displayCard))['emailDocente']])

      return <InfoDocente 
      docente = {groupedPeople[(this.state.dettagliDocente.find((docente) => docente.emailDocente === this.state.displayCard))['emailDocente']]} 
      getTeachers={this.getTeachers} 
      getTeacherDetails={this.getTeacherDetails} 
      displayTable={this.displayTable}
      />
    }else{
      return (
        <>
          {DatatablePage()}
        </>
      )
    }
  }

  formDocente(){
    const regexLettere = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\'\s]*$/;
    const regexEmail =	/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const {firstName, lastName, emailDocente, companyName} = this.state
    const validationFirstName = firstName.length > 2 && regexLettere.test(firstName) 
    const validationLastName = lastName.length > 2 && regexLettere.test(lastName)
    const validationIdentificativo = companyName.length >= 2 && regexLettere.test(companyName)
    const validationEmail = emailDocente.length > 4 && regexEmail.test(emailDocente)

    return (
      <div className="d-flex justify-content-center mt-5">
        <Card className="w-75">
          <CardHeader className="text-center">
            <b>Aggiungi docente</b>
          </CardHeader>
          <CardBody>
            <Row>
              <Col className="">
                <div className="ml-4 mr-4" xs="auto">
                  <Table borderless responsive>
                    <tbody>
                      <tr>
                        <td><h5>Nome:</h5></td>
                        <td><Input id="infoNome" name='firstName' onChange={this.handleChange} value={this.state.firstName} invalid={!validationFirstName && firstName.length !== 0} valid={validationFirstName}/></td>
                      </tr>
                      <tr>
                        <td><h5>Cognome:</h5></td>
                        <td><Input id="infoCognome" name='lastName' onChange={this.handleChange} value={this.state.lastName} invalid={!validationLastName && lastName.length !== 0} valid={validationLastName}/></td>
                      </tr>
                      <tr>
                        <td><h5>Email:</h5></td>
                        <td><Input id="infoEmail" name='emailDocente' onChange={this.handleChange} value={this.state.emailDocente} invalid={!validationEmail && emailDocente.length !== 0} valid={validationEmail}/></td>
                      </tr>
                      <tr>
                        <td><h5>Identificativo calendario <br/>o compagnia:</h5></td>
                        <td><Input id="infoCompanyName" name='companyName' onChange={this.handleChange} value={this.state.companyName} invalid={!validationIdentificativo && companyName.length !== 0} valid={validationIdentificativo}/></td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col xs="auto" className="my-auto mx-auto pr-5">
                <Button className="custom-btn" disabled={!validationFirstName || !validationLastName || !validationEmail || !validationIdentificativo} onClick={this.createTeacher}> <i className="cui-check icons font-2xl d-block mt-2"  ></i>Crea <br /> docente</Button>
              </Col>
            </Row>
          </CardBody>
          <Button onClick={this.refresh} outline color="dark"> Indietro </Button>
        </Card>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
      </div>
    )
  }
  render() 
  {
    if(this.state.displayForm){
    return this.formDocente()
    }else{
      return (
        <>
        {this.tabPane() }
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
        </>
      )
    }
  }
}

export default Docenti;