
import * as THREE from "three";

export class CubeWarCharacter {

    constructor(options = {}) {

        this.group = new THREE.Group();
        this.group.name = "CubeWarCharacter";

        this.colors = {
            skin: options.skinColor || "#c99570",
            hair: options.hairColor || "#30251f",
            jacket: options.jacketColor || "#344f70",
            jacketDark: "#23364e",
            shirt: "#d8dce0",
            pants: options.pantsColor || "#343b49",
            pantsDark: "#252b36",
            boots: "#252525",
            sole: "#777777",
            metal: "#aeb9c4",
            accent: options.accentColor || "#e39b35"
        };

        this.materials = {};

        this.createMaterials();
        this.createModel();

    }

    createMaterials() {

        const create = (color, roughness = 0.9, metalness = 0) => {
            return new THREE.MeshStandardMaterial({
                color,
                roughness,
                metalness,
                flatShading: true
            });
        };

        for (const [name, color] of Object.entries(this.colors)) {
            this.materials[name] = create(
                color,
                name === "metal" ? 0.35 : 0.9,
                name === "metal" ? 0.65 : 0
            );
        }

        this.materials.eyeWhite = create("#ffffff");
        this.materials.eye = create("#29231f");
        this.materials.mouth = create("#713f35");
        this.materials.skinShadow = create("#a87557");
    }

    // Erstellt ein polygonales Körperteil
    part(parent, w, h, d, material, x, y, z, bevel = 0) {

        const geometry = new THREE.BoxGeometry(w, h, d);

        if (bevel > 0) {
            // Kleine Abschrägung durch abgerundete Kanten
            const positions = geometry.attributes.position;

            for (let i = 0; i < positions.count; i++) {
                const px = positions.getX(i);
                const py = positions.getY(i);
                const pz = positions.getZ(i);

                const nx = Math.max(-w / 2 + bevel,
                    Math.min(w / 2 - bevel, px));
                const ny = Math.max(-h / 2 + bevel,
                    Math.min(h / 2 - bevel, py));
                const nz = Math.max(-d / 2 + bevel,
                    Math.min(d / 2 - bevel, pz));

                positions.setXYZ(i, nx, ny, nz);
            }

            geometry.computeVertexNormals();
        }

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        parent.add(mesh);

        return mesh;
    }

    // Kopf mit polygonalen Gesichtszügen
    createHead() {

        const head = new THREE.Group();
        head.position.y = 2.72;

        // Schädel
        this.part(
            head, 0.72, 0.83, 0.68,
            this.materials.skin,
            0, 0, 0
        );

        // Kiefer
        this.part(
            head, 0.58, 0.22, 0.59,
            this.materials.skin,
            0, -0.27, 0.045
        );

        // Ohren
        this.part(head, 0.12, 0.20, 0.16,
            this.materials.skin, -0.40, -0.02, 0);

        this.part(head, 0.12, 0.20, 0.16,
            this.materials.skin, 0.40, -0.02, 0);

        // Augenbrauen
        this.part(head, 0.20, 0.045, 0.035,
            this.materials.hair, -0.17, 0.10, 0.35);

        this.part(head, 0.20, 0.045, 0.035,
            this.materials.hair, 0.17, 0.10, 0.35);

        // Augen
        this.part(head, 0.105, 0.09, 0.035,
            this.materials.eyeWhite, -0.17, 0.015, 0.355);

        this.part(head, 0.105, 0.09, 0.035,
            this.materials.eyeWhite, 0.17, 0.015, 0.355);

        // Pupillen
        this.part(head, 0.045, 0.065, 0.025,
            this.materials.eye, -0.17, 0.01, 0.38);

        this.part(head, 0.045, 0.065, 0.025,
            this.materials.eye, 0.17, 0.01, 0.38);

        // Nase
        this.part(head, 0.12, 0.15, 0.16,
            this.materials.skinShadow, 0, -0.075, 0.37);

        // Mund
        this.part(head, 0.18, 0.035, 0.025,
            this.materials.mouth, 0, -0.22, 0.35);

        // Haare oben
        this.part(head, 0.75, 0.18, 0.70,
            this.materials.hair, 0, 0.43, -0.01);

        // Haarseiten
        this.part(head, 0.10, 0.25, 0.65,
            this.materials.hair, -0.34, 0.30, -0.01);

        this.part(head, 0.10, 0.25, 0.65,
            this.materials.hair, 0.34, 0.30, -0.01);

        // Haarsträhnen
        this.part(head, 0.24, 0.12, 0.22,
            this.materials.hair, -0.20, 0.39, 0.28);

        this.part(head, 0.18, 0.10, 0.18,
            this.materials.hair, 0.12, 0.40, 0.30);

        this.group.add(head);
    }

    // Hals
    createNeck() {

        this.part(
            this.group,
            0.27, 0.30, 0.27,
            this.materials.skin,
            0, 2.20, 0
        );
    }

