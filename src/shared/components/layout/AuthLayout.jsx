// import { Outlet } from "react-router-dom"
// import Navbar from "../../../shared/components/layout/Navbars/AuthNavbar"
// import FooterSmall from "../layout/Footers/FooterSmall"
// import bgImage from "../../../assets/img/register_bg_2.png"

// export default function AuthLayout() {
//   return (
//     <>
//       <Navbar transparent />
//       <main>
//         <section >
//           <div
//             className="absolute top-0 w-full h-full bg-blueGray-400"
//             style={{ backgroundImage: `url(${bgImage})` }}
//           />
//           <Outlet /> {/* ← aquí renderiza Login o Register */}
//           <FooterSmall absolute />
//         </section>
//       </main>
//     </>
//   )
// }

import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return <Outlet />;
}