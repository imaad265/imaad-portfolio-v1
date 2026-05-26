import Hero from "./components/Hero"
import Cursor from "./components/Cursor"
import Navbar from "./components/Navbar"
import Featured from "./components/Featured"
import About from "./components/About"
import SelectedVisions from "./components/SelectedVisions"
import Contact from "./components/Contact"

function App() {
  // overflow-x: clip clips horizontal overflow without creating a new BFC,
  // so position: sticky inside (text-reveal, etc.) continues to work normally.
  return (
    <div style={{ overflowX: "clip" }}>
      <Cursor />
      <Navbar />
      <Hero />
      <Featured />
      <About />
      <SelectedVisions />
      <Contact />
    </div>
  )
}

export default App