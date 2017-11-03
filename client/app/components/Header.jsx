import React, { Component } from "react";
import { Link } from "react-router-dom";

const style = {
  about: {
    color: 'black',
    position: 'absolute',
    right: 15,
    textDecoration: 'underline',
    bottom: 10,
    color: 'white',
  },
  title: {
    marginRight: 25,
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: 'white',
    fontSize: 22
  },
  Header: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 50,
  },
  text: {
    display: 'flex',
    alignItems: 'center'
  },
};

const Header = () => (
  <div style={style.Header}>
    <div style={style.text}>
      <div style={style.title}>NewNews</div>
    </div>
  </div>
);

export default Header;
