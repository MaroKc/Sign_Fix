import React from 'react'
import { Card, Col, Row, CardHeader, Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Table } from 'reactstrap';
import axios from 'axios'


class infoStudente extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: this.props.studente.email,
      firstName: this.props.studente.firstName,
      lastName: this.props.studente.lastName,
      dateOfBirth: this.props.studente.dateOfBirth,
      residence: this.props.studente.residence,
      fiscalCode: this.props.studente.fiscalCode,
      ritirato: this.props.studente.ritirato,
      changeInfo: false,
      warning: false,
    }
    console.log(this.state.tabPane)
  }


  callForUpdate = () => {
    axios.put('http://localhost:8080/updateStudent/' + this.state.email, {
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
      changeInfo: false
    })
  }

  callForRetire = () => {
    axios.put('http://localhost:8080/retireStudent/' + this.state.email, {
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

  handleChange = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({
      [name]: val,
    });
  }
  toggleWarning = () => {
    this.setState({
      warning: !this.state.warning,
    });
  }

  refresh = () => {
    window.location.reload();
  }

  onclickModifyState = () => {
    this.setState({
      changeInfo: !this.state.changeInfo
    })
  }


  changeInfo = (changeInfo) => {
    if (!changeInfo) {
      return (
        <Table borderless responsive>
          <tbody>
            <tr>
              <td><h5>Email:</h5></td>
              <td><h5 id="infoEmail">{this.state.email}</h5></td>
            </tr>
            <tr>
              <td><h5>Nome:</h5></td>
              <td><h5 id="infoNome">{this.state.firstName}</h5></td>
            </tr>
            <tr>
              <td><h5>Cognome:</h5></td>
              <td><h5 id="infoCognome">{this.state.lastName}</h5></td>
            </tr>
            <tr>
              <td><h5>Residenza:</h5></td>
              <td><h5 id="infoResidenza">{this.state.residence}</h5></td>
            </tr>
            <tr>
              <td><h5>Data di nascita:</h5></td>
              <td><h5 id="infoDataNascita">{this.state.dateOfBirth}</h5></td>
            </tr>
            <tr>
              <td><h5>Codice fiscale:</h5></td>
              <td><h5 id="infoCodice">{this.state.fiscalCode}</h5></td>
            </tr>
          </tbody>
        </Table>
      )
    }
    else {
      const regexLettere = /^[a-zA-Z]*$/;
      const regexFiscalCode = /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
      const regexData =/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i
      const {firstName, lastName, residence, fiscalCode, dateOfBirth} = this.state
      const validationFirstName = firstName.length > 2 && regexLettere.test(firstName)
      const validationLastName = lastName.length > 2 && regexLettere.test(lastName)
      const validationResidence = residence.length > 2 
      const validationDateOfBirth = dateOfBirth.length ==10 && regexData.test(dateOfBirth)
      const validationFiscalCode = fiscalCode.length == 16 && regexFiscalCode.test(fiscalCode)
      return (
        <Table borderless responsive>
          <tbody>
            <tr>
              <td><h5>Email:</h5></td>
              <td><h5 id="infoEmail">{this.state.email}</h5></td>
            </tr>
            <tr>
              <td><h5>Nome:</h5></td>
              <td><Input id="infoNome" name='firstName' onChange={this.handleChange} value={this.state.firstName} valid={validationFirstName} invalid={!validationFirstName} /></td>
            </tr>
            <tr>
              <td><h5>Cognome:</h5></td>
              <td><Input id="infoCognome" name='lastName' onChange={this.handleChange} value={this.state.lastName} valid={validationLastName} invalid={!validationLastName} /></td>
            </tr>
            <tr>
              <td><h5>Residenza:</h5></td>
              <td><Input id="infoResidenza" name='residence' onChange={this.handleChange} value={this.state.residence} valid={validationResidence} invalid={!validationResidence} /></td>
            </tr>
            <tr>
              <td><h5>Data di nascita:</h5></td>
              <td><Input id="infoDataNascita" name='dateOfBirth' onChange={this.handleChange} value={this.state.dateOfBirth} valid={validationDateOfBirth} invalid={!validationDateOfBirth} /></td>
            </tr>
            <tr>
              <td><h5>Codice fiscale:</h5></td>
              <td><Input id="infoCodice" name='fiscalCode' onChange={this.handleChange} value={this.state.fiscalCode} valid={validationFiscalCode} invalid={!validationFiscalCode} /></td>
            </tr>
          </tbody>
        </Table>
      )
    }
  }

  renderButtons = (changeInfo) => {
    const regexLettere = /^[a-zA-Z]*$/;
    const regexFiscalCode = /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i
    const regexData =/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i
    const { firstName, lastName, residence, fiscalCode, dateOfBirth } = this.state
    const validationInput = firstName.length > 2 && regexLettere.test(firstName) && lastName.length > 2 && regexLettere.test(lastName) && residence.length > 2 && dateOfBirth.length == 10 && regexData.test(dateOfBirth) && fiscalCode.length == 16 && regexFiscalCode.test(fiscalCode)
    
    if (this.state.ritirato === 0) {
      if (!changeInfo) {
        return (
          <>
            <Button id="modifica" color="ghost-dark" onClick={this.onclickModifyState}><i className="cui-settings icons font-2xl d-block mt-4"></i>&nbsp;<p>modifica</p></Button>
            <Button color="ghost-danger" onClick={this.toggleWarning} className="mr-1"><i className="cui-user-unfollow icons font-2xl d-block mt-4"></i>&nbsp;<p>ritira</p>  </Button>
          </>
        )
      } else {
        return (
          <>
            <Button outline color="dark" onClick={this.callForUpdate} disabled={!validationInput}> <i className="cui-check icons font-2xl d-block mt-2"></i>conferma <br /> modifica</Button>
            {/* <Button outline color="dark" onClick={this.onclickModifyState}>torna <br /> indietro</Button> */}
          </>
        )
      }
    } else {
      return (
        <>
        </>
      )
    }
  }

  openModal = () => {
    return (
      <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
        className={'modal-danger ' + this.props.className}>
        <ModalHeader toggle={this.toggleWarning}>WARNING</ModalHeader>
        <ModalBody>
          <div className="text-center">
            <b>{this.state.firstName} {this.state.lastName}</b> verrà inserito tra gli studenti <b>ritirati</b>
            <h5 >Procedere?</h5>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.callForRetire}>Continua</Button>{' '}
          <Button color="secondary" onClick={this.toggleWarning}>Cancella</Button>
        </ModalFooter>
      </Modal>
    )
  }


  render() {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Card className="w-75">
          <CardHeader className="text-center">
            <b>{this.state.firstName}  {this.state.lastName}</b>
          </CardHeader>
          <Row>
            <Col>
              <div className="m-5" xs="auto">
                {this.changeInfo(this.state.changeInfo)}
              </div>
            </Col>
            <Col xs="auto" className="my-auto m-5">
              {this.renderButtons(this.state.changeInfo)}
              {this.openModal()}
            </Col>
          </Row>
          <Button onClick={this.refresh} outline color="dark"> Indietro </Button>
        </Card>
      </div>
    )
  }
}

export default infoStudente