import './App.css';
import React , {useState , useEffect, useContext} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ChamadosIndex from './components/ChamadosIndex';
import Usuarios from './components/Usuarios';
import TrocarSenha from './components/TrocarSenha';
import PrivateRoute from './components/PrivateRoute'; 
import PrivateAdminRoute from './components/PrivateAdminRoute'; 

import {accessToken , refreshValido , getNewRefreshToken} from './utils/UserToken';
import NovoUsuario from './components/NovoUsuario';
import EditarUsuario from './components/EditarUsuario';
import AbrirChamado from './components/AbrirChamado';
import EditarChamado from './components/EditarChamado';
import ResetPassword from './components/ResetPassword';

const App = () => {
  
  const [tokenExpired, setTokenExpired] = useState(false);


  useEffect(() => {
    
    console.log("App.useEffect");

    let token = accessToken();
    if(token){
      //se existir um token no storage      
      
          if(token.isExp){
          //se o access token do storage está expirado   
              
              if(refreshValido()){
              // se o refresh for válido            
              
                //busca novos tokens usando o refresh token
                  getNewRefreshToken();
                  token = accessToken();
  
                  setTokenExpired(false);
  
              }else{                
                setTokenExpired(true);
              }        
  
          }else
          {
            setTokenExpired(false);
          }
      }
      else
      {       
        setTokenExpired(true);
      }


  }, []);

 
  return (
    <Router>
      
        <Routes>
         

          
          <Route path="/WebChamados/" element={<Navigate to={"/WebChamados/login"} />} />

  
          <Route path="/WebChamados/login" element={tokenExpired ?  <LoginForm /> : <Navigate to={"/WebChamados/chamados"} />} />

                    
          <Route element={<PrivateRoute />}>
            <Route path="/WebChamados/trocarSenha" element={<TrocarSenha />} />          
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/WebChamados/chamados" element={<ChamadosIndex />} />          
          </Route>

          <Route element={<PrivateAdminRoute />}>
            <Route path="/WebChamados/usuarios" element={<Usuarios />} />          
          </Route>
          
          <Route element={<PrivateAdminRoute />}>
            <Route path="/WebChamados/novoUsuario" element={<NovoUsuario />} />          
          </Route>

          <Route element={<PrivateAdminRoute />}>
            <Route path="/WebChamados/editarUsuario" element={<EditarUsuario />} />          
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/WebChamados/editarChamado" element={<EditarChamado />} />          
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/WebChamados/abrirChamado" element={<AbrirChamado />} />          
          </Route>

          
          <Route path="/WebChamados/ResetPassword" element={<ResetPassword />} />          
          
          
          

        </Routes>
    
    </Router>
  );
};

export default App;