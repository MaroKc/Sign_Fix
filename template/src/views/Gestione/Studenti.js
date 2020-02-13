import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { MDBDataTable } from 'mdbreact';

    
  



//https://mdbootstrap.com/docs/react/tables/search/


const DatatablePage = () => {
  return (
    <MDBDataTable
    striped
    bordered
    hover
    data="http://localhost:8080/listStudents"
    />
  );
}

class Studenti extends Component {


  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(1).fill('1'),
    };

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
                <i className="fa fa-align-justify"></i> DIO CANE IO FACCIO BACK END
              </CardHeader>
              <CardBody>

              {DatatablePage()}

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
