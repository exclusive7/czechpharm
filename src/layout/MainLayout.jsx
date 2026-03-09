import { Outlet } from "react-router-dom"
import Header from "../components/Header_nav"
import Footer from "../components/FooterSection"

export default function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}