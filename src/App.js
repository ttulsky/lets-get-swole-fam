import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <img src="/fitness.png" className="App-logo" alt="logo" />
        <p>Lets Get Swole Fam!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Swole
        </a>
      </header>
      <Footer />
    </div>
  );
}

export default App;
