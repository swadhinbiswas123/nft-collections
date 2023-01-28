import {ToastContainer } from 'react-toastify';
import Main from './components/Main';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

window.onload = function(){
  localStorage.clear();
}

function App() {
  return (
  <>
      <Main />
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      />
  </>
  );
}

export default App;
