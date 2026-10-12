import { Outlet } from "react-router-dom"
import Navbar from "../../../shared/components/layout/Navbars/AuthNavbar"
import FooterSmall from "../layout/Footers/FooterSmall"
import bgImage from "../../../assets/img/register_bg_2.png"

export default function AuthLayout() {
  return (
    <>
      <Navbar transparent />
      <main>
        <section >
        {/* <section className="relative w-full h-full py-40 min-h-screen"> */}
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <Outlet /> {/* ← aquí renderiza Login o Register */}
          <FooterSmall absolute />
        </section>
      </main>
    </>
  )
}