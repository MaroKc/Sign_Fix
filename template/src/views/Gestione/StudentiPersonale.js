import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button, Input } from 'reactstrap';
import axios from 'axios'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

var QRCode = require('qrcode.react');

class StudentiPersonale extends Component {

    constructor(props) {
        super(props);

        this.state = {
            studenti: [],
            lessons: [],
            lezione: [],
            code: '',
            changeState: false,
            user: this.props.user,
            emailFirst: '',
            codiceFirst: ''
        }

    }

    componentDidMount() {
        console.log(this.state.user.email)
        if (this.state.user.email !== false) {
            this.getStudents();
            this.getLessonsPercentage();
            this.getLessons();
            this.getCode();
        }

    }

    getCode = () => {
        axios.get('http://localhost:8080/getCode/' + this.state.user.email)
            .then(res => res.data)
            .then((data, index) => {
                let code = '';
                code = data.data[0].code
                this.setState({ code });
            })
            .catch(err => console.error(err));
    }

    getStudents = () => {
        axios.get('http://localhost:8080/listStudents/' + this.state.user.id_course)
            .then(res => res.data)
            .then((data, index) => {
                const studenti = [];
                data.map(item => studenti.push({
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: item.email,
                    totalHours: item.totalHours,
                    hoursOfLessons: this.formatHours(item.hoursOfLessons),
                    percentage: item.percentage,
                }));
                this.setState({ studenti });
            })
            .catch(err => console.error(err));
    }

