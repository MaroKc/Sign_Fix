import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, UncontrolledCollapse, CardTitle, CardText, CardImg, CardSubtitle, CardImgOverlay } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import Widget05 from './Widget05';
import Collapses from '../Base/Collapses/Collapses';
import axios from 'axios';

// Brand Card Chart
const makeSocialBoxData = (dataSetNo) => {
  const socialBoxData = [
    { data: [65, 59, 84, 84, 51, 55, 40], label: '' },
    { data: [1, 13, 9, 17, 34, 41, 38], label: '' },
  ];

  const dataset = socialBoxData[dataSetNo];
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        backgroundColor: 'rgba(255,255,255,.1)',
        borderColor: 'rgba(255,255,255,.55)',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: dataset.data,
        label: dataset.label,
      },
    ],
  };
  return () => data;
};

const socialChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

// Collapse const


class Classi extends Component {

  state = {
    corsi: []
  }

  componentDidMount() {
    axios.get(`http://localhost:8080/getCourses/luca@info.com`)
      .then(res => {
        const corsi = res.data;
        this.setState({ corsi });
      })
  }


  render() {
    const items = []

    for (let i = 0; i < this.state.corsi.length; i=i+2) {

      items.push(
        
        <Row className="mx-5">
          <Col xs={12} sm={12} md={6}>
            <div onClick={() => alert("Hello from here")}>
              <Widget05 dataBox={() => ({ variant: this.state.corsi[i].name, anno: this.state.corsi[i].start_year + "-" + this.state.corsi[i].end_year })} >
                <div key={i} className="chart-wrapper">

                  <Line data={makeSocialBoxData(0)} options={socialChartOpts} height={90} />
                </div>
              </Widget05>
            </div>
          </Col>

          <Col xs={12} sm={12} md={6}>
            <div onClick={() => alert("Hello from here")}>
              <Widget05 dataBox={() => ({ variant: this.state.corsi[i+1].name, anno: this.state.corsi[i+1].start_year + "-" + this.state.corsi[i+1].end_year })} >
                <div key={i} className="chart-wrapper">

                  <Line data={makeSocialBoxData(0)} options={socialChartOpts} height={90} />
                </div>
              </Widget05>
            </div>
          </Col>
        </Row>
      )
      console.log(this.state.corsi[i].name)
      console.log(this.state.corsi[i+1].name)

    }


    return (
      <div className="animated fadeIn">
        <CardBody body outline>

          {items}

         { this.state.corsi.map(corso => 
         <div>
         <Widget05 dataBox={() => ({ variant: corso.name, anno: corso.start_year + "-" + corso.end_year })} > 
         </Widget05>
         <li key={corso.id}>{corso.name}</li>

         </div>
         )}


        </CardBody>
      </div>
    );
  }
}

export default Classi;