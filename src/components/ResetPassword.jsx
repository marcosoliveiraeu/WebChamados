import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../utils/apiConfig';
import './css/LoginForm.css';
import icon from '../img/icone.png';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setconfirmarSenha] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setErro] = useState('');

  const baseURL = `${API_URL}/Usuario/ResetSenha`;

  const ResetSenha = async () => {
    
    const userData = {
        token: token,
        email: email,
        newPassword: senha,
        confirmPassword: confirmarSenha
      };
    

    try {
      const response = await axios.post(baseURL, userData);

      if (response.status === 200) {        
        setMsg("Senha alterada com sucesso. <a href='/login'>Clique aqui para fazer login.</a>");          
      }else{
        setErro("Erro ao alterar senha.");
        
      }
    } catch (err) {
      setErro('Erro ao alterar senha: ' + err);
    }
  };

  const handlePasswordReset = (event) => {
    event.preventDefault();

    setErro(null);
    setMsg(null);

    if(validaCampos()) {
        ResetSenha();
    }    
  };

  
  const validaCampos = () => {
    
    if (!senha || !confirmarSenha ) {
      setErro('Todos os campos são obrigatórios.');
      return false;
    }
    if (senha.length < 5) {
      setErro('A senha deve ter no mínimo 5 caracteres.');
      return false;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return false;
    }

    if (!token || !email) {
        setErro('Essa funcionalidade deve ser acessada pelo link fornecido no email.');
        return false;
      }


    if (!validatePassword(senha)) {
      setErro('A senha deve ter pelo menos 5 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
      return false;
    }
    
    return true ;

  }


  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{5,}$/;
    return re.test(password);
  };

  return (
    <div className="formContainer">
        <div className="formBox">
            <img src={icon} alt="WebChamados" className="icon" />
            <span className="appName" >WebChamados</span><br />
            <span className="telaLogin">Redefinir Senha</span>
            {msg && <div className="alert alert-success" dangerouslySetInnerHTML={{ __html: msg }} />}
            {error && <div className="alert alert-danger">{error}</div>}
            <form className= "submitPasswordReset" onSubmit={handlePasswordReset}>
                <div className="form-group ">
                    <label htmlFor="password" >Nova senha</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmação nova senha</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmarSenha}
                        onChange={(e) => setconfirmarSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Redefinir Senha</button>
            </form>
        </div>
    </div>
  );
};

export default ResetPassword;

