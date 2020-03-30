import React from 'react'
import { Card, Col, Row, Button, Input } from 'reactstrap';
import axios from 'axios'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

class OreLezioniMattina extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            changeInfoMattina: false,
            changeInfoPomeriggio: false,
            displayCard: this.props.displayCard,

            startTimeMattina: this.props.studenteMattina.startTime,
            endTimeMattina: this.props.studenteMattina.endTime,
            oreStartTimeMattina: '',
            minutiStartTimeMattina: '',
            oreEndTimeMattina: '',
            minutiEndTimeMattina: '',
        }
    }

    componentDidMount() {
        this.splitOrarioMattina();
    }

    splitOrarioMattina() {
        this.setState({
            oreStartTimeMattina: this.state.startTimeMattina === "assente" ? 0 : this.state.startTimeMattina.split(":")[0],
            minutiStartTimeMattina: this.state.startTimeMattina === "assente" ? 0 : this.state.startTimeMattina.split(":")[1].trim(),
        
            oreEndTimeMattina: this.state.endTimeMattina === "assente" ? 0 : this.state.endTimeMattina.split(":")[0],
            minutiEndTimeMattina: this.state.endTimeMattina === "assente" ? 0 : this.state.endTimeMattina.split(":")[1].trim(),
        })
    }


    callForUpdateMattina = () => {
        axios.put('http://localhost:8080/updateSignature/' + this.props.studenteMattina.idLesson, {
            startTime: this.state.oreStartTimeMattina + "." + (this.state.minutiStartTimeMattina / 0.6).toFixed(0),
            endTime: this.state.oreEndTimeMattina + "." + (this.state.minutiEndTimeMattina / 0.6).toFixed(0),
            email: this.props.studenteMattina.emailStudent,
        })
            .then(res => {
                if (res.data.message === "ok") { ToastsStore.success("La modifica è stata effettuata con successo!"); this.refresh(); }
                else if (res.data.message === "ko") ToastsStore.danger("Ops, abbiamo un problema: " + res.data.data);
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



    changeInfoMattina = () => {
        const Ore = /([0-1][0-9]|2[0-3])/
        const equal =
            this.state.oreStartTimeMattina === this.formatHours(this.props.lezioneMattina.startTime).split(":")[0]
                ?
                this.state.minutiStartTimeMattina >= parseInt(this.formatHours(this.props.lezioneMattina.startTime).split(":")[1])
                :
                true

        const equalEnd =
            this.state.oreEndTimeMattina === this.formatHours(this.props.lezioneMattina.endTime).split(":")[0]
                ?
                this.state.minutiEndTimeMattina <= parseInt(this.formatHours(this.props.lezioneMattina.endTime).split(":")[1])
                :
                true


        const validationOreStart =
        this.state.oreStartTimeMattina &&
            Ore.test(this.state.oreStartTimeMattina) &&
            this.state.oreStartTimeMattina >= this.formatHours(this.props.lezioneMattina.startTime).split(":")[0] &&
            this.state.oreStartTimeMattina <= this.formatHours(this.props.lezioneMattina.endTime).split(":")[0] &&
            this.state.oreStartTimeMattina <= this.state.oreEndTimeMattina &&
            this.state.oreStartTimeMattina.length === 2

        const validationOreEnd = Ore.test(this.state.oreEndTimeMattina) &&
            this.state.oreEndTimeMattina <= this.formatHours(this.props.lezioneMattina.endTime).split(":")[0] &&
            this.state.oreEndTimeMattina >= this.formatHours(this.props.lezioneMattina.startTime).split(":")[0] &&
            this.state.oreStartTimeMattina <= this.state.oreEndTimeMattina &&
            this.state.oreEndTimeMattina.length === 2

        const Minuti = /[0-5][0-9]/
        const validationMinutiStart = Minuti.test(this.state.minutiStartTimeMattina) && this.state.minutiStartTimeMattina.length === 2 && equal
        const validationMinutiEnd = Minuti.test(this.state.minutiEndTimeMattina) && this.state.minutiEndTimeMattina.length === 2 && equalEnd
        const validation = validationOreStart && validationOreEnd && validationMinutiStart && validationMinutiEnd


        return (
            <>
                <div className="text-center mt-3"> <h4>{this.props.studenteMattina.firstName} {this.props.studenteMattina.lastName}</h4></div>

                <Row>
                    <Col md="9">


                        <Row className="m-3">
                            <Col md="7" className="text-center">
                                <h5> <b>Inizio</b> lezione:</h5>
                            </Col>
                            <Col md="5">
                                <Row>
                                    <Col>
                                        <Input invalid={!validationOreStart} className="text-center" name='oreStartTimeMattina' onChange={this.handleChange} value={this.state.oreStartTimeMattina} />
                                    </Col>
                                    :
                                        <Col >
                                        <Input invalid={!validationMinutiStart} className="text-center" name='minutiStartTimeMattina' onChange={this.handleChange} value={this.state.minutiStartTimeMattina} />
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
                                        <Input invalid={!validationOreEnd} className="text-center" name='oreEndTimeMattina' onChange={this.handleChange} value={this.state.oreEndTimeMattina} />
                                    </Col>
                                    :
                                    <Col>
                                        <Input invalid={!validationMinutiEnd} className="text-center" name='minutiEndTimeMattina' onChange={this.handleChange} value={this.state.minutiEndTimeMattina} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                    <Col md="3" className='text-center mb-3'>
                        <Button disabled={!validation} className="custom-btn" onClick={this.callForUpdateMattina}> <i className="cui-check icons d-block mt-2"></i> conferma <br /> modifiche </Button>
                    </Col>
                </Row>

            </>
        )
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
        else if (startLessonAppoggio[0] == 'assente') {
            return startLessonAppoggio[0]
        }
        else {
            startLesson = startLessonPrimaParte + ': 00'
            return startLesson
        }
    }

    render() {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Card >
                    {this.changeInfoMattina()}
                    <Button onClick={this.refresh} outline color="dark"> Indietro </Button>
                </Card>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_CENTER} lightBackground />
            </div>
        )
    }
}

export default OreLezioniMattina