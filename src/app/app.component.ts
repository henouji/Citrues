import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  item: Observable<any>;
  itemRef: AngularFireObject<any>;
  @ViewChild('webgloutput') webgloutput: ElementRef;
  title = 'Citrues';
  scene : any; 
  camera : any; 
  renderer : any;
  geometry : any;
  material : any;
  cube : any;
  coordinates = {
    x : 0, 
    y : 0,
    z : 0,
    time : 0
  }

  constructor(private db: AngularFireDatabase){
    // this.item = db.object('movements').valueChanges();
  }

  initThree(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.webgloutput.nativeElement.appendChild(this.renderer.domElement);

    let geometry = new THREE.BoxGeometry(1, 1, 3);

    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.camera.position.z = 8;

  }
  async updateValue(){
    this.itemRef = this.db.object('movements');
    this.itemRef.snapshotChanges().subscribe(coords => {
      this.coordinates = coords.payload.val();
      console.log(this.coordinates);
    });
  }

  ngOnInit(){
    console.log('NG');
    this.initThree();
    this.updateValue();
    console.log(this.coordinates);
    this.animate();
    console.log("called animate");
  }

  animate(){
    requestAnimationFrame(this.animate.bind(this));
    this.cube.rotation.x = 1;
    this.cube.rotation.y = 1;
    this.renderer.render( this.scene, this.camera );
  }
}
