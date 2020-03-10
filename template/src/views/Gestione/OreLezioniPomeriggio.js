
import React from 'react'
import { Card, Col, Row, Button, Input, Table } from 'reactstrap';
import axios from 'axios'
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

class OreLezioniPomeriggio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            changeInfoMattina: false,
            changeInfoPomeriggio: false,
            displayCard: this.props.displayCard,

            startTimePomeriggio: this.props.studentePomeriggio.startTime,
            endTimePomeriggio: this.props.studentePomeriggio.endTime,
            oreStartTimePomeriggio: '',
            minutiStartTimePomeriggio: '',
            oreEndTimePomeriggio: '',
            minutiEndTimePomeriggio: '',
        }
    }

    componentDidMount(){
        this.splitOrarioPomeriggio();
    }

    splitOrarioPomeriggio(){
        this.setState({
            oreStartTimePomeriggio: this.state.startTimePomeriggio === "assente" ? 0 : this.state.startTimePomeriggio.split(":")[0],
            minutiStartTimePomeriggio: this.state.startTimePomeriggio === "assente" ? 0 : this.state.startTimePomeriggio.split(":")[1].trim(),
        
            oreEndTimePomeriggio: this.state.endTimePomeriggio === "assente" ? 0 : this.state.endTimePomeriggio.split(":")[0],
            minutiEndTimePomeriggio: this.state.endTimePomeriggio === "assente" ? 0 : this.state.endTimePomeriggio.split(":")[1].trim(),
        })
    }


    callForUpdatePomeriggio = () => {
        axios.put('http://localhost:8080/updateSignature/'+this.props.studentePomeriggio.idLesson, {
            startTime: this.state.oreStartTimePomeriggio + "." + (this.state.minutiStartTimePomeriggio/0.6).toFixed(0),
            endTime: this.state.oreEndTimePomeriggio + "." + (this.state.minutiEndTimePomeriggio/0.6).toFixed(0),
            email: this.props.studentePomeriggio.emailStudent,   
        })
            .then(res => {
                if (res.data.message === "ok"){this.refresh()}
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


refresh = () => {
        this.props.getLessons();
        this.props.displayTable()
    }


    changeInfoPomeriggio = () => {
        const Ore = /([0-1][0-9]|2[0-3])/
        const validationOreStart =
            Ore.test(this.state.oreStartTimePomeriggio) &&
            this.state.oreStartTimePomeriggio >= this.formatHours(this.props.lezionePomeriggio.startTime).split(":")[0] &&
            this.state.oreStartTimePomeriggio <= this.formatHours(this.props.lezionePomeriggio.endTime).split(":")[0] &&
            this.state.oreStartTimePomeriggio.length === 2

        const validationOreEnd = 
            Ore.test(this.state.oreEndTimePomeriggio) &&
            this.state.oreEndTimePomeriggio <= this.formatHours(this.props.lezionePomeriggio.endTime).split(":")[0] &&
            this.state.oreEndTimePomeriggio >= this.formatHours(this.props.lezionePomeriggio.startTime).split(":")[0] &&
            this.state.oreEndTimePomeriggio.length === 2

        const Minuti = /[0-5][0-9]/
        const validationMinutiStart = Minuti.test(this.state.minutiStartTimePomeriggio) && this.state.minutiStartTimePomeriggio.length === 2
        const validationMinutiEnd = Minuti.test(this.state.minutiEndTimePomeriggio) && this.state.minutiEndTimePomeriggio.length === 2
        const validation = validationOreStart && validationOreEnd && validationMinutiStart && validationMinutiEnd


        return (
            <>
                <div className="text-center mt-3"> <h4>{this.props.studentePomeriggio.firstName} {this.props.studentePomeriggio.lastName}</h4></div>

                <Row>
                    <Col md="9">


                        <Row className="m-3">
                            <Col md="7" className="text-center">
                                <h5> <b>Inizio</b> lezione:</h5>
                            </Col>
                            <Col md="5">
                                <Row>
                                    <Col>
                                        <Input invalid={!validationOreStart} className="text-center" name='oreStartTimePomeriggio' onChange={this.handleChange} value={this.state.oreStartTimePomeriggio} />
                                    </Col>
                                    :
                                        <Col >
                                        <Input invalid={!validationMinutiStart} className="text-center" name='minutiStartTimePomeriggio' onChange={this.handleChange} value={this.state.minutiStartTimePomeriggio} />
                                    </Col>
                                </Row>

                            </Col>
                        </Row>

                        <Row className="m-3">
                            <Col md="7" className="text-center">
                                <h5> <b>Fine</b> lezione:</h5>
                            </Col>
                            <Col md="5">
                                <Row>
                                    <Col >
                                        <Input invalid={!validationOreEnd} className="text-center" name='oreEndTimePomeriggio' onChange={this.handleChange} value={this.state.oreEndTimePomeriggio} />
                                    </Col>
                                    :
                                    <Col>
                                        <Input invalid={!validationMinutiEnd} className="text-center" name='minutiEndTimePomeriggio' onChange={this.handleChange} value={this.state.minutiEndTimePomeriggio} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                    <Col md="3">
                        <Button disabled={!validation} outline color="dark" onClick={this.callForUpdatePomeriggio}> <i className="cui-check icons d-block mt-2"></i> conferma <br /> modifiche </Button>
                    </Col>
                </Row>

            </>
        )
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
    else if(startLessonAppoggio[0]=='assente' ){
      return startLessonAppoggio[0]
    }
    else{
      startLesson= startLessonPrimaParte+': 00'
      return startLesson
    }
}

render() {
    return (
        <div className="d-flex justify-content-center mt-5">
            <Card >
                {this.changeInfoPomeriggio()}
                <Button onClick={this.refresh} outline color="dark"> Indietro </Button>
            </Card>
        </div>
    )}
}

export default OreLezioniPomeriggio