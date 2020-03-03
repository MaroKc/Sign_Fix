import React, { Component } from 'react';
import axios from 'axios'
import { MDBDataTable } from 'mdbreact';
import InfoDocente from './InfoDocente';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
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
    }
  }

  componentDidMount() {
    this.getTeachers();
    this.teacherDetails();
  }

  getTeachers = () => {
    axios.get('http://localhost:8080/listTeachers')
      .then(res =>  {
        const docenti = [];
        res.data.data.map(item => docenti.push({
          firstName: item.first_name,
          lastName: item.last_name,
          emailDocente: item.email_responsible,
          companiesId: item.companies_id,
          ritirato: item.ritirato,
          hoursOfLessons: this.formatHours(item.hours_of_lessons),
          clickEvent: () => this.displayCard(item.email_responsible,item.companies_id)
        }));
        this.setState({ docenti });
      })
      .catch(err => console.error(err));
  }

teacherDetails = () => {
  axios.get('http://localhost:8080/teachersDetails')
      .then(res => {
      const dettagli = res.data.data;
      var dettagliDocente = [];
      dettagli.map(item =>
          dettagliDocente.push({
              companyName: item.company_name,
              lessonName: item.lesson,
              totalHours: this.formatHours(item.total_hours),
              companyId: item.company_id
          })
      );
        this.setState({dettagliDocente: dettagliDocente})
      })
      .catch(err => console.error(err));
  }

  createTeacher = () => {
    axios.post('http://localhost:8080/createTeacher/', { 
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      emailDocente: this.state.emailDocente,
      companyName: this.state.companyName === "" ? this.state.emailDocente : this.state.companyName , 
      idCorso: this.props.classe["id"]
     })
      .then(res=>{
        console.log(res);
  
        // this.refresh()
        window.location.reload()
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
  this.displayTable()
}

handleChange = (event) => {
  let name = event.target.name;
  let val = event.target.value;
    this.setState({
      [name]: val,
    });
  }

  refresh = () => {
    this.getTeachers();
    this.displayTable()
  }
  
  handleChange = (event) => {
    let name = event.target.name;
    let val = event.target.value;
      this.setState({
        [name]: val,
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
              <CardHeader className="d-flex justify-content-between">
                <span value="docenti"></span><span className="text-center font-weight-bold">DOCENTI</span>
                <span> <Button color="ghost-success" className="mr-1" onClick={this.displayForm}><i className="cui-user-follow icons font-2xl d-block"></i>  </Button> </span>
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
              <CardHeader className="d-flex justify-content-between">
                <span value="docenti"></span><span className="text-center font-weight-bold">DOCENTI</span>
                <span> <Button color="ghost-success"  className="mr-1" onClick={this.displayForm}><i className="cui-user-follow icons font-2xl d-block"></i>  </Button> </span>
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
      return <InfoDocente docente={this.state.docenti.find((docente) => docente.emailDocente === this.state.displayCard)} details={this.state.dettagliDocente.find((docente) => docente.companyId === this.state.displayDetails)} getTeachers={this.getTeachers} displayTable={this.displayTable}/>
    }else{
      return (
        <>
          {DatatablePage()}
        </>
      )
    }
  }


  formDocente(){
    const regexLettere = /^[a-zA-Z]*$/;
    const regexEmail =	/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const {firstName, lastName, emailDocente, companyName} = this.state
    const validationFirstName = firstName.length > 2 && regexLettere.test(firstName)
    const validationLastName = lastName.length > 2 && regexLettere.test(lastName)
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
                        <td><Input id="infoNome" name='firstName' onChange={this.handleChange} value={this.state.firstName} valid={validationFirstName}/></td>
                      </tr>
                      <tr>
                        <td><h5>Cognome:</h5></td>
                        <td><Input id="infoCognome" name='lastName' onChange={this.handleChange} value={this.state.lastName} valid={validationLastName}/></td>
                      </tr>
                      <tr>
                        <td><h5>Email:</h5></td>
                        <td><Input id="infoEmail" name='emailDocente' onChange={this.handleChange} value={this.state.emailDocente} valid={validationEmail}/></td>
                      </tr>
                      <tr>
                        <td><h5>Compagnia:</h5></td>
                        <td><Input id="infoCompanyName" name='companyName' onChange={this.handleChange} value={this.state.companyName}/></td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col xs="auto" className="my-auto mx-auto pr-5">
                <Button outline color="dark" disabled={!validationFirstName, !validationLastName, !validationEmail} onClick={this.createTeacher}> <i className="cui-check icons font-2xl d-block mt-2"  ></i>Crea <br /> docente</Button>
              </Col>
            </Row>
          </CardBody>
          <Button onClick={this.refresh} outline color="dark"> Indietro </Button>
        </Card>
      </div>
    )
  }

  render() 
  {
    if(this.state.displayForm){
    return this.formDocente()
    }else{
      return this.tabPane()
    }
    
  }
}

export default Docenti;