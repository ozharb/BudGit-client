import React, { Component } from "react";
import TokenService from "../services/token-service";
import AuthApiService from "../services/auth-api-service";
import { Input } from "../Utils/Utils";
import ApiContext from "../ApiContext";
import "./LoginForm.css";
import Sound from "react-sound";
import LoadingSound from "./robo-loading-sound.mp3";

export default class LoginForm extends Component {
  static defaultProps = {
    onLoginSuccess: () => {},
  };

  static contextType = ApiContext;

  state = {
    error: null,
    loginStatus: false,
    username: "",
    password: "",
    play: Sound.status.STOPPED,
  };
  setUsername = (username) => {
    this.setState({ username: username });
  };
  setPassword = (password) => {
    this.setState({ password: password });
  };
  setDemo = () => {
    this.setState({ username: "Demo", password: "Demo@2021" });
  };
  handleLoadingSound = () => {
    this.setState({ play: Sound.status.PLAYING });
  };
  handleSubmitJwtAuth = (ev) => {
    ev.preventDefault();
    this.setState({ error: null });
    this.handleLoadingSound();
    const { user_name, password } = ev.target;
    AuthApiService.postLogin({
      user_name: this.state.username,
      password: this.state.password,
    })
      .then((res) => {
        const username = "user";
        user_name.value = "";
        password.value = "";
        window.localStorage.setItem(username, res.user_name);
        this.context.saveUsername(res.user_name);
        TokenService.saveAuthToken(res.authToken);
        this.props.onLoginSuccess();
        this.setState({ loginStatus: true });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };
  showPassword = (e) => {
    const password = document.getElementById("LoginForm__password");

    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };
  render() {
    const { error, loginStatus } = this.state;

    return (
      <>
        <Sound url={LoadingSound} playStatus={this.state.play} volume={10} />
        <form className="LoginForm" onSubmit={this.handleSubmitJwtAuth}>
          <div role="alert">{error && <p className="red">{error}</p>}</div>
          {loginStatus ? (
            <p className="green">Success!</p>
          ) : (
            <>
              <div className="user_name">
                <label htmlFor="LoginForm__user_name">User name</label>
                <Input
                  required
                  name="user_name"
                  id="LoginForm__user_name"
                  autoComplete="user_name"
                  value={this.state.username}
                  onChange={(e) => this.setUsername(e.target.value)}
                ></Input>
              </div>

              <div className="password">
                <label htmlFor="LoginForm__password">Password</label>
                <span className="show-password">
                  <input
                    name="show-password"
                    type="checkbox"
                    onClick={this.showPassword}
                  />
                  Show Password
                </span>
                <Input
                  required
                  name="password"
                  type="password"
                  id="LoginForm__password"
                  autoComplete="current-password"
                  value={this.state.password}
                  onChange={(e) => this.setPassword(e.target.value)}
                ></Input>
              </div>

              <button type="submit">Login</button>

              <div className="demo">
                <p
                  className="demo-now"
                  tabIndex={0}
                  onKeyDown={this.setDemo}
                  onClick={this.setDemo}
                >
                  demo
                </p>
              </div>
            </>
          )}
        </form>
      </>
    );
  }
}
