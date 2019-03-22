import React, { Component } from "react";
import "./App.css";
import { Navbar } from "./Components/Navbar";
import { Users } from "./Components/Users";
class App extends Component {
  state = {};

  componentDidMount() {
    fetch("http://localhost:5000/users").then(data =>
      data.json().then(data => {
        this.setState({
          data: data.slice(0, 1)
        });
      })
    );
  }

  onClick() {
    fetch("http://localhost:5000/users").then(data =>
      data.json().then(data => {
        this.setState({
          data
        });
      })
    );
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <Users onClick={this.onClick.bind(this)} users={this.state.data || []} />
      </div>
    );
  }
}

export default App;
