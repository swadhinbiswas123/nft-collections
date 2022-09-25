import Main from './components/Main';
import './App.css';

window.onload = function(){
  localStorage.clear();
}

function App() {
  return (
  <>
  <Main />
  </>
  );
}

export default App;
