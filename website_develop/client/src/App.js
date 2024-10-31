import logo from './logo.svg';
import './App.css';
import LoginButton from "./components/login";
import LogoutButton from "./components/logout";
import { useEffect } from 'react';
import { gapi } from 'gapi-script';

const clientId = "464749231636-aagjbq1nkp79885qj99v0reflb05ouf6.apps.googleusercontent.com"

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };

    gapi.load('client:auth2', start);
  })

  return (
    <div className="App">
      <LoginButton />
      <LogoutButton />
    </div>
  );
}

export default App;
