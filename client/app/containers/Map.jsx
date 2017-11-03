import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectWord } from '../actions'
import Box2D from 'box2dweb';
import * as mapConfig from '../lib/mapConfig';
import * as mapHelpers from '../lib/mapHelpers';

const axios = require('axios');

class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      images: []
    }
  }

  componentDidMount() {
    axios.get('/keys')
      .then((response) => {
        let parsedData = mapHelpers.mongoKeyParser(response.data);
        this.physicsInit(parsedData);
      })
      .catch((error) => console.log('Map.jsx: ', error));
  }

  // //map will rerender and zoom back out if the state changes
  // shouldComponentUpdate(nextProps) {
  //   //if the word changes, return false so the map doesn't rerender
  //   console.log(this.state.data)
  //   console.log(this.state.fullData)
  //   const different = this.state.data === this.state.fullData
  //   return different;
  // }

  physicsInit(mongoData) {
    var map;
    var minBulletSize = 40;
    var maxBulletSize = 100;

    // set dark theme
    AmCharts.theme = AmCharts.themes.chalk;

    // get min and max values
    var min = Infinity;
    var max = -Infinity;

    for(let region in mongoData) {
      for(let i = 0; i < mongoData[region].length; i++) {
        let matching_results = mongoData[region][i].matching_results;
        if(matching_results < min) {
          min = matching_results;
        }
        if(matching_results > max) {
          max = matching_results;
        }
      }
    }

    // for (var i = 0; i < mongoData.length; i++) {
    //   var matching_results = mongoData[i].matching_results;
    //   if (matching_results < min) {
    //     min = matching_results;
    //   }
    //   if (matching_results > max) {
    //     max = matching_results;
    //   }
    // }

    map = new AmCharts.AmMap();
    map.addClassNames = true;
    // map.backgroundAlpha = "1";
    // map.backgroundColor = "#c6c6c6"
    // map.borderAlpha = "1";
    // map.borderColor = "#000000";

    // style tooltip
    // map.balloon = {
    //   adjustBorderColor: false,
    //   horizontalPadding: 20,
    //   verticalPadding: 10,
    //   color: "#000000",
    //   maxWidth: 300,
    //   borderAlpha: 0,
    //   borderThickness: 1
    // }

    // bubbles are images, we set opacity and tooltip text
    //This is so that the bubbles don't change positions
    map.fitMapToContainer = false;

    map.imagesSettings = {
      balloonText: '',
      alpha: 0.7
    }



    map.defs = {
      "filter": [{
        "id": "blur",
        "feGaussianBlur": {
          "in": "SourceGraphic",
          "stdDeviation": 2
        }
      }]
    };

    map.areasSettings = {
      'balloonText' : '',
      'autoZoom' : false,
      'rollOverColor': undefined,
      'rollOverOutlineColor': undefined,
      'outlineThickness': 1,
      'outlineColor': '#ffffff'
    };

    map.zoomControl = {
      'zoomControlEnabled' : true,
      'buttonFillColor': '#ffffff',
      'buttonRollOverColor': '#626262'
    };

    map.listeners = [
      {
        'event' : 'init',
        'method' : initBox2D,
      }, {
        'event' : 'clickMapObject',
        'method' : (event) => { this.props.selectWord(event.mapObject.value); }
      }
    ];

    // map.addListener("clickMapObject", function(event) {
    //   console.log('something got clicked');
    // });

    // data provider. We use continents map to show real world map in background.
    var dataProvider = {
      map: "continentsLow",
      zoomLevel : mapConfig.zoomSettings.zoomLevel,
      zoomLatitude : mapConfig.zoomSettings.zoomLatitude,
      zoomLongitude : mapConfig.zoomSettings.zoomLongitude,
      areas: [
        {
          "id": "africa",
          "color": "#D8D8D8",
        }, {
          "id": "asia",
          "color": "#D8D8D8",
        }, {
          "id": "australia",
          "color": "#D8D8D8",
        }, {
          "id": "europe",
          "color": "#D8D8D8",
        }, {
          "id": "north_america",
          "color": "#D8D8D8",
        }, {
          "id": "south_america",
          "color": "#D8D8D8"
        }
      ],
      images: [],
    }

    for(let region in mongoData) {
      // get min and max values
      const minBulletSize = 30;
      const maxBulletSize = 80;

      let min = Infinity;
      let max = -Infinity;

      for(let i = 0; i < mongoData[region].length; i++) {
        let matching_results = mongoData[region][i].matching_results;
        if(matching_results < min) {
          min = matching_results;
        }
        if(matching_results > max) {
          max = matching_results;
        }
      }

      for(let i = 0; i < mongoData[region].length; i++) {
        let dataItem = mongoData[region][i];
        let matching_results = dataItem.matching_results;

        // calculate size of a bubble
        let size = (matching_results - min) / (max - min) * (maxBulletSize - minBulletSize) + minBulletSize;

        let continent = dataItem.continent;

        var topic = dataItem.key.split(' ').join('\n');

        //set font size for the bubbles
        let fontSize = size / 5.5

        //shift the label on the bubble to fit in bubble better
        var labelShift = 0;

        //check to see if there is a line break and shift labels
        if (topic.match(/\n/g) !== null) {
          if (topic.match(/\n/g).length > 2) {
            labelShift = -20
          } else if (topic.match(/\n/g).length > 1) {
            labelShift = -15
          } else {
            labelShift = -8
          }
        }

        //make font size smaller if text too long on big bubbles
        if (size > 45 && topic.length > 13) {
          fontSize /= 1.5
        }

        //shift labels for smaller bubbles
        if (size < 45) {
          fontSize /= 1.4
          if (topic.match(/\n/g) !== null) {
            if (topic.match(/\n/g).length >= 2) {
              labelShift = -10
            } else if (topic.match(/\n/g).length > 0) {
              labelShift = -3
            }
          }
        }

        dataProvider.images.push({
          type: 'circle',
          width: size,
          height: size,
          label: topic,
          labelPosition: 'middle',
          labelFontSize: fontSize,
          labelShiftY: labelShift,
          labelColor: '#000000',
          color: mapConfig.regionColor[region],
          longitude: mapConfig.geoCenters[continent].longitude,
          latitude: mapConfig.geoCenters[continent].latitude,
          title: dataItem.key,
          matching_results: matching_results,
          selectable: true,
          value: dataItem.key
        });
      }


      // dataItem.key.length > fontSize ? topic = dataItem.key.slice(0, fontSize) : topic = dataItem.key;
    }

    map.dataProvider = dataProvider;

    // Listen for the init event and initialize box2d part
    // map.addListener("init", initBox2D)

    map.write("chartdiv");

    var width = 900;
    var height = 600;
    var pixels2meters = 30; // box2d uses meters, not pixels and this is ratio
    var framesPerSecond = 40;
    var world;
    var images;

    function initBox2D() {
      var width = 900;
      var height = 600;
      var pixels2meters = 30; // box2d uses meters, not pixels and this is ratio
      var framesPerSecond = 40;
      // var world;
      // var images;

      var b2Vec2 = Box2D.Common.Math.b2Vec2;
      var b2BodyDef = Box2D.Dynamics.b2BodyDef;
      var b2Body = Box2D.Dynamics.b2Body;
      var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
      var b2Fixture = Box2D.Dynamics.b2Fixture;
      var b2World = Box2D.Dynamics.b2World;
      var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
      var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
      var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
      var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


      world = new b2World(
        new b2Vec2(0, 10), //gravity
        false //allow sleep, false otherwise joints might not be restored
      );

      // walls and ground. please, study box2d tutorials if you want to understand everything below
      var wallsBodyDef = new b2BodyDef();
      wallsBodyDef.type = b2Body.b2_staticBody;

      var wallsFixtureDef = new b2FixtureDef();
      wallsFixtureDef.density = 1.0;
      wallsFixtureDef.friction = 0.5;
      wallsFixtureDef.restitution = 0.2;

      // floor
      wallsFixtureDef.shape = new b2PolygonShape();
      wallsFixtureDef.shape.SetAsBox(width / pixels2meters, 10 / pixels2meters);
      wallsBodyDef.position.Set(0, (height - 10) / pixels2meters);
      world.CreateBody(wallsBodyDef).CreateFixture(wallsFixtureDef);

      // left wall
      wallsFixtureDef.shape.SetAsBox(5 / pixels2meters, height / pixels2meters);
      wallsBodyDef.position.Set(0, 0);
      world.CreateBody(wallsBodyDef).CreateFixture(wallsFixtureDef);

      // right wall
      wallsBodyDef.position.Set(width / pixels2meters, 0);
      world.CreateBody(wallsBodyDef).CreateFixture(wallsFixtureDef);


      // bubbles
      var bubbleBodyDef = new b2BodyDef();
      bubbleBodyDef.angularDamping = 3; // we don't want to bubbles to rotate like crazy
      bubbleBodyDef.linearDamping = 0.5; // makes movement more smooth. If you increase this value, bubbles will move like in some oil
      bubbleBodyDef.type = b2Body.b2_dynamicBody;

      var bubbleFixtureDef = new b2FixtureDef();
      bubbleFixtureDef.density = 0.2;
      bubbleFixtureDef.friction = 0.3;
      bubbleFixtureDef.restitution = 0.6; // adjust this property to reduce or increase bouncing

      // we need to keep bubbles in place, so we create a static body to which bubbles will be constrained - think of a nail at each bubble position
      var nailFixtureDef = new b2FixtureDef();
      nailFixtureDef.shape = new b2CircleShape(2 / pixels2meters);

      var nailBodyDef = new b2BodyDef();
      nailBodyDef.type = b2Body.b2_staticBody; // nails are static, they don't move

      // now, loop through images of map's data provider
      images = map.dataProvider.images;

      for (var i = 0; i < images.length; i++) {
        var image = images[i];

        // create bubble
        bubbleFixtureDef.shape = new b2CircleShape(image.width / 2 / pixels2meters);
        bubbleBodyDef.position.x = image.displayObject.x / pixels2meters;
        bubbleBodyDef.position.y = image.displayObject.y / pixels2meters;
        var bubble = world.CreateBody(bubbleBodyDef).CreateFixture(bubbleFixtureDef);

        // create nail
        nailBodyDef.position.x = image.displayObject.x / pixels2meters;
        nailBodyDef.position.y = image.displayObject.y / pixels2meters;
        var nail = world.CreateBody(nailBodyDef).CreateFixture(nailFixtureDef);
        nail.SetSensor(true); // nail is sensor - this means the bubbles won't colide with it and can overlap

        // now, we need to link bubble with a nail with a joint (imagine a string)
        var jointDef = new b2DistanceJointDef();
        jointDef.bodyA = bubble.GetBody();
        jointDef.bodyB = nail.GetBody();
        // the following tow lines describes stiffness of a string, try to modify them.
        jointDef.dampingRatio = 0.4;
        jointDef.frequencyHz = 1;
        // lenght 0 means that the bubble will try to be at the nail position (if other bubbles allow)
        jointDef.length = 0.25;
        //connect the centers
        jointDef.localAnchorA = new b2Vec2(0, 0);
        jointDef.localAnchorB = new b2Vec2(0, 0);

        var joint = world.CreateJoint(jointDef);
        // store definition, image and joint in mapImage object
        image.jointDef = jointDef;
        image.box2Dimage = bubble;
        image.joint = joint;
      }

      //setup debug draw (if you don't need it, just delete the lines, uncomment to see how box objects are drawn)
      /*
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
      debugDraw.SetDrawScale(pixels2meters);
      debugDraw.SetFillAlpha(0.5);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);
      */
      // interval to update bubbles
      // release initially to do some animation
      releaseBubbles();
      // attach bubbles in some time
      setTimeout(attachBubbles, 3000);
      window.setInterval(update, 1000 / framesPerSecond)
    }

    //update bubbles
    function update() {
      var pixels2meters = 30; // box2d uses meters, not pixels and this is ratio
      var framesPerSecond = 40;

      var images = map.dataProvider.images;

      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        var box2Dimage = image.box2Dimage;

        // box2D takes care of positions of bubbles, we simply get those positions and set them on ammap bubbles.
        var bbody = box2Dimage.GetBody();
        var position = bbody.GetPosition(); // position = image.box2Dimage.getBody().getPosition()

        image.displayObject.translate(position.x * 30, position.y * 30, 1, true);
      }

      world.Step(1 / framesPerSecond, 10, 10);

      // uncomment next line if you want to see box2d objects in action (also canvas element at the bottom)
      // world.DrawDebugData();
      world.ClearForces();
    };

    // releases bubbles
    function releaseBubbles() {
      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        setTimeout(destroyJoint, Math.random() * 2000, image); // we release bubbles randomly during 2 sec interval
      }
    }

    // destroys joint
    function destroyJoint(image) {
      if (image.joint) {
        world.DestroyJoint(image.joint);
        image.joint = null;
      }
    }

    // attach bubbles back
    function attachBubbles() {
      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        if (!image.joint) {
          setTimeout(restoreJoint, Math.random() * 100, image); // we attach bubbles randomly during 0.1 sec interval
        }
      }
    }

    // restores joint
    function restoreJoint(image) {
      var joint = world.CreateJoint(image.jointDef);
      image.joint = joint;
    }
  }

  render() {
    return (
      <div id="chartdiv"
          style={{
          'width' : '100%',
          'height' : '75%',
          'backgroundAlpha' : 1,
          'backgroundColor' : '#F3F3F3',
          'margin' : 'auto',
          'borderAlpha': 1,
          'borderColor': '#000000',
        }}
       />
    );
  }
}


function mapStateToProps (state) {
  return {
    activeWord: state.activeWord
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({selectWord: selectWord}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
