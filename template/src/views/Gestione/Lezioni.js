import React from 'react';
import { Card, CardBody, CardHeader, Button, Collapse, Row, Col } from 'reactstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { MDBDataTable } from 'mdbreact';
import OreLezioniMattina from './OreLezioniMattina';
import OreLezioniPomeriggio from './OreLezioniPomeriggio';
import 'react-datepicker/dist/react-datepicker.css';

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
      displayCard: null,
      displayId: null,
      mattinaPomeriggio: null,
      companyNameMattina: null,
      companyNamePomeriggio: null
    }
  }

  componentDidMount(){
    this.getLessons()
  }
  handleChange = date => {
      this.setState({
        startDate: date
      },()=> this.getLessons()); 
  }

  displayCard = (e, f, g) => {
    this.setState({
      displayCard: e,
      displayId: f,
      mattinaPomeriggio: g
    });
  }


  displayTable = () => {
    this.setState({
      displayCard: null,
      displayId: null,
      mattinaPomeriggio: null
    });
  }

  getLessons = () => {
      var data_appoggio = new Intl.DateTimeFormat('usa', { year: 'numeric', month: '2-digit', day: '2-digit'}).format(this.state.startDate)
      var data_scelta = data_appoggio.replace(/[.*+?^${}/()|[\]\\]/g, '-')

      axios.get('http://localhost:8080/lessons/'+ data_scelta+'/'+this.props.classe["id"])
      .then(res => res.data)
      .then((data) => {
        const lezioniMattina = [];
        const lezioniPomeriggio = [];

        data.map((item) => {
        if(item.startTime < 12){
        lezioniMattina.push({
          name: item.name,
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
          name: item.name,
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


      axios.get('http://localhost:8080/listSignaturesStudents/'+data_scelta+'/'+this.props.classe['id'])
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
                clickEvent: () => this.displayCard(item.emailStudent, item.idLesson, item.mattinaPomeriggio)
              })
            }
            else if(item.mattinaPomeriggio === 1){
              studentiPomeriggio.push({
                idLesson: item.idLesson,
                firstName: item.firstName,
                lastName: item.lastName,
                emailStudent: item.emailStudent,
                startTime: this.formatHours(item.startTime),
                endTime: this.formatHours(item.endTime),
                clickEvent: () => this.displayCard(item.emailStudent, item.idLesson, item.mattinaPomeriggio)
              })
            }
          });
          this.setState(
            { 
              studentiMattina, 
              studentiPomeriggio 
           });
        })

        .catch(err => console.error(err));
    }


  formatHours (hours){
      var startLessonAppoggio= (hours.toString()).split('.')
      var startLesson= ''

      var startLessonPrimaParte=  startLessonAppoggio[0].length === 1 ? '0'+startLessonAppoggio[0] :  startLessonAppoggio[0]
      if(startLessonAppoggio[1]){
        var startLessonSecondaParte =  startLessonAppoggio[1].length === 1 ? startLessonAppoggio[1]+'0' :  startLessonAppoggio[1]
        startLesson= startLessonPrimaParte+': '+startLessonSecondaParte
        return startLesson
      }
      else if(startLessonAppoggio[0] ==='assente' ){
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
      let identificativo;
      
      this.state.lezioniMattina.map((mapItem) => {
        identificativo = mapItem.name;
        nomeLezione = mapItem.lesson;
        inizioLezione = mapItem.startTime;
        fineLezione = mapItem.endTime;
        classe = mapItem.classroom;
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
        
        <Card className="m-md-4 ">
          <CardHeader id="headingOne">
            <Button block color=" " className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
              <Row>
                <Col className="my-auto col-sm-4">
                <h5 className="d-block ml-md-4">mattina</h5>
                <h5 className="d-block ml-md-4 ">{this.formatHours(inizioLezione)} - {this.formatHours(fineLezione)}</h5> 
                </Col>
                <Col className="col-sm-8 mt-3">
                <h5> <p>Luogo: <b> {classe} </b></p> <p>Lezione: <b>{nomeLezione}</b></p> <p>Identificativo: <b>{identificativo}</b></p></h5>
                </Col>
              </Row>
             {!assenti.length ? "" :  <div className="ml-md-4"><h4> <b className="text-danger">Assenti:</b> {assenti.map((item, i) => <span key={i}>{item.firstName} {item.lastName}, </span>)}</h4> </div>}
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
    let identificativo;

    this.state.lezioniPomeriggio.map((mapItem) => {
        identificativo = mapItem.name;
        nomeLezione = mapItem.lesson;
        inizioLezione = mapItem.startTime;
        fineLezione = mapItem.endTime;
        classe = mapItem.classroom;
    });

    let assenti = []

    this.state.studentiPomeriggio.map((item) => {
      if(item.startTime === "assente"){
        assenti.push({
          firstName: item.firstName,
          lastName: item.lastName
        })
      }})


    if (nomeLezione) {
      return <>
        <Card className="m-md-4">
          <CardHeader id="headingOne">
            <Button block color=" " className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseOne">
              <Row>
                <Col className="my-auto col-sm-4">
                <h5 className="d-block ml-md-4">pomeriggio</h5>
                <h5 className="d-block ml-md-4 ">{this.formatHours(inizioLezione)} - {this.formatHours(fineLezione)}</h5>
                </Col>
                <Col className="col-sm-8 mt-3">
                <h5> <p>Luogo: <b> {classe} </b></p> <p>Lezione: <b>{nomeLezione}</b></p> <p>Identificativo: <b>{identificativo}</b></p></h5>
                </Col>
              </Row>
              {!assenti.length ? "" :  <div className="ml-md-4"> <h4> <b className="text-danger">Assenti:</b> {assenti.map((item, i) =>  <span ket={i}> {item.firstName} {item.lastName}, </span>)}</h4></div>}
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
    if(this.state.displayCard && this.state.mattinaPomeriggio === 0){
      return <OreLezioniMattina
      studenteMattina={this.state.studentiMattina.find((studente) => studente.emailStudent === this.state.displayCard)} 
      lezioneMattina={this.state.lezioniMattina.find(lezione => lezione.id === this.state.displayId )}

      getLessons={this.getLessons} 
      displayTable={this.displayTable}
      />
    }else{
    return (
      <>
        {DatatablePage()}
      </>
    )}
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

      // this.state.studentiPomeriggio.startTime === "assente" ? <div className="text-success">"assente"</div> : this.state.studentiPomeriggio.startTime
  return (
    <div>
      <Card>
        <CardBody>
          <MDBDataTable
            responsive
            hover
            data={data
            }
            searching={false}
            paging={false}
            noBottomColumns={true}
          />
        </CardBody>
      </Card>
    </div>
  );  
    }
    if(this.state.displayCard && this.state.mattinaPomeriggio === 1){
      return <OreLezioniPomeriggio 
      studentePomeriggio={this.state.studentiPomeriggio.find((studente) => studente.emailStudent === this.state.displayCard)} 
      lezionePomeriggio={this.state.lezioniPomeriggio.find(lezione => lezione.id === this.state.displayId )}

      getLessons={this.getLessons} 
      displayTable={this.displayTable}
      />
    }else{
    return (
      <>
        {DatatablePage()}
      </>
    )}
  }

  render() {
    return (
      <>
        <Card>
          <CardHeader className="text-center">
            <h3><b>LEZIONI</b></h3>
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