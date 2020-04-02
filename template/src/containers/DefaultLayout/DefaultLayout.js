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
import navigationCor from '../../_navCor';//(cordinatori)
import navigationDoc from '../../_navDoc';//(prof)
import navigationStud from '../../_navStud';//(studenti)

// routes config
import routesCor from '../../routesCor';
import routesDoc from '../../routesDoc';
import routesStud from '../../routesStud';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


class DefaultLayout extends Component {

  constructor(props) {
    super(props);

    const cookieCorso = JSON.parse(sessionStorage.getItem("corso"));
    const cookieUser = JSON.parse(sessionStorage.getItem("utente"));

    var navM = null;
    var navR = [];
    var navTo = '/';
    if (cookieUser) {
      switch (cookieUser['responsible_level']) {
        case 1:
          navM = navigationCor;
          navR = routesCor;
          navTo = '/classi';
          break;

        case 2:
          navM = navigationCor;
          navR = routesCor;
          navTo = '/classi';
          break;

        case 3:
          navM = navigationCor;
          navR = routesCor;
          navTo = '/classi';
          break;

        case 4:
          navM = navigationDoc;
          navR = routesDoc;
          navTo = '/docentiPersonale';
          break;

        case 5:
          navM = navigationStud;
          navR = routesStud;
          navTo = '/studentiPersonale';
          break;

        default:
          navM = navigationStud;
          navR = routesStud;
          navTo = '/studentiPersonale';
          break;
      }
    }

    this.state = {
      classe: cookieCorso ? cookieCorso : null,
      user: cookieUser ? cookieUser : null,
      navMenu: navM,
      routes: navR,
      to: navTo,
      redirect: false
    }

  }

  componentDidMount() {
    if (this.state.user === null) {
      this.setState({ redirect: true })
    }
  }


  changeCorso = (corso) => {
    this.setState({ classe: corso })
    sessionStorage.setItem("corso", JSON.stringify(corso));
  }

  redirectOff = () => {
    return <Redirect to='/login' />
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    localStorage.removeItem('utente')
    this.setState({ redirect: true })
    e.preventDefault()
  }

  render() {
    const classe = this.state.classe;
    const user = this.state.user
    return (

      <div className="app" style={user && user.responsible_level !== 2 ? { background: "white" } : null}>
        {this.state.redirect && (
          this.redirectOff()
        )}
        {classe && (
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader onLogout={e => this.signOut(e)} classe={this.state.classe} />
            </Suspense>
          </AppHeader>
        )}

        <div className="app-body">
          {classe && (
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <h4 className="text-center mt-2">{this.state.classe['start_year']} - {this.state.classe['end_year']}</h4>
                <AppSidebarNav navConfig={this.state.navMenu} {...this.props} router={router} classe={this.state.classe} user={this.state.user} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
          )}

          <main className="main">
            {classe && <AppBreadcrumb appRoutes={this.state.routes} router={router} />}
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>

                  {this.state.routes.map((route, idx) => {
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
                              <route.component {...props} classe={this.state.classe} to={this.state.to} user={this.state.user} changeCorso={this.changeCorso} route={route} />
                            )} />
                    ) : (null);
                  })}
                  {this.state.user === null ? <Redirect from="/" to='/login' /> : <Redirect from="/" to={this.state.to} />}
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