import style from './BotaoLogin.module.css';
import { MdDoneOutline } from "react-icons/md";

const BotaoLogin = ({ children, onClick, disabled = false, type = "button" }) => {
  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      type={type}
      className={`
        ${style.botao_login} 
        ${disabled ? style.botao_desabilitado : ''}
      `.trim()}
    >
      <MdDoneOutline  size={18} style={{ marginRight: '6px' }} />
      {children}
    </button>
  );
};

export default BotaoLogin;










// import style from './BotaoSalvar.module.css';
// import { FaSave } from 'react-icons/fa';

// const BotaoSalvar = ({ children, onClick, disabled = false, type = "button", className = "" }) => {
//     function handleClick(e) {
//         if (disabled) return; // evita clique se desabilitado
//         if (onClick) onClick(e);
//     }

//     return (
//         <button 
//             onClick={handleClick}
//             disabled={disabled}
//             type={type}
//             className={`
//                 ${style.botao_salvar} 
//                 ${disabled ? style.botao_desabilitado : ''} 
//             `.trim()}
//         >
//             <FaSave size={24} style={{ marginRight: '26px' }} />
//             {children}
//         </button>
//     );
// };

// export default BotaoSalvar;
