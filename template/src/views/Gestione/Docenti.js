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
      email: '',
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
<<<<<<< HEAD
      .then(res =>  {
=======
      .then(res => {
>>>>>>> 5a624f8b5ecc56fdfc22d2cb93139d48d79d60e7
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

  // postTeacher = () => {
  //   axios.post
  // }

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

createTeacher = () => {

  axios.post('http://localhost:8080/createTeacher/', { 
    firstName: this.state.firstName,
    lastName: this.state.lastName,
    email: this.state.email,
    companyName: this.state.companyName === "" ? this.state.email : this.state.companyName , 
    idCorso: this.props.classe["id"]
   })
    .then(res=>{
      console.log(res);

      // this.refresh()
      window.location.reload()
    })
}


  formDocente(){
    // const regexLettere = /^[a-zA-Z]*$/;
    // const regexFiscalCode = /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
    // const regexData =/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i
    // const {firstName, lastName, residence, fiscalCode, dateOfBirth} = this.state
    // const validationFirstName = firstName.length > 2 && regexLettere.test(firstName)
    // const validationLastName = lastName.length > 2 && regexLettere.test(lastName)
    // const validationResidence = residence.length > 2 
    // const validationDateOfBirth = dateOfBirth.length === 10 && regexData.test(dateOfBirth)
    // const validationFiscalCode = fiscalCode.length === 16 && regexFiscalCode.test(fiscalCode)
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
                        <td><Input id="infoNome" name='firstName' onChange={this.handleChange} value={this.state.firstName} /></td>
                      </tr>
                      <tr>
                        <td><h5>Cognome:</h5></td>
                        <td><Input id="infoCognome" name='lastName' onChange={this.handleChange} value={this.state.lastName}/></td>
                      </tr>
                      <tr>
                        <td><h5>Email:</h5></td>
                        <td><Input id="infoEmail" name='email' onChange={this.handleChange} value={this.state.email}/></td>
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
                <Button outline color="dark"> <i className="cui-check icons font-2xl d-block mt-2" onClick={this.createTeacher}></i>conferma <br /> modifica</Button>
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