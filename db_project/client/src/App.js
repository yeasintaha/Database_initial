import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Admin from "./Admin";
import Signin from "./Signin";
import Signup from "./Signup";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Admin} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
