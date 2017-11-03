import React, { Component } from "react";
import { Link } from "react-router-dom";

const style = {
  about: {
    color: 'black',
    position: 'absolute',
    right: 15,
    textDecoration: 'underline'
  },
  copywrite: {
    marginRight: 25
  },
  footer: {
    backgroundColor: "#918e96",
    padding: 10,
    marginTop: 60,
    display: 'flex',
    alignItems: 'flex-end'

  },
  text: {
    display: 'flex'
  },
};

const Footer = () => (
  <div style={style.footer}>
    <div style={style.text}>
      <div style={style.copywrite}>&copy; 2017 dotConnection</div>
      <Link to="/about"><div style={style.about}>About Us</div></Link>
    </div>
  </div>
);

export default Footer;
