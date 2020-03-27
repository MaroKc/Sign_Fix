import React, { Component, Fragment } from 'react';
import {Table, Card, CardHeader, CardBody, Button, Input, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { MDBDataTable, MDBBtn, MDBAlert, MDBProgress } from 'mdbreact';
import axios from 'axios'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';




class DocentiPersonale extends Component {


    constructor(props) {
        super(props);
        this.state = {
            lezioni: [],
            docenti: [],
            dettagliDocente: [],
            value: '',
            changeState: false,
            warning: false,
            password1: '',
            password2: '',
            signature: [],
        }
    }



    componentDidMount() {
        this.getTeachers();
        this.getTeacherDetails();
        this.getSignature()
        console.log(this.state.signature)
    }


    getTeachers = () => {
        axios.get('http://localhost:8080/listTeachers')
            .then(res => {
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
                this.getLesson();
            })
            .catch(err => console.error(err));
    }

    modifyPassword = () => {
            axios.put('http://localhost:8080/modifyPassword', {
                password1: this.state.password1,
                password2: this.state.password2,
                email: this.props.user.email
            })
                .then(res => {
                    
                    if (res.data.message === "ok") 
                        {this.setState({warning: false})
                        ToastsStore.success("la password è stata cambiata con successo")}
                    else if (res.data.message === "ko") ToastsStore.warning("le due password non sono uguali")
                })
                .catch(err => {
                    return console.log(err);
                });
    }

    getTeacherDetails = () => {
        axios.get('http://localhost:8080/teacherDetails')
            .then(res => {
                let dettagliDocente = [];
                res.data.data.map(item => dettagliDocente.push({
                    companyName: item.name === item.emailTeacher ? "" : item.name,
                    lessonName: item.lesson,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    ritirato: item.ritirato,
                    companyId: item.companyId,
                    emailDocente: item.emailTeacher,
                    hoursOfLessons: this.formatHoursSemplice(item.hoursOfLessons),
                    totalHours: this.formatHoursSemplice(item.totalHours),
                    clickEvent: () => this.displayCard(item.emailTeacher)
                }));
                let groupedPeople = this.groupBy(dettagliDocente, 'emailDocente');

                dettagliDocente = groupedPeople[(dettagliDocente.find((docente) => docente.emailDocente === this.props.user.email))['emailDocente']]
                this.setState({
                    dettagliDocente,
                    value: dettagliDocente['0'].lessonName
                })
            })
            .catch(err => console.error(err));
    }

    badgeTeacher = () => {
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    const currDate = [year, month, day].join('-');
    
        const todayLesson = this.state.lezioni.filter(lezione => lezione.date === currDate)
        const todayMattina =todayLesson.filter(lezione => lezione.startTime.split(':')[0] < 13)
        const todayPomeriggio =todayLesson.filter(lezione => lezione.startTime.split(':')[0] >= 13)

        axios.put('http://localhost:8080/teacherBadge', {
            email: this.props.user.email,
            date: currDate,
            startTime: d.getHours() < 13 ? todayMattina['0'].startTime : todayPomeriggio['0'].startTime,
            endTime: d.getHours() < 13 ? todayMattina['0'].endTime : todayPomeriggio['0'].endTime,
            lessonId: d.getHours() < 13 ? todayMattina['0'].lessonId : todayPomeriggio['0'].lessonId,
        })
            .then(res => {
                if (res.data.message === "ok") {
                    this.getSignature()
                }
                else if (res.data.message === "ko")console.log('problema')
            })
            .catch(err => {
                return console.log(err);
            });
    }

    getSignature = () => {
        
            axios.get('http://localhost:8080/getSignature')
            .then(res => {
                this.setState({signature: res.data.data})
                })
            .catch(err => console.error(err));
        }
    

    getLesson = () => {
        let docente = this.state.docenti.find(docente => docente.emailDocente === this.props.user.email)
        axios.get('http://localhost:8080/lessonsTeacher/' + docente.companyId)
            .then(res => {
                const lezioni = [];
                res.data.map(item => lezioni.push({
                    date: item.date,
                    lessonId: item.id,
                    classroom: item.classroom,
                    lessonName: item.lesson,
                    startTime: this.formatHours(item.startTime),
                    endTime: this.formatHours(item.endTime),
                    percentage: item.percentuale.toFixed(0) + "%"
                }));
                this.setState({ lezioni });
            })
            .catch(err => console.error(err));
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

    formatHoursSemplice(hours) {
        var startLessonAppoggio = (hours.toString()).split('.')
        var startLesson = ''

        if (startLessonAppoggio[1]) {
            var startLessonSecondaParte = startLessonAppoggio[1].length == 1 ? startLessonAppoggio[1] + '0' : startLessonAppoggio[1]
            startLesson = startLessonAppoggio[0] + ': ' + startLessonSecondaParte
            return startLesson
        }
        else {
            return startLessonAppoggio[0]
        }
    }

    formatHours(hours) {
        var startLessonAppoggio = (hours.toString()).split('.')
        var startLesson = ''

        var startLessonPrimaParte = startLessonAppoggio[0].length == 1 ? '0' + startLessonAppoggio[0] : startLessonAppoggio[0]
        if (startLessonAppoggio[1]) {
            var startLessonSecondaParte = startLessonAppoggio[1].length == 1 ? startLessonAppoggio[1] + '0' : startLessonAppoggio[1]
            startLesson = startLessonPrimaParte + ': ' + startLessonSecondaParte
            return startLesson
        }
        else {
            startLesson = startLessonPrimaParte + ': 00'
            return startLesson
        }
    }

    changeState = () => {
        this.setState({
            changeState: !this.state.changeState
        })
    }
    changeState2 = () => {
        this.setState({
            changeState2: !this.state.changeState2
        })
    }
    
    getPercentage() {
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        const currDate = [year, month, day].join('-');

        const pastLesson = this.state.lezioni.filter(lezione => lezione.date < currDate).map(filtredDate => (filtredDate));
            var initialValue = 0;
        let tipoLezione = pastLesson.filter(item => item.lessonName === this.state.value)
        var sum = tipoLezione.reduce(
            (accumulator, currentValue) => accumulator + parseInt(currentValue.percentage.split("%"), 10)
            , initialValue
        );
        return (sum / tipoLezione.length) ? (sum / tipoLezione.length).toFixed(0)+"%" : 0+'%'
    }

    formattedDate = (d) => {
        let date = new Date(d)
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${day}/${month}/${year}`;
    }


    selectLesson = () => {
        let docente = this.state.docenti.find(docente => docente.emailDocente === this.props.user.email)
        let dettaglioDocente = this.state.dettagliDocente.find(dettaglioDocente => dettaglioDocente.companyId === docente.companyId)
        let totalHours = (this.state.dettagliDocente.find(item => item.lessonName === this.state.value))
        if (this.state.dettagliDocente.length === 1) {
            return (
                <>
                              <h3 className="text-left text-info">{dettaglioDocente.lessonName}</h3>
                    <Row>
                        <Col xs="6" className="mt-4 mb-4 text-center">
                            <h6 className="mb-2">Ore fatte:</h6>
                            <h2><b>{this.state.value && totalHours['hoursOfLessons']} / {this.state.value && totalHours['totalHours']}</b></h2>
                        </Col>
                        <Col xs="6" className="mt-4 mb-4 text-center">
                            <h6 className="mb-2">Percentuale presenze:</h6>
                            <h2><b>{this.getPercentage()}</b></h2>
                        </Col>
                    </Row>
                </>
            )
        } else {
        
            return (
                <>
                    {/* <th>
                            <Input type="select" name="select" id="select" className="w-auto" onChange={(e) => this.setState({ value: e.target.value })}>
                                {this.state.dettagliDocente.map((item, i) => <option key={i} value={item.lessonName}>{item.lessonName}</option>)}
                            </Input>
                        </th> */}
                    <div className="d-flex justify-content-start mt-3 ml-3 mb-3">
                        {this.state.dettagliDocente.map((item, i) =>
                            <Button
                                value={item.lessonName}
                                color={this.state.value === item.lessonName
                                    ?
                                    'primary'
                                    :
                                    'ghost-primary'}
                                className={this.state.value === item.lessonName
                                    ?
                                    'disabled active btn btn-pill mr-3 h-50'
                                    :
                                    'btn btn-pill mr-3 h-50'}
                                onClick={(e) => this.setState({ value: e.target.value })}
                                key={i}>
                                {item.lessonName}
                            </Button>
                        )}
                    </div>
                    <Row>
                        <Col xs="6" className="mt-4 mb-4 text-center">
                            <h6 className="mb-2">Ore fatte:</h6>
                            <h2><b>{this.state.value && totalHours['hoursOfLessons']} / {this.state.value && totalHours['totalHours']}</b></h2>
                        </Col>
                        <Col xs="6" className="mt-4 mb-4 text-center">
                            <h6 className="mb-2">Percentuale presenze:</h6>
                            <h2><b>{this.getPercentage()}</b></h2>
                        </Col>
                    </Row>
                </>
            )

        }

    }




    pastLessons() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        const currDate = [year, month, day].join('-');

        const pastLesson = this.state.lezioni.filter(lezione => lezione.date < currDate).map(filtredDate => (filtredDate));


        const data = {
            columns: [
                {
                    label: 'Data',
                    field: 'date',
                },
                {
                    label: 'Presenze',
                    field: 'percentage',
                },
                {
                    label: 'Lezione',
                    field: 'lessonName',
                },
                {
                    label: 'Classe',
                    field: 'classroom',
                },
            ],
            row: pastLesson
        };

        if (this.state.changeState) {
            return (
                <div className="mb-4">
                    <CardBody>
                        <MDBDataTable
                            responsive
                            hover
                            data={{ columns: data.columns, rows: data.row }}
                            searching={false}
                            paging={false}
                            noBottomColumns={true}
                        />
                    </CardBody>

                </div>
            );
        }
    }



    futureLessons() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        const currDate = [year, month, day].join('-');

        const futureLesson = this.state.lezioni.filter(lezione => lezione.date > currDate).map(filtredDate => (filtredDate));

        const data = {
            columns: [
                {
                    label: 'Data',
                    field: 'date',
                },
                {
                    label: 'Classe',
                    field: 'classroom',
                },
                {
                    label: 'Orario Inizio',
                    field: 'startTime',
                },
                {
                    label: 'Orario Fine',
                    field: 'endTime',
                },
                {
                    label: 'Lezione',
                    field: 'lessonName',
                },
            ],
            row: futureLesson
        };
        if (futureLesson.length !== 0 && !this.state.changeState) {
            return (
                <div className="mb-4">
                    <CardBody>
                        <MDBDataTable
                            responsive
                            hover
                            data={{ columns: data.columns, rows: data.row }}
                            searching={false}
                            paging={false}
                            noBottomColumns={true}
                        />
                    </CardBody>

                </div>
            )
        } else if (!this.state.changeState) { return <h3 className="mb-4 text-center">A quanto pare non hai lezioni in programma!</h3> }
    }


    todayLesson() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();


        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        const currDate = [year, month, day].join('-');

        let data = new Date();

        let giorno = data.getDay();
        let mese = data.getMonth();



        if(giorno == 0) giorno = "Domenica";
        if(giorno == 1) giorno = "Lunedì";
        if(giorno == 2) giorno = "Martedì";
        if(giorno == 3) giorno = "Mercoledì";
        if(giorno == 4) giorno = "Giovedì";
        if(giorno == 5) giorno = "Venerdì";
        if(giorno == 6) giorno = "Sabato";
        
        if(mese == 0) mese = "Gennaio";
        if(mese == 1) mese = "Febbraio";
        if(mese == 2) mese = "Marzo";
        if(mese == 3) mese = "Aprile";
        if(mese == 4) mese = "Maggio";
        if(mese == 5) mese = "Giugno";
        if(mese == 6) mese = "Luglio";
        if(mese == 7) mese = "Agosto";
        if(mese == 8) mese = "Settembre";
        if(mese == 9) mese = "Ottobre";
        if(mese == 10) mese = "Novembre";
        if(mese == 11) mese = "Dicembre";

        const todayLesson = this.state.lezioni.filter(lezione => lezione.date === currDate)
       console.log(todayLesson.map(item => this.state.signature.filter(it =>it.email_signature === this.props.user.email && it.id === item.lessonId).length === 0))

        if (todayLesson.length !== 0) {
            return (
                todayLesson.map(item =>
                   
                <Card>
                <CardHeader className="my-auto text-center">
                   <h4> <b>{giorno + ' ' + day + ' ' + mese + ' ' + year}</b></h4>
                </CardHeader>
                <div>   
                    <CardBody>
                    {
                    data.getHours() >= item.startTime.split(':')[0] && data.getHours() <= item.endTime.split(':')[0] 
                    // && data.getMinutes() >= parseInt(item.startTime.split(':')[1].trim()) && data.getMinutes() <= parseInt(item.endTime.split(':')[1].trim())
                    ? 
                        ((this.state.signature.filter(it =>it.email_signature === this.props.user.email && it.id === item.lessonId).length === 0) 
                        ? 
                        <Button color="success" size="lg" className="mb-3" onClick={this.badgeTeacher} block> TIMBRA </Button> 
                        : 
                        <h5 className="text-center mb3 text-info">Hai già firmato!</h5>)
                    : 
                    <Button color="success" size="lg" className="mb-3" disabled block> timbra</Button>
                }
                    <h3 className="text-center">{item.startTime} - {item.endTime}</h3>
                    <h5 className="text-center">{item.classroom}, {item.lessonName}</h5>
                 
                    </CardBody>
                </div>
            </Card>
                )
            )
        } else {
            return (
                <Card>
                    <CardHeader className="my-auto text-center">
                        <h4> <b>{giorno + ' ' + day + ' ' + mese + ' ' + year}</b></h4>
                    </CardHeader>
                </Card>
            )
        }
    }

    toggleWarning = () => {
        this.setState({
            warning: !this.state.warning,
        });
    }
    handleChange = (event) => {
        let name = event.target.name;
        let val = event.target.value;

        this.setState({
            [name]: val,
        });
    }
    openModalPassword = () => {
            return (
                <>
                    <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
                        className={'modal-primary ' + this.props.className}>
                        <ModalBody>
                            <Table borderless responsive>
                                <tbody>
                                    <tr>
                                        <td>Nuova password:</td>
                                        <td><Input type='password' name='password1' onChange={this.handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td>Conferma password:</td>
                                        <td><Input type='password' name='password2' onChange={this.handleChange} /></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.modifyPassword}>Continua</Button>{' '}
                            <Button outline color="dark" onClick={this.toggleWarning}>Cancella</Button>
                        </ModalFooter>
                    </Modal>
                </>
            )
    }

    infoTeacher() {
        let docente = this.state.docenti.find(docente => docente.emailDocente === this.props.user.email)
        let dettaglioDocente = this.state.dettagliDocente.find(dettaglioDocente => dettaglioDocente.companyId === docente.companyId)
        return (
            <div>
                <div  className="text-right">
                    {this.openModalPassword()}
                    <Button color='link' onClick={this.toggleWarning}> Cambia password </Button>
                    {this.todayLesson()}
                    <div className="text-center mb-4">
                    <h3>{docente && docente.firstName} {docente && docente.lastName}</h3>
                    <h5>{docente && docente.emailDocente}</h5>
                </div>
                <hr />
                       {this.selectLesson()}
                     
                </div>
                <hr />
                <div className="d-flex justify-content-around mb-4">
                    {this.state.changeState ? <Button disabled={true}  color="primary" onClick={this.changeState}> <h5>Lezioni Passate</h5></Button> : <Button outline color="primary" onClick={this.changeState}> <h5>Lezioni Passate</h5></Button>}

                    {!this.state.changeState ? <Button disabled={true} color="primary" onClick={this.changeState}> <h5>Lezioni Future</h5></Button> : <Button outline color="primary" onClick={this.changeState}> <h5>Lezioni Future</h5></Button>}
                </div>

                {this.futureLessons()}
                {this.pastLessons()}

                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground/>
            </div>
        );
    }
    render() {
        return this.infoTeacher()
    }
}

export default DocentiPersonale;