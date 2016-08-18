
var animator_width=document.getElementById('animator').offsetWidth-5;
var animator_height=document.getElementById('animator').offsetHeight-5;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, animator_width/animator_height, 0.1, 1000 );

var planeW = 3; // pixels
var planeH = 3; // pixels 
var numW = 2; // how many wide (50*50 = 2500 pixels wide)
var numH = 2; // how many tall (50*50 = 2500 pixels tall)
var plane = new THREE.Mesh(
    new THREE.PlaneGeometry( planeW*numW, planeH*numH, planeW, planeH ),
    new THREE.MeshBasicMaterial( {
        color: 0xFFFFFF,
        wireframe: true
    } )
);
plane.rotateX(-Math.PI*0.45);
plane.rotateZ(-Math.PI*0.3);
scene.add(plane);

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xff00ff, 0.5 );
directionalLight.position.set( 5, 10, 5 ).normalize();
scene.add( directionalLight );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( animator_width,animator_height );

document.getElementById('animator').appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshBasicMaterial( { color: 0xFF000} );
var material = new THREE.MeshLambertMaterial( {
						color: 0xFF0000,
						vertexColors: THREE.FaceColors,
						morphTargets: true,
						overdraw: 0.5
					} );
var cube = new THREE.Mesh( geometry, material );
cube.rotateX(10);
cube.rotateY(20);
scene.add( cube );

camera.position.z = 5;

var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
};

render();
