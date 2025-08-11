import { Link } from "react-router-dom";
import style from "../Sidebar/Sidebar.module.css"; // mesmo CSS da Sidebar

export function SidebarItem({ icon, text, link, expandida }) {
  return (
    <Link to={link} className={style.sidebar_item}>
      <div className={style.sidebar_item_icon}>{icon}</div>
      <div
        className={style.sidebar_item_texto}
        style={{ display: expandida ? "inline-block" : "none" }}
      >
        {text}
      </div>
    </Link>
  );
}










// import { Link } from "react-router-dom";
// import style from "./SidebarItem.module.css";

// export function SidebarItem({ icon, text, link, expandida }) {
//   return (
//     <Link to={link} className={style.sidebar_item}>
//       <div className={style.sidebar_item_icon}>{icon}</div>
//       <div
//         className={style.sidebar_item_texto}
//         style={{ display: expandida ? "inline-block" : "none" }}
//       >
//         {text}
//       </div>
//     </Link>
//   );
// }










// import { Link } from "react-router-dom";
// import style from "./SidebarItem.module.css";

// export function SidebarItem({ icon, text, link, expandida }) {
//   return (
//     <Link to={link} className={style.sidebar_item}>
//       <div className={style.sidebar_item_icon}>{icon}</div>
//       {expandida && (
//         <div className={style.sidebar_item_texto}>
//           {text}
//         </div>
//       )}
//     </Link>
//   );
// }










// import { Link } from "react-router-dom";
// import style from "./SidebarItem.module.css";


// export function SidebarItem({ icon, text, link }) {
//   return (
    
//     <Link to={link} className={style.sidebar_item}>
//       <div className={style.sidebar_item_icon}>{icon}</div>
//       <div className={style.sidebar_item_texto}>{text}</div>
//     </Link>
//   );
// }










// import style from "./SidebarItem.module.css";
// import { Link } from "react-router-dom";

// export function SidebarItem({ icon, text, link }) {
//   return (
//     <Link to={link} className={style.sidebar_item}>
//       <div className={style.sidebar_item_icon}>{icon}</div>
//       <div className={style.sidebar_item_texto}>{text}</div>
//     </Link>
//   );
// }










// import style from "./SidebarItem.module.css";
// import { Link } from "react-router-dom";

// export function SidebarItem({ icon, text, link }) {
//   return (
//     <Link to={link} className={style.sidebar_item}>
//       <div className={style.sidebar_item_icon}>{icon}</div>
//       <div className={style.sidebar_item_texto}>{text}</div>
//     </Link>
//   );
// }










// import style from './SidebarItem.module.css'
// import { Link, useLocation } from 'react-router-dom'

// export function SidebarItem({ texto, link, logo }) {
//   const location = useLocation()
//   const isActive = location.pathname.startsWith(link.slice(0, -3))
//   return (
//     <Link to={link} className={`${style.sidebar_item} ${isActive ? style.active : ''}`}>
//       {logo}
//       <h3 className={style.texto_link}>{texto}</h3>
//     </Link>
//   )
// }
