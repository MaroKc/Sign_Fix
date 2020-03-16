import React, { Component } from 'react';
import { Table, Card, CardHeader, CardBody, Button } from 'reactstrap';
import axios from 'axios'


class StudentiPersonale extends Component {
    constructor(props) {
        super(props);
        this.state = {
           studenti: []
        }

    }

    componentDidMount() {
        this.getStudents();
    }


    getStudents = () => {
        axios.get('http://localhost:8080/listStudents/'+ this.props.classe["id"])
          .then(res => res.data)
          .then((data, index) => {
            const studenti = [];
            data.map(item => studenti.push({
              firstName: item.firstName,
              lastName: item.lastName,
              email: item.email,
              hoursOfLessons: this.formatHours(item.hoursOfLessons),
              percentage: item.percentage,
            }));
            this.setState({ studenti });
          })
          .catch(err => console.error(err));
      }


      formatHours(hours) {
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

    infoStudent() {

        let studente = this.state.studenti.find(studente => studente.email === 'acookek@nps.gov')

        return(

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
                                    <td><h5>{studente && studente.firstName}</h5></td>
                                </tr>
                                <tr>
                                    <td><h5>Cognome: </h5></td>
                                    <td><h5 >{studente && studente.lastName}</h5></td>
                                </tr>
                                <tr>
                                    <td><h5>Email:</h5></td>
                                    <td><h5>{studente && studente.email}</h5> </td>
                                </tr>
                                <tr>
                                    <td><h5>Ore fatte:</h5></td>
                                    <td><h5>{studente && studente.hoursOfLessons}</h5></td>
                                </tr>
                                <tr>
                                    <td><h5>Percentuale Presenze:</h5></td>
                                    <td><h5>{studente && studente.percentage}</h5></td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button color="success" size="lg" block> BEDGE </Button>
                    </CardBody>

                </Card>
        </div>
        )

    }

    render() {
        return this.infoStudent()
    }

}

export default StudentiPersonale;