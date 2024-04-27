window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);
        // Activer le moteur de physique
       
    
        // Créer une caméra en vue 3D surplombant la plateforme
        const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
    
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    
        // Créer une boîte pour représenter la plateforme de jeu
        const platform = BABYLON.MeshBuilder.CreateBox('platform', { width: 5, height: 0.5, depth: 5 }, scene);
        platform.position.y = -0.25; // Ajuster la position pour qu'elle repose au sol
        platform.physicsImpostor = new BABYLON.PhysicsImpostor(platform, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
        
        // Gravité
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        scene.collisionsEnabled = true;
        // Créer le filet de volleyball (boîte transparente)
        const netHeight = 0.2; // Hauteur du filet
        const netWidth = 5;
        const netDepth = 0.01; // Épaisseur du filet
        const net = BABYLON.MeshBuilder.CreateBox('net', { width: netWidth, height: netHeight, depth: netDepth }, scene);
        net.position.y = platform.position.y + platform.scaling.y / 2 + netHeight / 2; // Positionner le filet au milieu de la plateforme
        net.material = new BABYLON.StandardMaterial('netMaterial', scene);
        net.material.alpha = 0.5; // Transparence du filet
        // Créer les raquettes
        const racketWidth = 1;
        const racketHeight = 0.2;
        const racketDepth = 0.2;

        // Raquette gauche
        const racketLeft = BABYLON.MeshBuilder.CreateBox('racketLeft', { width: racketWidth, height: racketHeight, depth: racketDepth }, scene);
        racketLeft.position.x = -netWidth / 12; // Positionner la raquette à gauche du filet
        racketLeft.position.y = platform.position.y + platform.scaling.y / 2 + 1/2; // Hauteur de la raquette
        racketLeft.position.z = -1.5; // Alignement avec le centre du terrain
        racketLeft.physicsImpostor = new BABYLON.PhysicsImpostor(racketLeft, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.5, restitution: 0.7 }, scene);

        // Raquette droite
        const racketRight = BABYLON.MeshBuilder.CreateBox('racketRight', { width: racketWidth, height: racketHeight, depth: racketDepth }, scene);
        racketRight.position.x = netWidth / 12; // Positionner la raquette à droite du filet
        racketRight.position.y = platform.position.y + platform.scaling.y / 2 + 1/2; // Hauteur de la raquette
        racketRight.position.z = 2.5; // Alignement avec le centre du terrain
        // Créer un ballon de volleyball
        const ballDiameter = 0.2;
        const volleyball = BABYLON.MeshBuilder.CreateSphere('volleyball', { diameter: ballDiameter }, scene);
        volleyball.position.y = platform.position.y + platform.scaling.y / 2 + ballDiameter / 2; // Positionner le ballon au-dessus de la plateforme
        volleyball.position.z = -1 ; // Aligner le ballon avec le centre du terrain
        volleyball.physicsImpostor = new BABYLON.PhysicsImpostor(volleyball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0.2, restitution: 0.9 }, scene);

        // Variables pour le mouvement du ballon
        let velocity = new BABYLON.Vector3(0, 1, 0); // Vitesse initiale
        const gravity = -0.05; // Gravité
        const deltaTime = 0.016; // Temps entre chaque frame (en secondes)
        
        // Boucle de rendu pour mettre à jour la position du ballon
        scene.onBeforeRenderObservable.add(() => {
        // Appliquer la gravité à la vitesse
        velocity.y += gravity * deltaTime;

        // Mettre à jour la position du ballon en fonction de la vitesse
        volleyball.position.addInPlace(velocity.scale(deltaTime));

        // Vérifier la collision avec la raquette gauche
        const intersectsRacketLeft = volleyball.intersectsMesh(racketLeft, false);
        if (intersectsRacketLeft) {
            // Collision avec la raquette gauche détectée
            console.log("Collision avec la raquette gauche !");
            // Inverser la vitesse verticale pour simuler un rebond
            velocity.y *= -0.9; // Inverse la direction de la balle
        }

    // Vérifier la collision avec la raquette droite
    const intersectsRacketRight = volleyball.intersectsMesh(racketRight, false);
    if (intersectsRacketRight) {
        // Collision avec la raquette droite détectée
        console.log("Collision avec la raquette droite !");
        // Inverser la vitesse verticale pour simuler un rebond
        velocity.y *= -0.9; // Inverse la direction de la balle
    }
});

            return scene;
            };
        
    

    const scene = createScene();

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
});
