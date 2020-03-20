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
        axios.get('http://localhost:8080/listStudents/'+ this.props.user.id_course)
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

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    infoStudent = () => {

        let studente = this.state.studenti.find(studente => studente.email === this.props.user.email)

        return(

            <div className="mt-5">
                <div className="text-center font-weight-bold">
                    <h3 className="d-inline-block text-center"><b>{studente && studente.firstName.toUpperCase() + ' ' + studente.lastName.toUpperCase()}</b> </h3>
                    <h6 className="d-block text-center">{this.props.user.email}</h6>
                </div>
             
                <Table borderless responsive>
                    <tbody>
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
            </div>
        )

    }

    render() {
        return this.infoStudent()
    }

}

export default StudentiPersonale;