import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';


const data = {
  columns: [
    {
      label: 'Nome',
      field: 'nome',  
      sort: 'asc',
      width: 150
    },
    {
      label: '% Presenze Tot',
      field: 'presenze_tot',
      sort: 'asc',
      width: 270
    },
    {
      label: '% Presense Mese',
      field: 'presenze_mese',
      sort: 'asc',
      width: 200
    },
    {
      label: 'Age',
      field: 'age',
      sort: 'asc',
      width: 100
    },
    {
      label: 'Start date',
      field: 'date',
      sort: 'asc',
      width: 150
    },
    {
      label: 'Salary',
      field: 'salary',
      sort: 'asc',
      width: 100
    }
  ],
  rows: [
  
    {
      name: 'Michael Bruce',
      position: 'Javascript Developer',
      office: 'Singapore',
      age: '29',
      date: '2011/06/27',
      salary: '$183'
    },
    {
      name: 'Donna Snider',
      position: 'Customer Support',
      office: 'New York',
      age: '27',
      date: '2011/01/25',
      salary: '$112'
    }
  ]
};

//https://mdbootstrap.com/docs/react/tables/search/






class Studenti extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(1).fill('1'),
      students: []
    };

  }

  componentDidMount() {
    axios.get(`http://localhost:8080/listStudents`)
      .then(res => {
        const students = res.data;
        this.setState({ students });
      })
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">

        <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> 
              </CardHeader>
              <CardBody>

                <MDBDataTable
                  striped
                  bordered
                  hover
                  data={data}
                  searching={true}
                />

              </CardBody>
          </Card>

        </TabPane>
        <TabPane tabId="2">

        </TabPane>
        <TabPane tabId="3">

        </TabPane>
      </>
    );
  }



  render() {
    return (
      <div className="animated fadeIn">

        <Row>



        <Col>
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '1'}
                  onClick={() => { this.toggle(0, '1'); }}
                >
                  Riepilogo
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '2'}
                  onClick={() => { this.toggle(0, '2'); }}
                >
                  Riepilogo Mensile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[0] === '3'}
                  onClick={() => { this.toggle(0, '3'); }}
                >
                  Messages
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab[0]}>
              {this.tabPane()}
            </TabContent>
          </Col>
        </Row>

      </div>

    );
  }
}

export default Studenti;