    getLessons = () => {
        var d = new Date()
        var data_appoggio = new Intl.DateTimeFormat('usa', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
        var data_scelta = data_appoggio.replace(/[.*+?^${}/()|[\]\\]/g, '-')
        axios.get('http://localhost:8080/lessons/' + data_scelta + '/' + this.state.user.id_course)
            .then(res => res.data)
            .then((data, index) => {
                const lezione = [];
                data.map(item => lezione.push({
                    name: item.name,
                    classroom: item.classroom,
                    id: item.id,
                    lesson: item.lesson,
                    startTime: item.startTime,
                    endTime: item.endTime
                }));

                this.setState({ lezione });

            })
            .catch(err => console.error(err));
    }

    getLessonsPercentage = () => {
        axios.get('http://localhost:8080/StudentPercentage/' + this.state.user.email)
            .then(res => res.data)
            .then((data, index) => {
                const lessons = [];
                data.map(item => lessons.push({
                    lessonName: item.lessonName,
                    totalHours: item.totalHours,
                    hoursOfLessons: this.formatHours(item.hoursOfLessons),
                    percentage: item.percentage,
                }));
                this.setState({ lessons });
            })
            .catch(err => console.error(err));
    }

    formatHours(hours) {
        var startLessonAppoggio = (hours.toString()).split('.')
        var startLesson = ''

        if (startLessonAppoggio[1]) {
            var startLessonSecondaParte = startLessonAppoggio[1].length === 1 ? startLessonAppoggio[1] + '0' : startLessonAppoggio[1]
            startLesson = startLessonAppoggio[0] + ': ' + startLessonSecondaParte
            return startLesson
        }
        else {
            return startLessonAppoggio[0]
        }
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
        return (sum / tipoLezione.length) ? (sum / tipoLezione.length).toFixed(0) + "%" : 0 + '%'
    }




    infoStudent = () => {

        let studente = this.state.studenti.find(studente => studente.email === this.state.user.email)
        return (
            <Row>
                <Col xs="6" className="my-auto text-center">
                    <h6 className="mb-2">Ore fatte:</h6>
                    <h2><b>{studente && studente.hoursOfLessons} / {studente && studente.totalHours}</b></h2>
                </Col>
                <Col xs="6" className="my-auto text-center">
                    <CircularProgressbar styles={buildStyles({ pathColor: studente && studente.percentage <= 80 ? `red` : '' })} value={studente && studente.percentage} counterClockwise={true} text={`${studente && studente.percentage}%`} className='mb-3' />
                </Col>
            </Row>
        )
    }

    // badgeStudent = () => {
    //     var d = new Date(),
    //     month = '' + (d.getMonth() + 1),
    //     day = '' + d.getDate(),
    //     year = d.getFullYear();

    // if (month.length < 2)
    //     month = '0' + month;
    // if (day.length < 2)
    //     day = '0' + day;

    // const currDate = [year, month, day].join('-');

    //     const todayLesson = this.state.lezioni.filter(lezione => lezione.date === currDate)
    //     const todayMattina =todayLesson.filter(lezione => lezione.startTime.split(':')[0] < 13)
    //     const todayPomeriggio =todayLesson.filter(lezione => lezione.startTime.split(':')[0] >= 13)

    //     axios.put('http://localhost:8080/teacherBadge', {
    //         email: this.props.user.email,
    //         date: currDate,
    //         startTime: d.getHours() < 13 ? todayMattina['0'].startTime : todayPomeriggio['0'].startTime,
    //         endTime: d.getHours() < 13 ? todayMattina['0'].endTime : todayPomeriggio['0'].endTime,
    //         lessonId: d.getHours() < 13 ? todayMattina['0'].lessonId : todayPomeriggio['0'].lessonId,
    //     })
    //         .then(res => {
    //             if (res.data.message === "ok") {
    //                 this.getSignature()
    //             }
    //             else if (res.data.message === "ko")console.log('problema')
    //         })
    //         .catch(err => {
    //             return console.log(err);
    //         });
    // }

    todayLesson() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();


        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        let data = new Date();

        let giorno = data.getDay();
        let mese = data.getMonth();


        if (giorno === 0) giorno = "Domenica";
        if (giorno === 1) giorno = "Lunedì";
        if (giorno === 2) giorno = "Martedì";
        if (giorno === 3) giorno = "Mercoledì";
        if (giorno === 4) giorno = "Giovedì";
        if (giorno === 5) giorno = "Venerdì";
        if (giorno === 6) giorno = "Sabato";

        if (mese === 0) mese = "Gennaio";
        if (mese === 1) mese = "Febbraio";
        if (mese === 2) mese = "Marzo";
        if (mese === 3) mese = "Aprile";
        if (mese === 4) mese = "Maggio";
        if (mese === 5) mese = "Giugno";
        if (mese === 6) mese = "Luglio";
        if (mese === 7) mese = "Agosto";
        if (mese === 8) mese = "Settembre";
        if (mese === 9) mese = "Ottobre";
        if (mese === 10) mese = "Novembre";
        if (mese === 11) mese = "Dicembre";


        let lezione = this.state.lezione
        if (lezione.length !== 0 && lezione['0'].classroom === 'lezione online') {
            return (
                lezione.map((item, i) =>
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
                                        // ((this.state.signature.filter(it =>it.email_signature === this.props.user.email && it.id === item.lessonId).length === 0) 
                                        // ? 
                                        <>
                                            <Button color="success" size="lg" className="mb-3" onClick={this.badgeTeacher} block> firma INGRESSSO </Button>
                                            <Button color="success" size="lg" className="mb-3" block> firma USCITA </Button>
                                        </>
                                        // : 
                                        // <h5 className="text-center mb3 text-info">Hai già firmato!</h5>)
                                        :
                                        <>
                                            <Button color="success" size="lg" className="mb-3" disabled block> firma INGRESSSO</Button>
                                            <Button color="success" size="lg" className="mb-3" disabled block> firma USCITA</Button>
                                        </>
                                }
                                <h3 className="text-center">{item.startTime} - {item.endTime}</h3>
                                <h5 className="text-center">{item.lesson} <br /> {item.classroom}</h5>

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

    changeState = () => {
        this.setState({ changeState: !this.state.changeState })
    }

    qr() {
        return (
            <>
                <div>
                    <div className="text-right">
                        <Button onClick={this.changeState} className="mb-4 mr-2">X</Button>
                    </div>

                    <div className="d-flex justify-content-center my-auto">
                        <QRCode size={275} value={this.state.code} />
                    </div>
                </div>

            </>
        )
    }

    normal = () => {

        let studente = this.state.studenti.find(studente => studente.email === this.state.user.email)
        if (!this.state.changeState) {
            return (
                <>
                    <div className="text-center">
                        <Button color="primary" size="lg" className="btn-pill mb-3" onClick={this.changeState}> <b>QR code</b></Button>
                    </div>
                    {this.todayLesson()}
                    <div className="text-right">
                        {/* {this.todayLesson()} */}
                        <div className="text-center mb-4">
                            <h3>{studente && (studente.firstName).charAt(0).toUpperCase() + studente.firstName.slice(1)} {studente && (studente.lastName).charAt(0).toUpperCase() + studente.lastName.slice(1)}</h3>
                            <h5>{studente && studente.email}</h5>
                        </div>
                    </div>
                    <hr />

                    {this.infoStudent()}

                </>
            )
        } else {
            return <>{this.qr()}</>
        }
    }



    buttonStep = (step) => {
        console.log(step)
        if (step === 0) {
            axios.get('http://localhost:8080/fitsticEmail/' + this.state.emailFirst)
                .then(res => res.data)
                .then((data, index) => {
                    if (data.error) {
                        console.log(data.message)
                    } else {
                        console.log(data.message)
                    }
                })
                .catch(err => console.error(err));
        } else if (step === 1) {
            console.log("indietro")
        } else if (step === 2) {
            axios.post('http://localhost:8080/fitsticEmail', {codice: this.state.codiceFirst, emailFit: this.state.user.emailFit, email: this.state.emailFirst})
                .then(res => res.data)
                .then((data, index) => {
                    if (data.error) {
                        console.log(data.message)
                    } else {
                        console.log(data.message)
                    }
                })
                .catch(err => console.error(err));
        }
    }

    EmailFirstChange = (e) => {
        this.setState({ emailFirst: e.target.value });
    }
    CodiceFirstChange = (e) => {
        this.setState({ codiceFirst: e.target.value });
    }

    fitsticEmail = () => {
        return (
            <div>
                <div>
                    <p>Inserire Email Tua</p>
                    <Input size="16" type="text" placeholder="Email" onChange={this.EmailFirstChange} />
                    <Button color="primary" size="lg" className="btn mb-3" onClick={() => this.buttonStep(0)}> <b>Avanti</b></Button>
                </div>
                <div>
                    <p>Inserire Codice</p>
                    <Input size="16" type="text" placeholder="Codice" onChange={this.CodiceFirstChange} />
                    <Button color="primary" size="lg" className="btn mb-3" onClick={() => this.buttonStep(1)}> <b>Indietro</b></Button>
                    <Button color="primary" size="lg" className="btn mb-3" onClick={() => this.buttonStep(2)}> <b>Invia</b></Button>
                </div>
            </div>
        )
    }

    render() {

        if (this.state.user.email !==false) {
            return this.normal();
        } else {
            return this.fitsticEmail();
        }

    }

}

export default StudentiPersonale;