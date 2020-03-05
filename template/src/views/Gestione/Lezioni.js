import React from 'react';
import { Card, CardBody, CardHeader, Button, Collapse, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import axios from 'axios'
import DatePicker from 'react-datepicker'
import { MDBDataTable } from 'mdbreact';
import 'react-datepicker/dist/react-datepicker.css';

// import { MDBDataTable } from 'mdbreact';


class Lezioni extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lezioniMattina: [],
      lezioniPomeriggio: [],
      studentiMattina: [],
      studentiPomeriggio: [],
      startDate: new Date(),
      collapse: false,
      accordion: [false, false],
      warning: false,
      emailStudent: "",
      student: [],
      firstName: '',
      startTime: '',
      endTime: ''
    }

  }


  handleChange = date => {
      this.setState({
        startDate: date
      },()=> this.getLessons()); 
  }

  getLessons = () => {
      var data_appoggio = new Intl.DateTimeFormat('usa', { year: 'numeric', month: '2-digit', day: '2-digit'}).format(this.state.startDate)
      var data_scelta = data_appoggio.replace(/[.*+?^${}/()|[\]\\]/g, '-')
      axios.get('http://localhost:8080/lessons/' + data_scelta+'/'+this.props.classe["id"])
      .then(res => res.data)
      .then((data) => {
        const lezioniMattina = [];
        const lezioniPomeriggio = [];

        data.map((item) => {
        if(item.startTime < 12){
        lezioniMattina.push({
          id: item.id,
          lesson: item.lesson,
          email: item.email,
          classroom: item.classroom,
          startTime: item.startTime,
          endTime: item.endTime,
        })
      }
      else{
        lezioniPomeriggio.push({
          id: item.id,
          lesson: item.lesson,
          email: item.email,
          classroom: item.classroom,
          startTime: item.startTime,
          endTime: item.endTime,
        })
      }
      });
        this.setState({ 
          lezioniMattina ,
          lezioniPomeriggio
        });
      })
      .catch(err => console.error(err));


      axios.get('http://localhost:8080/listSignaturesStudents/'+data_scelta)
        .then(res => res.data)
        .then((data) => {
          const studentiMattina = [];
          const studentiPomeriggio = [];

          data.map(item => {
            if(item.mattinaPomeriggio === 0){
              studentiMattina.push({
                idLesson: item.idLesson,
                firstName: item.firstName,
                email: item.email,
                lastName: item.lastName,
                emailStudent: item.emailStudent,
                startTime: this.formatHours(item.startTime),
                endTime: this.formatHours(item.endTime),
                clickEvent: () => this.toggleWarning(item.emailStudent)
              })
            }
            else if(item.mattinaPomeriggio === 1){
              studentiPomeriggio.push({
                idLesson: item.idLesson,
                firstName: item.firstName,
                lastName: item.lastName,
                startTime: this.formatHours(item.startTime),
                endTime: this.formatHours(item.endTime)
              })
            }
          });
          this.setState(
            { studentiMattina, 
              studentiPomeriggio 
           });
        })
        .catch(err => console.error(err));
    }
  
    // formOrario(){

    //     axios.put('http://localhost:8080/updateTeacher/' + this.state.emailDocente, {
    //         first_name: this.state.firstName,
    //         last_name: this.state.lastName
    //     })
    //         .then(res => {
    //             if (res.data.message === "ok") ToastsStore.success("La modifica è stata effettuata con successo!")
    //             else if (res.data.message === "ko") ToastsStore.danger("Ops, abbiamo un problema: " + res.data.data);
    //         })
    //         .catch(err => {
    //             return console.log(err);
    //         });
    //     this.setState({
    //         changeInfo: false
    //     })
    // }

    toggleWarning = (e) => {
      this.setState({
        emailStudent: e,
        warning: !this.state.warning,
      },() => this.stud());
      console.log(this.state.student)
    }
    
    stud =() => {
      this.setState({
        student: this.state.emailStudent !== "" && this.state.studentiMattina.find(studente => studente.emailStudent === this.state.emailStudent),
        firstName: this.state.student && this.state.student.firstName,
        startTime: this.state.student && this.state.student.startTime,
        endTime: this.state.student && this.state.student.endTime
      })
    }


    toggle = () => {
      this.setState({
        warning: !this.state.warning
      })
    }

    handle = (event) => {
      let name = event.target.name;
      let val = event.target.value;

      this.setState({
          [name]: val,
      });
  }


  openModal = () => {
    return (
      <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
        className={'modal-danger ' + this.props.className}>
        <ModalHeader toggle={this.toggleWarning}>WARNING</ModalHeader>
        <ModalBody>
          <div className="text-center">
            Stai cambiando l'orario di ingresso e/o uscita dello studente {this.state.firstName}
            <h5 >Procedere?</h5>
            <Input name='startTime' value = {this.state.startTime} onChange={this.handle}  /> <Input name='endTime' value={this.state.endTime} onChange={this.handle}   />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger">Continua</Button>{' '}
          <Button color="secondary" onClick={this.toggle}>Cancella</Button>
        </ModalFooter>
      </Modal>
    )
  }


  formatHours (hours){
      var startLessonAppoggio= (hours.toString()).split('.')
      var startLesson= ''

      var startLessonPrimaParte=  startLessonAppoggio[0].length == 1 ? '0'+startLessonAppoggio[0] :  startLessonAppoggio[0]
      if(startLessonAppoggio[1]){
        var startLessonSecondaParte=  startLessonAppoggio[1].length == 1 ? startLessonAppoggio[1]+'0' :  startLessonAppoggio[1]
        startLesson= startLessonPrimaParte+': '+startLessonSecondaParte
        return startLesson
      }
      else if(startLessonAppoggio[0]=='assente' ){
        return startLessonAppoggio[0]
      }
      else{
        startLesson= startLessonPrimaParte+': 00'
        return startLesson
      }
  }

  lezioneMattina = () => {
    let nomeLezione;
    let inizioLezione;
    let fineLezione;
    let classe;
    let email;
    
    this.state.lezioniMattina.map((mapItem) => {
        nomeLezione = mapItem.lesson;
        inizioLezione = mapItem.startTime;
        fineLezione = mapItem.endTime;
        classe = mapItem.classroom;
        email = mapItem.email.split('@')[0];
    });

    let assenti = []

    this.state.studentiMattina.map((item) => {
      if(item.startTime === 'assente'){
        assenti.push({
          firstName: item.firstName,
          lastName: item.lastName
        })
      }})
   


    if (nomeLezione) {
      
      return <>
         {this.openModal()}
        <Card className="m-4 ">
          <CardHeader id="headingOne">
            <Button block color=" " className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
              <Row>
                <Col className="my-auto col-sm-4">
                  <h5 className="ml-4">mattina   {this.formatHours(inizioLezione)} - {this.formatHours(fineLezione)}</h5>
                </Col>
                <Col className="col-sm-8">
                   <h5>Luogo: <b> {classe} </b>   Lezione: <b>{nomeLezione}</b>   Docente: <b>{email}</b></h5>
                </Col>
              </Row>
             {!assenti.length ? "" :  <div className="ml-4">Assenti: <span className="text-danger">{assenti.map(item => <span>{item.firstName} {item.lastName}, </span>)}</span> </div>}
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
              {this.tabPaneMattina()}
            </CardBody>
          </Collapse>
        </Card>
      </>
    }
  }

  lezionePomeriggio = () => {
    let nomeLezione;
    let inizioLezione;
    let fineLezione;
    let classe;
    let email;

    this.state.lezioniPomeriggio.map((mapItem) => {
        nomeLezione = mapItem.lesson;
        inizioLezione = mapItem.startTime;
        fineLezione = mapItem.endTime;
        classe = mapItem.classroom;
        email = mapItem.email.split('@')[0];
    });

    let assenti = []

    this.state.studentiPomeriggio.map((item) => {
      if(item.startTime === 'assente'){
        assenti.push({
          firstName: item.firstName,
          lastName: item.lastName
        })
      }})


    if (nomeLezione) {
      return <>
        <Card className="m-4 ">
          <CardHeader id="headingOne">
            <Button block color=" " className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseOne">
              <Row>
                <Col className="my-auto col-sm-4">
                  <h5 className="ml-4">pomeriggio   {this.formatHours(inizioLezione)} - {this.formatHours(fineLezione)}</h5>
                </Col>
                <Col className="col-sm-8">
                   <h5>Luogo: <b> {classe} </b>   Lezione: <b>{nomeLezione}</b>   Docente: <b>{email}</b></h5>
                </Col>
              </Row>
              {!assenti.length ? "" :  <div className="ml-4">Assenti: <span className="text-danger">{assenti.map(item => <span>{item.firstName} {item.lastName}, </span>)}</span> </div>}
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
              {this.tabPanePomeriggio()}
            </CardBody>
          </Collapse>
        </Card>
        
      </>
    }
  }

  toggleAccordion = (tab) => {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);
    this.setState({
      accordion: state,
    });
  }



  tabPaneMattina() {
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
            label: 'Entrata',
            field: 'startTime',
          },
          {
            label: 'Uscita',
            field: 'endTime',
          },
        ],
        rows:this.state.studentiMattina
      };

  return (
    <div>
      <Card>
        <CardBody>
          <MDBDataTable
            responsive
            hover
            data={data}
            searching={false}
            paging={false}
            noBottomColumns={true}
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
  

  tabPanePomeriggio() {
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
            label: 'Entrata',
            field: 'startTime',
          },
          {
            label: 'Uscita',
            field: 'endTime',
          },
        ],
        rows: this.state.studentiPomeriggio
      };

  return (
    <div>
      <Card>
        <CardBody>
          <MDBDataTable
            responsive
            hover
            data={data}
            searching={false}
            paging={false}
            noBottomColumns={true}
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

  render() {
    return (
      <>
        <Card>
          <CardHeader className="text-center">
            <b>LEZIONI</b>
          </CardHeader>
          <CardBody>
            <div className="d-flex justify-content-center">
            <div className="form-group">
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                dateFormat="dd/MM/yyyy"
                className="border border-dark rounded text-center"
              />
               </div>

            </div>
            {this.lezioneMattina()}
            {this.lezionePomeriggio()}
         
          </CardBody>
        </Card>
      </>
    );
  }
}

export default Lezioni