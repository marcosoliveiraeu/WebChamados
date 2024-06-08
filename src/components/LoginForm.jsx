import React, { useState , useEffect , useContext } from 'react';
import axios from 'axios';
import './css/LoginForm.css';
import icon from '../img/icone.png';
import { Navigate , useNavigate  } from 'react-router-dom';
import API_URL from '../utils/apiConfig';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const LoginForm = () => {
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const [emailHistory, setEmailHistory] = useState([]);
  const [show, setShow] = useState(false);
  const [emailSenha, setEmailSenha] = useState('');

  const baseURLLogin = `${API_URL}/Usuario/Login`
  const baseURLEsqueciSenha = `${API_URL}/Usuario/EsqueciSenhaEnviarLink`

  const [erro, setErro] = useState(null);
  const [msg, setMsg] = useState(null);
  
  const handleShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(baseURLLogin, {
        email,
        password,
      });

      
      if (response.data.flag) {
        
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        const updatedEmailHistory = [...new Set([email, ...emailHistory])];
        setEmailHistory(updatedEmailHistory);
        localStorage.setItem('emailHistory', JSON.stringify(updatedEmailHistory));

        
       // <Navigate to="/chamados" /> ;
        navigate('/chamados');

      } else {
        
        setError(response.data.message);
      }
    } catch (error) {
        console.error('Erro de login:', error);
        if (error.response && error.response.status === 401) {
          setError('Email ou senha inválidos. Por favor, tente novamente.');
        } else {
          setError('Erro ao efetuar o login. Por favor, tente novamente.');
        }
    }
  };

  const EsqueciSenha = () => {
      handleShow();
  }

  const EnviarEmail = async() =>{

    try{
      const response = await axios.post(`${baseURLEsqueciSenha}?email=${emailSenha}`);
      setMsg(null)
      setErro(null);
      if (response.status === 200) {
          setMsg("Email enviado com sucesso!");
      }else if (response.status === 404) {
          setErro("Não foi encontrado usuario para esse email.");
      }else {
        setErro("Erro ao enviar email.");
    }

    }
    catch(error){

      if (error.response && error.response.status === 404) {
        setErro("Não foi encontrado usuario para esse email.");
      }else {
      setErro("Erro ao enviar email.");
      }

    }

  }

   
  useEffect(() => {

    const savedEmails = JSON.parse(localStorage.getItem('emailHistory')) || [];
    setEmailHistory(savedEmails); 

  }, []);
  
  return (
    <div className="formContainer">
        <div className="formBox">
            <img src={icon} alt="WebChamados" className="icon" />
            <span className="appName" >WebChamados</span><br />
            <span className="telaLogin">Fazer login</span>
            {error && <p className="error">{error}</p>} 
            <form onSubmit={handleSubmit}>
                <input type="email" list="emailHistory" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                <datalist id="emailHistory">
                  {emailHistory.map((email, index) => ( <option key={index} value={email} /> ))}
                </datalist>
                <input type="password" placeholder='Senha'  value={password} onChange={(e) => setPassword(e.target.value)}/>
                
                <button type="submit">Fazer login</button>
            </form>
            <div className="forgotPassword">
                <div className="divider"></div>
                <a href="#" onClick={EsqueciSenha}>Esqueci minha senha</a>                
            </div>            
        </div>
        <Modal
          show={show}
          onHide={handleClose}   
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Redefinir sua senha
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>     
            {erro && <div className="alert alert-danger">{erro}</div>}
            {msg && <div className="alert alert-success">{msg}</div>}   
            <p>
              Insira seu endereço de e-mail abaixo e enviaremos um link com as instruções.      
            </p>
            <input type="email"  placeholder='Email' value={emailSenha} onChange={(e) => setEmailSenha(e.target.value)}/>
          </Modal.Body>
          <Modal.Footer className="custom-modal-footer">
            <Button variant="primary"  onClick={EnviarEmail}>
              Enviar              
            </Button>
          </Modal.Footer>
        </Modal>
    </div>

    
  );

};

export default LoginForm;
