// debug with extreme prejudice
"use strict"

const levelScenes = ["IntroPawn", "IntroRook", "IntroBishop", "IntroKnight", "IntroQueen"
];

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    fps: { forceSetTimeOut: true, target: 60 },
    width: 800,
    height: 600,

    
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },

    scene: [IntroPawn, IntroRook, IntroBishop, IntroKnight, IntroQueen, VictoryOverlay, DefeatOverlay
        ]
    
}

const game = new Phaser.Game(config);