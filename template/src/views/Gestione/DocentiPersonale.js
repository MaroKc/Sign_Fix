import React, { Component } from 'react';
import { Table, Card, CardHeader, CardBody,  Input, Row, Col } from 'reactstrap';
import { MDBDataTable, MDBBtn } from 'mdbreact';
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

        }
    }



    componentDidMount() {
        this.getTeachers();
        this.getTeacherDetails();
        console.log(this.state.changeState)
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

    getLesson = () => {
        let docente = this.state.docenti.find(docente => docente.emailDocente === this.props.user.email)

        axios.get('http://localhost:8080/lessonsTeacher/' + docente.companyId)
            .then(res => {
                const lezioni = [];
                res.data.map(item => lezioni.push({
                    date: item.date,
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
        var initialValue = 0;
        let tipoLezione = this.state.lezioni.filter(item => item.lessonName === this.state.value)
        var sum = tipoLezione.reduce(
            (accumulator, currentValue) => accumulator + parseInt(currentValue.percentage.split("%"), 10)
            , initialValue
        );

        return (sum / tipoLezione.length).toFixed(0) + "%"
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

        if (this.state.dettagliDocente.length === 1) {
            return (
                <>
                    <tr>
                        <td><h5>Lezione:</h5></td>
                        <td><h5>{dettaglioDocente['0'] && dettaglioDocente['0'].lessonName}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore fatte:</h5></td>
                        <td><h5>{dettaglioDocente && dettaglioDocente.hoursOfLessons}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Ore di lezione:</h5></td>
                        <td><h5>{dettaglioDocente && dettaglioDocente.totalHours}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>Percentuale presenze:</h5></td>
                        <td><h5>{this.getPercentage()}</h5></td>
                    </tr>
                </>
            )
        } else {
            let totalHours = (this.state.dettagliDocente.find(item => item.lessonName === this.state.value))
            return (
                <>
                    {/* <th>
                            <Input type="select" name="select" id="select" className="w-auto" onChange={(e) => this.setState({ value: e.target.value })}>
                                {this.state.dettagliDocente.map((item, i) => <option key={i} value={item.lessonName}>{item.lessonName}</option>)}
                            </Input>
                        </th> */}
                    <div className="d-flex justify-content-start mt-3 ml-3 mb-3">{this.state.dettagliDocente.map((item, i) => <MDBBtn value={item.lessonName} color={this.state.value === item.lessonName ? 'primary' : 'ghost-primary'} className={this.state.value === item.lessonName ? 'disabled active btn btn-pill mr-3 h-50' : 'btn btn-pill mr-3 h-50'} onClick={(e) => this.setState({ value: e.target.value })} key={i}>{item.lessonName}</MDBBtn>)}</div>
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

        console.log(pastLesson.map(i => this.formattedDate(i.date)))

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



        if (giorno == 0) giorno = "Domenica";
        if (giorno == 1) giorno = "Lunedì";
        if (giorno == 2) giorno = "Martedì";
        if (giorno == 3) giorno = "Mercoledì";
        if (giorno == 4) giorno = "Giovedì";
        if (giorno == 5) giorno = "Venerdì";
        if (giorno == 6) giorno = "Sabato";

        if (mese == 0) mese = "Gennaio";
        if (mese == 1) mese = "Febbraio";
        if (mese == 2) mese = "Marzo";
        if (mese == 3) mese = "Aprile";
        if (mese == 4) mese = "Maggio";
        if (mese == 5) mese = "Giugno";
        if (mese == 6) mese = "Luglio";
        if (mese == 7) mese = "Agosto";
        if (mese == 8) mese = "Settembre";
        if (mese == 9) mese = "Ottobre";
        if (mese == 10) mese = "Novembre";
        if (mese == 11) mese = "Dicembre";

        const todayLesson = this.state.lezioni.filter(lezione => lezione.date === currDate)

        if (todayLesson.length !== 0) {
            return (
                <Card>
                    <CardHeader className="my-auto text-center">
                        <h4> <b>{giorno + ' ' + day + ' ' + mese + ' ' + year}</b></h4>
                    </CardHeader>
                    <div>
                        <CardBody>
                            <MDBBtn color="success" size="lg" className="mb-3" block> TIMBRA </MDBBtn>
                            <h3 className="text-center">{todayLesson['0'].startTime} - {todayLesson['0'].endTime}</h3>
                            <h5 className="text-center">{todayLesson['0'].classroom}, {todayLesson['0'].lessonName}</h5>

                        </CardBody>
                    </div>
                </Card>
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

    infoTeacher() {
        let docente = this.state.docenti.find(docente => docente.emailDocente === this.props.user.email)
        let dettaglioDocente = this.state.dettagliDocente.find(dettaglioDocente => dettaglioDocente.companyId === docente.companyId)

        return (
            <div>
                <div>
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
                    {this.state.changeState ? <MDBBtn disabled color="primary" onClick={this.changeState}> <h5>Lezioni Passate</h5></MDBBtn> : <MDBBtn color="primary" onClick={this.changeState}> <h5>Lezioni Passate</h5></MDBBtn>}

                    {!this.state.changeState ? <MDBBtn disabled={true} color="primary" onClick={this.changeState}> <h5>Lezioni Future</h5></MDBBtn> : <MDBBtn outline color="primary" onClick={this.changeState}> <h5>Lezioni Future</h5></MDBBtn>}
                </div>
                

                {this.futureLessons()}
                {this.pastLessons()}
            </div>
        );
    }

    render() {
        return this.infoTeacher()
    }
}

export default DocentiPersonale;