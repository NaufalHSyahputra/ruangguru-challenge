import React, { Suspense, useState } from "react";
// import routes from "./Routes/index";
import SignIn from "./Pages/SignIn";
import { UserContext } from "./Context/UserContext";
import { BrowserRouter as Router, Route, Switch, Redirect,useHistory } from 'react-router-dom';
import useFindUser from './Hooks/useFindUser';
import Dashboard from './Pages/Dashboard';
function PrivateRoute(props) {
  console.log(props)
  const { component: Component, ...rest } = props;
  if(localStorage.getItem("access_token")){
     return ( <Route {...rest} render={(props) => 
          (<Component {...props}/>)
           }
        />
      )}
  //redirect if there is no user 
  return <Redirect to='/login' />
}

function App() {
  const { user, setUser, isLoading } = useFindUser();
  const [test, setTest] = useState(null)
  const history = useHistory();
  React.useEffect(() => {
    setTest(user)
  }, []);
  return (
    <Suspense>
      <Router>
        <UserContext.Provider value={{ user, setUser, isLoading }}>
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/login" component={SignIn} />
            <PrivateRoute path="/home" component={Dashboard} user={test}/>
            {/* <Route component={NotFound} /> */}
          </Switch>
        </UserContext.Provider>
      </Router>
    </Suspense>
  );
}

export default App;
