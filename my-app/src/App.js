import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Navbar } from "./Components/Navbar";
import { Users } from "./Components/Users";
class App extends Component {
  state = {};

  onClick() {
    fetch("http://localhost:5000/users").then(data =>
      data.json().then(data => {
        console.log(data);
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
