import * as THREE from 'three';

const heightFactor = 4.5
const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight * heightFactor
const windowHalfY = SCREEN_HEIGHT / 2

const r = 450

let mouseX = 0, mouseY = 0, scrollY = 0, camera, scene, renderer;

export default function (mountPoint: string) {
    init(mountPoint);
    animate();
}

class Orb {
    constructor(size, color, opacity, loc) {

    }
}

function createOrb({ size = .2, color = 'white', opacity = .4, x = 0, y = 0, count = 1 }) {
    const orbs: Array<[number, string, number, number, number]> = []
    for (let i = 0; i < count; ++i) {
        orbs.push([size, color, opacity, y, x])
    }
    return orbs
}

function init(mountPoint: string) {

    camera = new THREE.PerspectiveCamera(80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 3000);
    camera.aspect = (window.innerWidth) / (window.innerHeight * heightFactor)
    camera.position.z = 1000;

    scene = new THREE.Scene();



    const OrbOne = [[.19, 0xffffff, 0.125, 500, -100], [.193, "blue", 0.125, 500, -100], [.2, "purple" as any, 0.125, 500, -100]]
    const OrbTwo = [[.19, 0xffffff, 0.125, 0], [.193, "blue", 0.125, 0], [.2, "purple" as any, 0.125, 0, 200]]
    const OrbThree = [[.19, 0xffffff, 0.125, -800], [.193, "blue", 0.125, -800], [.2, "purple" as any, 0.125, 0, -800]]

    const parameters = [...OrbOne, ...OrbTwo, ...OrbThree, [4, "white", 0.125, 0]];

    const geometry = createGeometry();

    for (let i = 0; i < parameters.length; ++i) {

        const p = parameters[i];

        const material = new THREE.LineBasicMaterial({ color: p[1], opacity: p[2] });

        const line = new THREE.LineSegments(geometry, material);
        line.scale.x = line.scale.y = line.scale.z = p[0];
        line.userData.originalScale = p[0];
        line.rotation.y = Math.random() * Math.PI;
        line.updateMatrix();
        line.position.y = p[3]
        line.position.x = p[4]
        scene.add(line);

    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    const canvas = renderer.domElement
    canvas.classList = "BackgroundCanvas"

    // const mountPointNode = document.getElementById("root")
    // if (mountPointNode) {
    //     mountPointNode.appendChild(canvas);
    // }
    document.body.style.touchAction = 'none';
    document.body.addEventListener('pointermove', onPointerMove);
    window.addEventListener('scroll', onScroll)

    //

    window.addEventListener('resize', onWindowResize);

    // test geometry swapability

    // setInterval(function () {

    //     const geometry = createGeometry();

    //     scene.traverse(function (object) {

    //         if (object.isLine) {

    //             object.geometry.dispose();
    //             object.geometry = geometry;

    //         }

    //     });

    // }, 1000);

    const dgeometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(dgeometry, material);
    scene.add(cube);
}

function createGeometry() {

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const vertex = new THREE.Vector3();

    for (let i = 0; i < 2500; i++) {

        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.normalize();
        vertex.multiplyScalar(r);

        vertices.push(vertex.x, vertex.y, vertex.z);

        vertex.multiplyScalar(Math.random() * 0.09 + 1);

        vertices.push(vertex.x, vertex.y, vertex.z);

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    return geometry;

}



function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight * 4.5)
    camera.aspect = (window.innerWidth) / (window.innerHeight * 4.5)
    camera.updateProjectionMatrix()
}

function onPointerMove(event) {
    if (event.isPrimary === false) return;
    mouseY = event.clientY - windowHalfY;
    mouseX = event.clientX;
}

function onScroll() {
    scrollY = window.scrollY
}

//

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    // camera.position.x += (- scrollY + 1000 - camera.position.x) * .05;
    // camera.position.y += (- mouseY + 800 - camera.position.y) * .05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);


    const time = Date.now() * 0.0001;

    for (let i = 0; i < scene.children.length; i++) {

        const object = scene.children[i];

        if (object.isLine) {
            object.rotation.y = time * (i < 4 ? (i + 1) : - (i + 1));

            if (i < 10) {

                const scale = object.userData.originalScale * (i / 5 + 2) * (1 + 0.5 * Math.sin(6 * time));

                object.scale.x = object.scale.y = object.scale.z = scale;

            }

        }

    }

}
