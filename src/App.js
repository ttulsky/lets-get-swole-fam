import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <h2>Welcome Fam</h2>
        <p>Lets Get Swole!</p>
        <img src="/fitness.png" className="App-logo" alt="logo" />

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
