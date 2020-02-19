import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, UncontrolledCollapse, CardTitle, CardText, CardImg, CardSubtitle, CardImgOverlay } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import Widget05 from '../Widgets/Widget05';
import Collapses from '../Base/Collapses/Collapses';






// Brand Card Chart
const makeSocialBoxData = (dataSetNo) => {
  const socialBoxData = [
    { data: [65, 59, 84, 84, 51, 55, 40], label: 'fitstic' },
    { data: [1, 13, 9, 17, 34, 41, 38], label: 'fitstic' },
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



  render() {


    return (
      <div className="animated fadeIn">


          <CardBody body outline color="warning">
            <Row>

              <Col xs={12} sm={12} md={6}>
                <div onClick={() => alert("Hello from here")}>
                  <Widget05 dataBox={() => ({ variant: 'Hooper', anno: '2019-2021' })} >
                    <div className="chart-wrapper">

                      <Line data={makeSocialBoxData(0)} options={socialChartOpts} height={90} />
                    </div>
                  </Widget05>
                </div>
              </Col>


              <Col xs={12} sm={12} md={6}>

                <Widget05 dataBox={() => ({ variant: 'Turing', anno: '2018-2020' })}  >
                  <div className="chart-wrapper">

                    <Line data={makeSocialBoxData(1)} options={socialChartOpts} height={90} />
                  </div>
                </Widget05>

              </Col>
            </Row>
          </CardBody>
      </div>
    );
  }
}



export default Classi;