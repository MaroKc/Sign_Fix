import React from 'react'
import { Card, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Button, Input, Table } from 'reactstrap';
import axios from 'axios'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

class InfoDocente extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            changeInfo: false,
            warning: false,
            displayCard: this.props.displayCard,
            firstName: this.props.docente['0'].firstName,
            lastName: this.props.docente['0'].lastName,
            companyName: this.props.docente['0'].companyName,
            dettagli: this.props.dettagli,
            value: this.props.docente['0'].lessonName
        }
    }

    callForUpdate = () => {
        axios.put('http://localhost:8080/updateTeacher/' + this.props.docente['0'].emailDocente, {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            company_name: this.state.companyName
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

        axios.put('http://localhost:8080/retireTeacher/' + this.props.docente['0'].emailDocente, {
            ritirato: 1,
        })
            .then(res => {
                if (res.data.message === "ok") { ToastsStore.success(this.state.firstName + ' ' + this.state.lastName + " è stato aggiunto alla lista docenti archiviati!"); this.refresh(); }
            })
            .catch(err => {
                return console.log(err);
            });
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
        this.props.getTeacherDetails();
        this.props.displayTable()
    }

    onclickModifyState = () => {
        this.setState({
            changeInfo: !this.state.changeInfo
        })
    }

    selectLesson = () => {
        if (this.props.docente.length === 1) {
            return (
                <>
                    <tr>
                        <td><h5>Lezione:</h5></td>
                        <td><h5>{this.props.docente['0'].lessonName}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore fatte:</h5></td>
                        <td><h5>{this.props.docente['0'].hoursOfLessons}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore di lezione:</h5></td>
                        <td><h5>{this.props.docente['0'].totalHours}</h5></td>
                    </tr>
                </>
            )
        } else {
            let totalHours = (this.props.docente.find(item => item.lessonName === this.state.value))
            return (
                <>

                    <tr>
                        <td><h5>Lezione:</h5></td>
                        <td><h5>
                            <Input type="select" name="select" id="select" className="w-auto" onChange={(e) => this.setState({ value: e.target.value })}>
                                {this.props.docente.map((item, i) => <option key={i} value={item.lessonName}>{item.lessonName}</option>)}
                            </Input>
                        </h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore fatte:</h5></td>
                        <td><h5>{this.state.value && totalHours['hoursOfLessons']}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore di lezione:</h5></td>
                        <td><h5>{this.state.value && totalHours['totalHours']}</h5></td>
                    </tr>
                </>
            )
        }
    }


    changeInfo = (changeInfo) => {

        if (!changeInfo) {
            return (
                <>
                    <Row className="m4">
                        <Col xs='8'>
                            <h2>{this.state.firstName.toUpperCase()} {this.state.lastName.toUpperCase()}</h2>
                            <h4>{this.props.docente['0'].emailDocente}</h4>
                        </Col>
                    </Row>
                    <hr />
                    <Table borderless responsive>
                        <tbody>
                            <tr>
                                <td><h5>Identificativo Calendario <br /> o compagnia</h5></td>
                                <td><h5>{this.props.docente['0'].companyName}</h5> </td>
                            </tr>
                            {this.selectLesson()}
                        </tbody>
                    </Table>
                </>
            )
        }
        else {
            let totalHours = (this.props.docente.find(item => item.lessonName === this.state.value))

            const regexLettere = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF'\s]*$/;
            const { firstName, lastName, companyName } = this.state
            const validationFirstName = firstName.length > 2 && regexLettere.test(firstName)
            const validationLastName = lastName.length > 2 && regexLettere.test(lastName)
            const validationIdentificativo = companyName.length >= 2 && regexLettere.test(companyName)

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
                            <td><h5>Identificativo Calendario <br /> o compagnia:</h5></td>
                            <td><Input name='companyName' onChange={this.handleChange} value={this.state.companyName} valid={validationIdentificativo} invalid={!validationIdentificativo} /></td>
                        </tr>
                        <tr>
                            <td><h5>Lezione:</h5></td>
                            <td><h5>{this.state.value && totalHours['lessonName']}</h5></td>
                        </tr>
                        <tr>
                            <td><h5>Ore fatte</h5></td>
                            <td><h5>{this.state.value && totalHours['hoursOfLessons']}</h5></td>
                        </tr>
                        <tr>
                            <td><h5>Ore di lezione:</h5></td>
                            <td><h5>{this.state.value && totalHours['totalHours']}</h5></td>
                        </tr>
                    </tbody>
                </Table>
            )
        }
    }

    renderButtons = (changeInfo) => {
        const regexLettere = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF'\s]*$/;
        const { firstName, lastName, companyName } = this.state
        const validationInput = firstName.length > 2 && regexLettere.test(firstName) && lastName.length > 2 && regexLettere.test(lastName) && companyName.length >= 2 && regexLettere.test(companyName)

        if (this.props.docente['0'].ritirato === 0) {
            if (!changeInfo) {
                return (
                    <>
                        <Button id="modifica" className="custom-btn" onClick={this.onclickModifyState}><i className="cui-settings icons font-2xl d-block mt-4"></i>&nbsp;<p>modifica</p></Button>
                        <Button color="danger" onClick={this.toggleWarning} className="mr-1"><i className="cui-user-unfollow icons font-2xl d-block mt-4"></i>&nbsp;<p>ritira</p>  </Button>
                    </>
                )
            } else {
                return (
                    <>
                        <Button className="custom-btn" onClick={this.callForUpdate} disabled={!validationInput}> <i className="cui-check icons font-2xl d-block mt-2"></i>conferma <br /> modifica</Button>
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
                        <b>{this.props.docente['0'].firstName} {this.props.docente['0'].lastName}</b> verrà inserito tra i docenti <b>archiviati</b>
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
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
            </div>
        )
    }
}

export default InfoDocente