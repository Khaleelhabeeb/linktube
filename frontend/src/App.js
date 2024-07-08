import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, CssBaseline, Container } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';
import Login from './components/auth/login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import VideoPlayer from './components/video/VideoPlayer';

const theme = createTheme();

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useAuth();
  
  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <div>Loading...</div>
        ) : user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Container>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/video/:id" component={VideoPlayer} />
              <PrivateRoute exact path="/" component={Dashboard} />
            </Switch>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;