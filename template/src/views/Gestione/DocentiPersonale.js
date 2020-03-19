import React, { Component } from 'react';
import { Col, Row, Table, Card, CardHeader, CardBody, Button, Input } from 'reactstrap';
import { MDBDataTable } from 'mdbreact';
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
        }
    }



    componentDidMount() {
        this.getTeachers();
        this.getTeacherDetails();

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

                dettagliDocente = groupedPeople[(dettagliDocente.find((docente) => docente.emailDocente === 'matteo@info.com'))['emailDocente']]
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
        let docente = this.state.docenti.find(docente => docente.emailDocente === 'matteo@info.com')

        axios.get('http://localhost:8080/lessonsTeacher/' + docente.companyId)
            .then(res => {
                const lezioni = [];
                res.data.map(item => lezioni.push({
                    date: item.date,
                    classroom: item.classroom,
                    lessonName: item.lesson,
                    startTime: this.formatHours(item.startTime),
                    endTime: this.formatHours(item.endTime)
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

    tabPane() {


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
                    label: 'Lezione',
                    field: 'lessonName',
                },
                {
                    label: 'Orario Inizio',
                    field: 'startTime',
                },
                {
                    label: 'Orario Fine',
                    field: 'endTime',
                }
            ],
            row: this.state.lezioni
        };

        return (
            <div>
                <CardHeader className="text-center font-weight-bold">
                    <h5>Lezioni</h5>
                </CardHeader>
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


    selectLesson = () => {


        let docente = this.state.docenti.find(docente => docente.emailDocente === 'matteo@info.com')
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
                </>
            )
        } else {
            let totalHours = (this.state.dettagliDocente.find(item => item.lessonName === this.state.value))
            return (
                <>

                    <tr>
                        <td><h5>Lezione:</h5></td>
                        <td><h5>
                            <Input type="select" name="select" id="select" className="w-auto" onChange={(e) => this.setState({ value: e.target.value })}>
                                {this.state.dettagliDocente.map(item => <option value={item.lessonName}>{item.lessonName}</option>)}
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

    /* formatDate() {
         var d = new Date(),
             month = '' + (d.getMonth() + 1),
             day = '' + d.getDate(),
             year = d.getFullYear();
 
         if (month.length < 2)
             month = '0' + month;
         if (day.length < 2)
             day = '0' + day;
 
         this.setState({ currDate : [year, month, day].join('-') })
 
         
     }*/


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
                    label: 'Classe',
                    field: 'classroom',
                },
                {
                    label: 'Lezione',
                    field: 'lessonName',
                },
                {
                    label: 'Orario Inizio',
                    field: 'startTime',
                },
                {
                    label: 'Orario Fine',
                    field: 'endTime',
                }
            ],
            row: pastLesson
        };

        return (
            <div>
                <CardHeader className="text-center font-weight-bold">
                    <h5>Lezioni Passate</h5>
                </CardHeader>
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
                    label: 'Lezione',
                    field: 'lessonName',
                },
                {
                    label: 'Orario Inizio',
                    field: 'startTime',
                },
                {
                    label: 'Orario Fine',
                    field: 'endTime',
                }
            ],
            row: futureLesson
        };

        return (
            <div>

                <CardHeader className="text-center font-weight-bold">
                    <h5>Lezioni Future</h5>
                </CardHeader>
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

        let todayLesson = [];

        todayLesson = this.state.lezioni.filter(lezione => lezione.date === currDate);

        const dataControl = this.state.lezioni.filter(lezione => (lezione.date))

        

       

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
                    label: 'Lezione',
                    field: 'lessonName',
                },
                {
                    label: 'Orario Inizio',
                    field: 'startTime',
                },
                {
                    label: 'Orario Fine',
                    field: 'endTime',
                }
            ],
            row: todayLesson
        };


        //console.log(this.state.lezioni.map(lezione => lezione.date === currDate))
       
       console.log(todayLesson.length)

        if (todayLesson.length !== 0) {
            return (
                <div>
                <div>
                    <Button color="success" size="lg" block> TIMBRA </Button>
                </div>
                <div>

                </div>
                <div>


                    <CardHeader className="text-center font-weight-bold">
                        <h5>Lezioni Odierne</h5>
                    </CardHeader>
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
            </div>
            
                
            )
        } else {
            return (
                <Button color="success" size="lg" block disabled> TIMBRA </Button>
               
            )
        }


    }


    infoTeacher() {

        let docente = this.state.docenti.find(docente => docente.emailDocente === 'matteo@info.com')
        let dettaglioDocente = this.state.dettagliDocente.find(dettaglioDocente => dettaglioDocente.companyId === docente.companyId)


        return (

            <div className="d-flex justify-content-center ml-3">   
                <Card className="w-75">
                {this.todayLesson()}
                    <CardHeader className="text-center font-weight-bold">
                        <h5>AREA PERSONALE</h5>
                    </CardHeader>
                    <CardBody>
                        <Table borderless responsive>
                            <tbody>
                                <tr>
                                    <td><h5>Nome:</h5></td>
                                    <td><h5>{docente && docente.firstName}</h5></td>
                                </tr>
                                <tr>
                                    <td><h5>Cognome: </h5></td>
                                    <td><h5 >{docente && docente.lastName}</h5></td>
                                </tr>
                                <tr>
                                    <td><h5>Nome azienda:</h5></td>
                                    <td><h5>{dettaglioDocente && dettaglioDocente.companyName === 'matteo@info.com' ? '' : dettaglioDocente && dettaglioDocente.companyName}</h5> </td>
                                </tr>
                                {this.selectLesson()}
                            </tbody>
                        </Table>

                    </CardBody>
                    {this.futureLessons()}
                    {this.pastLessons()}
                </Card>
            </div>
        );
    }




    render() {
        return this.infoTeacher()
    }
}

export default DocentiPersonale;