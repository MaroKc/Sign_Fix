import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


class DefaultLayout extends Component {

  constructor(props) {
    super(props);

    const cookieCorso = JSON.parse(sessionStorage.getItem("corso"));
    const cookieUser = JSON.parse(sessionStorage.getItem("utente"));

    this.state = {
      classe: cookieCorso ? cookieCorso : null,
      user: cookieUser ? cookieUser : null
    } 
  }

  componentDidMount() {
    if(this.state.user == null)
      console.log("pippo")
      //<Redirect from="/" to="/login" />
  }

  changeCorso = (corso) => {
    this.setState({ classe: corso })
    sessionStorage.setItem("corso", JSON.stringify(corso));
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  render() {
    const classe = this.state.classe;
    return (
      <div className="app">

        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>

        <div className="app-body">

          {classe  && (
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <h4 className="text-center mt-2">{this.state.classe['start_year']} - {this.state.classe['end_year']}</h4>
                <AppSidebarNav navConfig={navigation} {...this.props} router={router} classe={this.state.classe}/>
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
          )}

          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props =>
                          route.render ? (
                            <route.component {...props} {...route.extraProps} route={route} />
                          ) : (
                              <route.component {...props} classe={this.state.classe} changeCorso={this.changeCorso} route={route} />
                            )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/login" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
