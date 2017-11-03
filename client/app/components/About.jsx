import React from "react";
import { render } from "react-dom";
import RaisedButton from "material-ui/RaisedButton";
import { Link } from 'react-router-dom'

const styles = {
  arrow: {
    marginRight: 5
  },
  button: {
    padding: 1,
    borderStyle: "solid",
    borderWidth: 2
  },
  back: {
    color: 'white',
    position: 'absolute',
    top: '15px',
    left: '15px'
  }
};

const About = () => (
  <div className="aboutpage">
    <section id="intro">
      <div className="container-fluid">
        <Link to="/"><div style={styles.back}><i style={styles.arrow} className="fa fa-long-arrow-left" aria-hidden="true"></i>
  Map</div></Link>
        <h1 className="brand-heading title">Meet our Team</h1>
      </div>
    </section>

    <section id="description">
      <div className="container">
        <div>
          <h1>We are dotConnection</h1>
          <h3>Forged in the world-renowned labs of Hack Reactor Austin, we are dotConnnection: masters of machine learning and data visualization. Our vision is to bring to the world a news platform unhindered by political spin or the bias of its creators.</h3>
          <span>
            <RaisedButton buttonStyle={{ padding: 5 }} style={styles.button}>
              <a
                target="_blank"
                href="https://github.com/dotConnection/newnews"
              >
                View Our Github
              </a>
            </RaisedButton>
          </span>
        </div>
      </div>
    </section>

    <section id="design">
      <div className="container">
          <h1>NewNews<img id="watsonpower" src="https://onereach.com/img/watson_poweredby_black.svg"/></h1>
        <div className="row">
          <h3>We have harnessed the power of IBM Watson's Discovery News platform to bring you news data and insights from all over the world. Leveraging the poweful frameworks in amCharts/amMaps (fabulously created by a small team based out of Lithuania) and the Box2D physics engine (famous for its implementation in Angry Birds), we present to you the New News.</h3>
        </div>
      </div>
    </section>

    <section id="julie">
      <div className="container">
        <div className="row">
          <img
            className="profpic left"
            src="https://avatars2.githubusercontent.com/u/29667753?s=460&v=4"
          />
          <div>
            <h1>Julie Johnson</h1>
            <h3>
              <p>
                Julie is a front-end software engineer with endless enthusiasm about leveraging technology to solve environmental and social issues and building applications to bring people together around these common goals. As a front-end specialist for the dotConnection team, she used ReactJS, Redux, Material UI and AMCharts to translate the vision of providing a truly un-opinionated news app into reality.
              </p>
            </h3>
          </div>
        </div>
      </div>
    </section>

    <section id="jonathan">
      <div className="container">
        <div className="row">
          <div>
            <h1>Jonathan Cao</h1>
            <h3>
              <p>
                  Johnathan is a full stack engineer who is passionate about leveraging software to solve complex problems.
              </p>
              <p>
                  His contributions to the New News application were centered around:
                  <ul>
                      <li>
                          building up a flexible map component,
                      </li>
                      <li>
                          implementing the Box2D physics engine to detect bubble collision on the map, 
                      </li>
                      <li>
                          and deployment of the application on Amazon Web Services (AWS). 
                      </li>
                  </ul>
              </p>
              <p>
                Relying on his prior experience with statistics and data analysis, Johnathan also advised on decision making related to IBM Watson's machine-learning augmented news data. His near term objectives involve working in an entrepreneurial environment with exposure to machine learning, data analysis and visualization, deployment strategy, and overall software architecture. Johnathan dreams of one day starting his own software company, through which he will push forward humanity's ability to make sense of the world's data.
              </p>
            </h3>
          </div>
          <img
            className="profpic right"
            src="https://avatars2.githubusercontent.com/u/28884578?s=400&u=6fb513c43e89552b204a8085ef81546fc6eebcaa&v=4"
          />
        </div>
      </div>
    </section>

    <section id="kenny">
      <div className="container">
        <div className="row">
          <img
            className="profpic left"
            src="https://avatars1.githubusercontent.com/u/12156536?s=460&v=4"
          />
          <div>
            <h1>Kenneth Kang</h1>
            <h3>
              <p>
                Kenneth is a back-end engineer in charge of server and database interacting with Watson API. His previous experience with digital signal processing and system model optimization contributed to making optimized decisions on sourcing representative news data. During his spare time, he enjoys traveling time and serving street justice alongside Kung Fury with his technical skills.
              </p>
            </h3>
          </div>
        </div>
      </div>
    </section>

    <section id="peter">
      <div className="container">
        <div className="row">
          <div>
            <h1>Peter Choi</h1>
            <h3>
              <p>
                Peter is a front-end engineer wanting to create beautiful and responsive web applications for all users. Using React, Redux, HTML, CSS, React Router, and the AmCharts library, he co-designed NewNews with Julie. He is in love with, and has a passion, for Raising Canes. He once camped outside of a Cane’s for its grand opening for 12 hours just for a T-shirt and two free box combos.
              </p>
              <p>
                This is his ranking of fast food chicken tenders:
                <ol>
                  <li>Raising Canes</li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li>Church’s</li>
                  <li>Chicken Express</li>
                  <li>Golden Chick</li>
                  <li>Everything else</li>
                </ol>
              </p>
            </h3>
          </div>
          <img
            className="profpic right"
            src="https://avatars2.githubusercontent.com/u/16979472?s=460&v=4"
          />
        </div>
      </div>
    </section>
  </div>
);

export default About;
