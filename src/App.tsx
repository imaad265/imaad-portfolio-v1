import Hero from "./components/Hero"
import Cursor from "./components/Cursor"
import Navbar from "./components/Navbar"
import Featured from "./components/Featured"
import About from "./components/About"
import SelectedVisions from "./components/SelectedVisions"
import Contact from "./components/Contact"

function App() {
  return (
    <>
      <Cursor />
      <Navbar />
      <Hero />
      <Featured />
      <About />
      <SelectedVisions />
      <Contact />
    </>
  )
}

export default App