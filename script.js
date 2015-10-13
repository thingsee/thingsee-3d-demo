'use strict';

(function() {

var map, marker;
var camera, scene, renderer;
var mesh;
var pitch, roll;
var bMap;
var deviceUuid;

function init() {
  window.addEventListener("hashchange", function() {
    window.location.reload();
  });
  deviceUuid = window.location.hash.replace(/\#/g,'');
  init3dWithTextures();

  if (deviceUuid.length) {
    //console.log("\nUUID hash found: " + deviceUuid + '\n');
    console.log(deviceUuid);
    createConnection();
  } else {
    // Enable for dummy data
    setInfoText("Please specify your device UUID in URL!");
    // animate();
    //console.log("\nNo UUID has found. Starting to use dummy data...\n");
  }
}

function setInfoText(text) {
  var ele = $('.info-txt');
  if (!text) {
    TweenMax.to(ele, 0.5, {y: 0, delay: 5, onComplete: function() {
      ele.html('');
    }});
  } else {
    ele.html(text);
    TweenMax.to(ele, 0.5, {y: -20});
  }
}

function iterateData( data ){
  var result = JSON.parse(data);

  for (var i = 0; i < result.length; i++) {
    update( result[i]);
  };
}

function createConnection() {
  //console.log("Creating connection!");

  var ws = new WebSocket('ws://' + window.location.hostname + ':8001' );

  ws.onopen = function() {
    ws.send(deviceUuid);  // Register
  };
  ws.onmessage = function(e) {
    // Receives a message.
    iterateData( e.data );
  };
  ws.onclose = function() {
    console.log("ws closed");
  };

}

function setBattery(bat) {
  bat = Math.round( bat * 1000 ) / 1000;
  var element = $('.battery .value');
  if ((bat*1000) <= 100)
    element.addClass('danger');
  else
    element.removeClass('danger');

  element.html(bat + '%');
}

function setTemp(temp) {
  temp = Math.round( temp * 10 ) / 10 + 'C';
  var element = $('.temp .value');
  element.html(temp);
}

function setHum(hum) {
  hum = Math.round( hum * 10 ) / 10 + '%';
  var element = $('.hum .value');
  element.html(hum);
}

function setPressure(pressure) {
  pressure = pressure / 100;
  pressure = Math.round( pressure * 10 ) / 10 + 'mbar';
  var element = $('.pressure .value');
  element.html(pressure);
}

function setSpeed(speed) {
  speed = Math.round( speed * 10 ) / 10 + 'm/s';
  var element = $('.map-stats .speed');
  element.html('Speed: ' + speed);
}

function setAlt(alt) {
  alt = Math.round( alt * 10 ) / 10 + 'm';
  var element = $('.map-stats .alt');
  element.html('Alt: ' + alt);
}

function setAcc(x, y, z) {
  pitch = (Math.atan2(-y, z) * 180) / Math.PI;
  pitch = (pitch >= 0) ? (180 - pitch) : (-pitch - 180);
  roll = (Math.atan2(x, Math.sqrt(y*y + z*z)) * 180) / Math.PI;


  function round(value) {
    return Math.abs(Math.round( value * 1000 ) / 1000);
  }

  $('.value.x').html('x: ' + round(x) + 'g');
  $('.value.y').html('y: ' + round(y) + 'g');
  $('.value.z').html('z: ' + round(z) + 'g');

  var max = 2;
  var nX = Math.abs(parseInt((x / max) * 100));
  var nY = Math.abs(parseInt((y / max) * 100));
  var nZ = Math.abs(parseInt((z / max) * 100));

  nX = _.min([nX, 100]);
  nY = _.min([nY, 100]);
  nZ = _.min([nZ, 100]);

  var eX = $('.acc-wrap .x-axis');
  var eY = $('.acc-wrap .y-axis');
  var eZ = $('.acc-wrap .z-axis');

  if (nX > 90)
    eX.addClass("danger");
  else
    eX.removeClass("danger");

  if (nY > 90)
    eY.addClass("danger");
  else
    eY.removeClass("danger");

  if (nZ > 90)
    eZ.addClass("danger");
  else
    eZ.removeClass("danger");

  eX.css({'width': nX+'%'});
  eY.css({'width': nY+'%'});
  eZ.css({'width': nZ+'%'});
}

function createMap() {
  var style = [
    {
      "stylers": [
        {
            "hue": "#ff1a00"
        },
        {
            "invert_lightness": true
        },
        {
            "saturation": -100
        },
        {
            "lightness": 33
        },
        {
            "gamma": 0.5
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2D333C"
        }
      ]
    }
  ];

  $('.map-wrap').fadeIn(1500);
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(65.01278, 25.512312),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    styles: style
  };
  map = new google.maps.Map(
    document.getElementById("map"), mapOptions
  );
  $('#map').css('background-color', 'transparent');
}

function init3dWithTextures() {
  var container = $('#container');
  var w = container.innerWidth();
  var h = container.innerHeight();
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(w, h);
  container.append(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);
  camera.position.y = -5;
  camera.rotation.x = 90 * Math.PI / 180;

  var directionalLight = new THREE.DirectionalLight(0xffffdd);
  directionalLight.position.set(0, -2, 0).normalize();
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  var texture = new THREE.Texture();
  bMap = new THREE.Texture();
  var manager = new THREE.LoadingManager();

  manager.onProgress = function ( item, loaded, total ) {
    //console.log( item, loaded, total );
  };
  var loader = new THREE.ImageLoader(manager);
  loader.load( '/images/tsone_uv_texture_bump.png', function (image) {
    bMap.image = image;
    bMap.needsUpdate = true;
  });

  var loader = new THREE.ImageLoader(manager);
  loader.load( '/images/tsone_uv_texture.png', function (image) {
    texture.image = image;
    texture.needsUpdate = true;
  });

  var loader = new THREE.OBJLoader(manager);
  loader.load("/objects/tsone.obj", function(object) {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        var material = new THREE.MeshPhongMaterial({
          shininess: 10,
          map: texture,
          bumpMap: null,
          bumpScale: 0.01,
          transparent: true,
        });
        child.material = material;
      }
    });

    mesh = object.children[0];
    scene.add(mesh);

    renderer.render(scene, camera);
    //animate();
    renderLoop();
  });
}

