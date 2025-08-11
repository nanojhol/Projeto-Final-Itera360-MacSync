import style from './BotaoNovo.module.css';
import { FiPlus } from 'react-icons/fi';

const BotaoNovo = ({ children, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button onClick={handleClick} className={style.botao_novo}>
      <FiPlus className={style.icone} />
      <span className={style.texto}>{children}</span>
    </button>
  );
};

export default BotaoNovo;











// import style from './BotaoNovo.module.css'
// import { FiPlus } from 'react-icons/fi';


// const BotaoNovo = ({ children, onClick}) => {

//     function handleClick() {
//         if (onClick) onClick();
//     }

//     return (
//         <>
//             <button 
//                 onClick={handleClick}  
//                 className={style.botao_novo}
//             >
//                 <FiPlus size={24} className = {style.icone} />
//                  <span className={style.texto}>{children}</span>
//             </button>
//         </>
//     );
// };


// export default BotaoNovo