import logo from './logo.svg';
import './App.css';
import CooeeSDK from "@letscooee/web-sdk";

function App() {
    CooeeSDK.init("60ace21f18d1ec7c04d12d68", "abXgJzVEXqdPMqRdv7rP");
    CooeeSDK.setDebug(true);
    CooeeSDK.setWebAppVersion("0.2.4+204")
    CooeeSDK.sendEvent("Try React", {foo: "bar"})

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