function showImpact(value) {
  var tl = new TimelineLite();
  var element = $('.impact-box');

  value = Math.abs(value);
  TweenMax.set(element, {scale: 0.95});
  tl.to(element, 0.5, {opacity: 1, scale: 1, ease:Elastic.easeOut});
  tl.to(element, 1, {opacity: 0, scale: 1.2, delay: 1, ease:Linear.easeNone});
  tl.play();
}

function renderLoop() {
  var m = 10;
  var dY = -parseInt(pitch * (Math.PI / 180) * m);
  var dX = parseInt(roll * (Math.PI / 180) * m);
  var rotY = parseInt(mesh.rotation.y * m);
  var rotX = parseInt(mesh.rotation.x * m);


  var newY, newX;

  if (rotY < dY) {
    newY = mesh.rotation.y * m / 10 + 0.1;
    mesh.rotation.y = Math.round(newY * 10) / 10;
  } else if (rotY > dY) {
    newY = mesh.rotation.y * m / 10 - 0.1;
    mesh.rotation.y = Math.round(newY * 10) / 10;
  }

  if (rotX < dX) {
    newX = mesh.rotation.x * m / 10 + 0.1;
    mesh.rotation.x = Math.round(newX * 10) / 10;
  } else if (rotX > dX) {
    newX = mesh.rotation.x * m / 10 - 0.1;
    mesh.rotation.x = Math.round(newX * 10) / 10;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
}

function update(payload) {

  if (!payload.hasOwnProperty('senses')) {
    //console.log("No senses found! Returning...");
    return;
  }

  var senses = payload.senses;

  // Test which accelerometer is in use 00 or 01. If 00 is not found, assume 01.
  var acc = _.find(senses, { sId: '0x00050100' });
  acc = acc ? '00' : '01';

  var y = _.find(senses, { sId: '0x000501' + acc });
  var x = _.find(senses, { sId: '0x000502' + acc });
  var z = _.find(senses, { sId: '0x000503' + acc });

  if (x && y && z)
    setAcc(x.val, -y.val, -z.val);


  var imp = _.find(senses, { sId: '0x00050400' });
  if (imp != null)
    showImpact(imp.val);

  // Battery 3.7
  var bat = _.find(senses, { sId: '0x00030200' });
  if (bat)
    setBattery(bat.val);


  // Temp & Hum
  var temp = _.find(senses, { sId: '0x00060100' });
  if (temp)
    setTemp(temp.val);

  var hum = _.find(senses, { sId: '0x00060200' });
  if (hum)
    setHum(hum.val);

  var press = _.find(senses, { sId: '0x00060400' });
  if (press)
    setPressure(press.val);


  // Location
  var lat = _.find(senses, { sId: '0x00010100' });
  var lng = _.find(senses, { sId: '0x00010200' });

  if (lat && lng) {
    if (map == null)
      createMap();

    var coords = new google.maps.LatLng(lat.val, lng.val);

    if (marker == null) {
      map.panTo(coords);
      marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: deviceUuid || 'Dummy Location'
      });
    } else {
      map.panTo(coords);
      marker.setPosition(coords);
    }

  }

  // Speed & Alt
  var speed = _.find(senses, { 'id': '0x00020100' });
  if (speed)
    setSpeed(speed.val);

  var alt = _.find(senses, { 'id': '0x00010300' });
  if (alt)
    setAlt(alt.val);

}

function animate() {
  mesh.rotation.x += 0.02;
  mesh.rotation.y += 0.01;
  mesh.rotation.z += 0.007;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();

}());
