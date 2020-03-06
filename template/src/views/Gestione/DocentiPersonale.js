import React, { Component } from 'react';
import { Col, Row, Table, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios'
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';





class DocentiPersonale extends Component {


    constructor(props) {
        super(props);
        this.state = {
            docenti: [],
            lezioni: []
        }

    }

    componentDidMount() {
        this.getTeachers();
    }


    getTeachers = () => {
        axios.get('http://localhost:8080/listTeachers')
            .then(res => {
                const docenti = [];
                res.data.data.map(item => docenti.push({
                    companyName: item.name,
                    lessonName: item.lesson,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    ritirato: item.ritirato,
                    companyId: item.companyId,
                    emailDocente: item.emailTeacher,
                    hoursOfLessons: this.formatHours(item.hoursOfLessons),
                    totalHours: this.formatHours(item.totalHours),
                }));
                this.setState({ docenti });
                this.getLesson();
            })
            .catch(err => console.error(err));
    }


    getLesson = () => {
        let docente = this.state.docenti.find(docente => docente.emailDocente === 'michele@info.com')

        axios.get('http://localhost:8080/lessonsTeacher/' + this.props.classe["id"] +"/" + docente.companyId)
            .then(res =>{
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

    formatHours (hours){
        var startLessonAppoggio= (hours.toString()).split('.')
        var startLesson= ''
  
        var startLessonPrimaParte=  startLessonAppoggio[0].length == 1 ? '0'+startLessonAppoggio[0] :  startLessonAppoggio[0]
        if(startLessonAppoggio[1]){
          var startLessonSecondaParte=  startLessonAppoggio[1].length == 1 ? startLessonAppoggio[1]+'0' :  startLessonAppoggio[1]
          startLesson= startLessonPrimaParte+': '+startLessonSecondaParte
          return startLesson
        }
        else{
          startLesson= startLessonPrimaParte+': 00'
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
                        data={{ columns: data.columns , rows: data.row }}
                        searching={false}
                        paging={false}
                        noBottomColumns={true}
                    />
                </CardBody>

            </div>
        );
    }


    infoTeacher() {

        let docente = this.state.docenti.find(docente => docente.emailDocente === 'michele@info.com')
        let dettaglioDocente = this.state.docenti.find(dettaglioDocente => dettaglioDocente.companyId === docente.companyId)


        return (
            <div className="d-flex justify-content-center mt-5">
                <Card className="w-75">
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
                                    <td><h5>{dettaglioDocente && dettaglioDocente.companyName === 'michele@info.com' ? '' : dettaglioDocente && dettaglioDocente.companyName}</h5> </td>
                                </tr>
                                <tr>
                                    <td><h5>Lezione:</h5></td>
                                    <td><h5>{dettaglioDocente && dettaglioDocente.lessonName}</h5></td>
                                </tr>
                                <tr>
                                    <td><h5>Ore fatte:</h5></td>
                                    <td><h5>{docente && docente.hoursOfLessons}</h5></td>
                                </tr>
                                <tr>
                                    <td><h5>Ore di lezione:</h5></td>
                                    <td><h5>{dettaglioDocente && dettaglioDocente.totalHours}</h5></td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button color="success" size="lg" block> TIMBRA </Button>
                    </CardBody>


                {this.tabPane()}

                </Card>


            </div>
        );
    }




    render() {
        return this.infoTeacher()
    }
}

export default DocentiPersonale;