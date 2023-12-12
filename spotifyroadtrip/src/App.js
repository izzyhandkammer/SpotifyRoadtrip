import Dashboard from './pages/dashboard'
import SignUp from './pages/signup'
import Login from'./pages/login'
import SpotifyLogin from './pages/spotifyLogin'
import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom";
import './App.css';

const code = new URLSearchParams(window.location.search).get('code');

function App() {
  return (
    <Router> 
      <Routes> 
        <Route path="/" element = {<Login />} />
        <Route path="/signup" element = {<SignUp />} />
        <Route path="/dashboard" element = {code ? <Dashboard code={code} /> : <SpotifyLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
