import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import CardClassi from './CardClassi';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


const rdn = () => {

  const numb = []
  for (let l = 0; l < 7; l++)
    numb.push(Math.floor(Math.random() * (100 - 1) + 1));

  return ({ data: numb, label: '' })
}

// Brand Card Chart
const makeSocialBoxData = () => {

  const dataset = rdn();
  const data = {
    labels: ['', '', '', '', '', '', ''],
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
  tooltips: {
    enabled: false
  },
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

class Classi extends Component {

  constructor(props) {
    super(props);

    this.state = {
      corsi: [],
      changeCorso: props.changeCorso,
      display: false,
      redirect: false
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/getCourses/luca@info.com')
      .then(res => {
        const corsi = res.data;
        this.setState({ corsi });
    })
  }

  redirectOff =(i) => {
    this.state.changeCorso(i)
    this.setState({ redirect:true });
  }
  

  render() {
    const items = []
    
    for (let i = 0; i < this.state.corsi.length; i = i + 2) {
  
      items.push(

        <Row key={i} className="mx-lg-5">

          <Col 
          xs={12} sm={12} md={6} 
          key={this.state.corsi[i].id} 
          onClick={() => this.redirectOff(this.state.corsi[i])} 
          style={this.props.classe !== null && this.props.classe['id'] === 1  ? {border: 'rounded', background: '#2f353a' } : null}>
            <CardClassi dataBox={() => ({ variant: this.state.corsi[i].name, anno: this.state.corsi[i].start_year + "-" + this.state.corsi[i].end_year, curse: this.state.corsi[i].start_year < this.state.corsi[i+1].start_year ? "Classe 2" : ""})} >
              <div className="chart-wrapper">
                <Line data={makeSocialBoxData(0)} options={socialChartOpts} height={90} />
              </div>
            </CardClassi>
          </Col>
 
          <Col 
          xs={12} sm={12} md={6} 
          key={this.state.corsi[i + 1].id} 
          onClick={() => this.redirectOff(this.state.corsi[i + 1])} 
          style={this.props.classe !== null && this.props.classe['id'] === 3  ? {border: 'rounded', background: '#2f353a' } : null}>
            <CardClassi dataBox={() => ({ variant: this.state.corsi[i + 1].name, anno: this.state.corsi[i + 1].start_year + "-" + this.state.corsi[i + 1].end_year, curse: this.state.corsi[i].start_year < this.state.corsi[i+1].start_year ? "Classe 1" : "" })} >
              <div className="chart-wrapper">
                <Line data={makeSocialBoxData(0)} options={socialChartOpts} height={90} />
              </div>
            </CardClassi>
          </Col>
        </Row>
      )
    }

    return (
      <div className="animated fadeIn my-auto">
        {this.state.redirect && (
          <Redirect to="/studenti" />
        )}
        {items}

        {/* this.state.corsi.map(corso => 
         <div>
         <Widget05 dataBox={() => ({ variant: corso.name, anno: corso.start_year + "-" + corso.end_year })} > 
         </Widget05>
         <li key={corso.id}>{corso.name}</li>

         </div>
         )*/}

      </div>
    );
  }
}

export default Classi;