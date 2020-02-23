import React from 'react';
import { Card, Col, Row, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import axios from 'axios'


class infoStudente extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email : this.props.studente.email,
      firstName : this.props.studente.firstName,
      lastName : this.props.studente.lastName,
      dateOfBirth : this.props.studente.dateOfBirth,
      residence : this.props.studente.residence,
      fiscalCode : this.props.studente.fiscalCode,
      ritirato : this.props.studente.ritirato,
      changeInfo: false,
      modalWarning: false,
      displayCard: this.props.displayCard
    }
  }
  // this.toggleWarning = this.toggleWarning.bind(this);
  toggleWarning = () => {
    this.setState({
      warning: !this.state.warning,
    });
  }

  refresh =() =>{
    window.location.reload();
  }

  handleChange = (event)=> {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({
      [name]:val,
      });
  }
  
  displayTable = () => {
    this.setState({
      displayCard: !this.state.displayCard
    })
  }
  changeInfo =(changeInfo) => {
    if (!changeInfo){
      return(
        <div  className="m-5 ">
          <h5 id="infoEmail">{this.state.email}</h5>
          <h5 id="infoNome">{this.state.firstName}</h5>
          <h5 id="infoCognome">{this.state.lastName}</h5>
          <h5 id="infoResidenza">{this.state.residence}</h5>
          <h5 id="infoDataNascita">{this.state.dateOfBirth}</h5>
          <h5 id="infoCodice">{this.state.fiscalCode}</h5>
          
        </div>
      )
    }
    else{
      return(
        <div  className="m-5 w-auto">
          <h5> {this.state.email} </h5>
          <input id="infoNome"  name='firstName'  onChange={this.handleChange}  value={this.state.firstName}  required minLength="3" />
          <input id="infoCognome" name='lastName' onChange={this.handleChange} value={this.state.lastName} required />
          <input id="infoResidenza" name='residence' onChange={this.handleChange} value={this.state.residence} required />
          <input id="infoDataNascita" name='dateOfBirth' onChange={this.handleChange} value={this.state.dateOfBirth} required />
          <input id="infoCodice" name='fiscalCode' onChange={this.handleChange} value={this.state.fiscalCode} required />
        </div>
      )
    }
  }


  onclickModifyState = () =>{
    this.setState({
      changeInfo : !this.state.changeInfo
    })
  }

  callForUpdate =() =>{
   axios.put('http://localhost:8080/updateStudent/'+this.state.email, {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      date_of_birth: this.state.dateOfBirth,
      residence: this.state.residence,
      fiscal_code: this.state.fiscalCode
    })
      .then(response => {
        return console.log(response);
      })
      .catch(err => {
        return console.log(err);
      });
      this.setState({
        changeInfo : false
      })
  }

  callForRetire =() =>{
    axios.put('http://localhost:8080/retireStudent/'+this.state.email, {
       ritirato: 1,
     })
       .then(response => {
         return console.log(response);
       })
       .catch(err => {
         return console.log(err);
       });
       this.refresh();
   }

   renderButtons = (changeInfo) => {
    if(!changeInfo){
      return (
        <>
        <Button id="modifica" color="ghost-info" onClick={this.onclickModifyState}><i className="cui-settings icons font-2xl d-block mt-4"></i>&nbsp;<p>Modifica</p></Button>
        </>
      )
    }else{
      return (
        <>
          <Button color="ghost-info" onClick={this.callForUpdate}>conferma <br /> modifica</Button>
        </>
      )
    }
  }
  render() {

    return (
      <div className="d-flex justify-content-center mt-5">
        <Card className="w-75">
          <CardHeader className="text-center">
          <b>{this.state.firstName}  {this.state.lastName}</b>
          </CardHeader>
          <Row>
            <Col >
              <div className="text-left font-weight-bold m-5 w-100">
                <h5>Email: </h5>
                <h5>Nome: </h5>
                <h5>Cognome: </h5>
                <h5>Residenza: </h5>
                <h5>Data di nascita: </h5>
                <h5>Codice fiscale: </h5>
              </div>
            </Col>
            <Col >
              {this.changeInfo(this.state.changeInfo)}
            </Col>
            <Col xs="auto">
              <div className="d-flex justify-content-center m-5">
                {this.renderButtons(this.state.changeInfo)}
                <Button color="ghost-danger" onClick={this.toggleWarning} className="mr-1"><i className="cui-user-unfollow icons font-2xl d-block mt-4"></i>&nbsp;<p>Ritira</p>  </Button>
              </div>
              <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
                className={'modal-warning ' + this.props.className}>
                <ModalHeader toggle={this.toggleWarning}>Modal title</ModalHeader>
                <ModalBody>
                  <div className="text-center">
                    <b>{this.state.firstName} {this.state.lastName}</b> verrà inserito tra gli studenti <b>ritirati</b>
                    <h5 >Procedere?</h5>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="warning" onClick={this.callForRetire}>Continua</Button>{' '}
                  <Button color="secondary" onClick={this.toggleWarning}>Cancella</Button>
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
          <button className="btn btn-outline-primary" onClick={this.refresh}> Indietro </button>
        </Card>
      </div>
    )
  }
}

export default infoStudente



