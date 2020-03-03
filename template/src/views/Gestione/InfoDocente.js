import React from 'react'
import { Card, Col, Row,  Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Table } from 'reactstrap';
import axios from 'axios'
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

class InfoDocente extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            changeInfo: false,
            warning: false,
            displayCard: this.props.displayCard,
            firstName: this.props.docente.firstName,
            lastName: this.props.docente.lastName,
            emailDocente: this.props.docente.emailDocente,
            hoursOfLessons: this.props.docente.hoursOfLessons,
            ritirato: this.props.docente.ritirato,
            companyName: this.props.details.companyName,
            lessonName: this.props.details.lessonName,
            totalHours: this.props.details.totalHours,         
            companyId: this.props.details.companyId,           
        }
    }

    callForUpdate = () => {
        axios.put('http://localhost:8080/updateTeacher/' + this.state.emailDocente, {
            first_name: this.state.firstName,
            last_name: this.state.lastName
        })
            .then(res => {
                if (res.data.message === "ok") ToastsStore.success("La modifica è stata effettuata con successo!")
                else if (res.data.message === "ko") ToastsStore.danger("Ops, abbiamo un problema: " + res.data.data);
            })
            .catch(err => {
                return console.log(err);
            });
        this.setState({
            changeInfo: false
        })
    }


    callForRetire = () => {

        axios.put('http://localhost:8080/retireTeacher/' + this.state.emailDocente, {
            ritirato: 1,
        })
            .then(res => {
                if (res.data.message === "ko") ToastsStore.danger("Ops, abbiamo un problema: " + res.data.data);
            })
            .catch(err => {
                return console.log(err);
            });
        window.location.reload();
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
        this.props.getTeachers();
        this.props.displayTable()
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
                        <td><h5>Nome:</h5></td>
                        <td><h5 name="firstName">{this.state.firstName}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Cognome: </h5></td>
                        <td><h5 name="lastName">{this.state.lastName}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Nome azienda:</h5></td>
                        <td><h5>{this.state.companyName}</h5> </td>
                    </tr>
                    <tr>
                        <td><h5>Lezione:</h5></td>
                        <td><h5>{this.state.lessonName}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore fatte:</h5></td>
                        <td><h5>{this.state.hoursOfLessons}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore di lezione:</h5></td>
                        <td><h5>{this.state.totalHours}</h5></td>
                    </tr>
                </tbody>
            </Table>
        )
    }
    else {
        const regexLettere = /^[a-zA-Z\\']*$/;
        const { firstName, lastName } = this.state
        const validationFirstName = firstName.length > 2 && regexLettere.test(firstName)
        const validationLastName = lastName.length > 2 && regexLettere.test(lastName)
        return (
            <Table borderless responsive>
                <tbody>
                    <tr>
                        <td><h5>Nome:</h5></td>
                        <td><Input name='firstName' onChange={this.handleChange} value={this.state.firstName} valid={validationFirstName} invalid={!validationFirstName} /></td>
                    </tr>
                    <tr>
                        <td><h5>Cognome:</h5></td>
                        <td><Input name='lastName' onChange={this.handleChange} value={this.state.lastName} valid={validationLastName} invalid={!validationLastName} /></td>
                    </tr>
                    <tr>
                        <td><h5>Nome azienda:</h5></td>
                        <td><h5>{this.state.companyName}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Lezione:</h5></td>
                        <td><h5>{this.state.lessonName}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore fatte</h5></td>
                        <td><h5>{this.state.hoursOfLessons}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore di lezione:</h5></td>
                        <td><h5>{this.state.totalHours}</h5></td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

renderButtons = (changeInfo) => {
    const regexLettere = /^[a-zA-Z\\' ]*$/;
    const { firstName, lastName } = this.state
    const validationInput = firstName.length > 2 && regexLettere.test(firstName) && lastName.length > 2 && regexLettere.test(lastName)

    if (this.props.docente.ritirato === 0) {
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
    }
}

openModal = () => {
    return (
        <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
            className={'modal-danger ' + this.props.className}>
            <ModalHeader toggle={this.toggleWarning}>WARNING</ModalHeader>
            <ModalBody>
                <div className="text-center">
                    <b>{this.props.docente.firstName} {this.props.docente.lastName}</b> verrà inserito tra i docenti <b>archiviati</b>
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
                {/* <CardHeader className="text-center">
            <b>{this.state.firstName}  {this.state.lastName}</b>
            </CardHeader> */}
                <Row>
                    <Col className="">
                        <div className="m-4" xs="auto">
                            {this.changeInfo(this.state.changeInfo)}
                        </div>
                    </Col>
                    <Col xs="auto" className="my-auto mx-auto pr-5">
                        {this.renderButtons(this.state.changeInfo)}
                        {this.openModal()}
                    </Col>
                </Row>
                <Button onClick={this.refresh} outline color="dark"> Indietro </Button>
            </Card>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
        </div>
    )}
}

export default InfoDocente