    // Jacke und Oberkörper
    createTorso() {

        const torso = new THREE.Group();

        // Grundkörper
        this.part(torso, 0.92, 1.05, 0.48,
            this.materials.jacket, 0, 0, 0);

        // Brustbereich
        this.part(torso, 0.88, 0.42, 0.035,
            this.materials.jacketDark, 0, 0.25, 0.25);

        // Shirt in der Mitte
        this.part(torso, 0.23, 0.70, 0.035,
            this.materials.shirt, 0, 0.02, 0.26);

        // Reißverschluss
        this.part(torso, 0.025, 0.68, 0.025,
            this.materials.metal, 0, 0.02, 0.29);

        // Jackenkragen
        this.part(torso, 0.32, 0.13, 0.53,
            this.materials.jacketDark, 0, 0.51, 0);

        // Schulterverstärkungen
        this.part(torso, 0.29, 0.18, 0.51,
            this.materials.jacketDark, -0.34, 0.42, 0);

        this.part(torso, 0.29, 0.18, 0.51,
            this.materials.jacketDark, 0.34, 0.42, 0);

        // Brusttaschen
        for (const x of [-0.27, 0.27]) {

            this.part(torso, 0.22, 0.22, 0.045,
                this.materials.jacketDark, x, 0.15, 0.27);

            this.part(torso, 0.23, 0.055, 0.055,
                this.materials.accent, x, 0.27, 0.29);

        }

        // Untere Jackentaschen
        for (const x of [-0.30, 0.30]) {

            this.part(torso, 0.22, 0.18, 0.04,
                this.materials.jacketDark, x, -0.32, 0.26);

        }

        // Gürtel
        this.part(torso, 0.95, 0.13, 0.51,
            this.materials.pantsDark, 0, -0.55, 0);

        // Gürtelschnalle
        this.part(torso, 0.15, 0.10, 0.035,
            this.materials.metal, 0, -0.55, 0.28);

        torso.position.y = 1.68;

        this.group.add(torso);
    }

    // Arme
    createArm(side) {

        const arm = new THREE.Group();

        // Schulter
        this.part(arm, 0.37, 0.38, 0.40,
            this.materials.jacketDark, 0, 0, 0);

        // Oberarm
        this.part(arm, 0.32, 0.43, 0.36,
            this.materials.jacket, 0, -0.36, 0);

        // Unterarm
        this.part(arm, 0.29, 0.39, 0.34,
            this.materials.jacket, 0, -0.75, 0);

        // Ärmelabschluss
        this.part(arm, 0.31, 0.08, 0.36,
            this.materials.jacketDark, 0, -0.94, 0);

        // Ellbogenverstärkung
        this.part(arm, 0.31, 0.16, 0.045,
            this.materials.accent, 0, -0.52, 0.19);

        // Hand
        this.part(arm, 0.25, 0.25, 0.27,
            this.materials.skin, 0, -1.11, 0);

        arm.position.set(side * 0.67, 2.02, 0);

        this.group.add(arm);
    }

    // Beine und Schuhe
    createLeg(side) {

        const leg = new THREE.Group();

        // Oberschenkel
        this.part(leg, 0.39, 0.53, 0.42,
            this.materials.pants, 0, -0.24, 0);

        // Knie
        this.part(leg, 0.40, 0.24, 0.44,
            this.materials.pantsDark, 0, -0.55, 0.015);

        // Knieschoner
        this.part(leg, 0.29, 0.20, 0.055,
            this.materials.jacketDark, 0, -0.55, 0.25);

        // Unterhose / Unterschenkel
        this.part(leg, 0.37, 0.42, 0.39,
            this.materials.pants, 0, -0.86, 0);

        // Seitentasche
        this.part(leg, 0.12, 0.25, 0.08,
            this.materials.pantsDark, side * 0.20, -0.32, 0.10);

        // Tasche-Klappe
        this.part(leg, 0.14, 0.055, 0.09,
            this.materials.accent, side * 0.20, -0.20, 0.15);

        // Stiefel
        this.part(leg, 0.44, 0.27, 0.58,
            this.materials.boots, 0, -1.17, 0.06);

        // Sohle
        this.part(leg, 0.46, 0.08, 0.60,
            this.materials.sole, 0, -1.33, 0.06);

        // Schuhkappe
        this.part(leg, 0.40, 0.12, 0.20,
            this.materials.jacketDark, 0, -1.12, 0.25);

        // Schnürsenkel
        for (let i = 0; i < 3; i++) {

            this.part(leg, 0.20, 0.025, 0.025,
                this.materials.detail,
                0, -1.08 - i * 0.055, 0.32);

        }

        leg.position.set(side * 0.25, 1.10, 0);

        this.group.add(leg);
    }

    createModel() {

        this.createHead();
        this.createNeck();
        this.createTorso();

        this.createArm(-1);
        this.createArm(1);

        this.createLeg(-1);
        this.createLeg(1);

        // Gesamtgröße
        this.group.scale.setScalar(1);

    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    setRotation(y) {
        this.group.rotation.y = y;
    }

    setScale(scale) {
        this.group.scale.setScalar(scale);
    }

    addToScene(scene) {
        scene.add(this.group);
    }

    removeFromScene(scene) {
        scene.remove(this.group);
    }

}
