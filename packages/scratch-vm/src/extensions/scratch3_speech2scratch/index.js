const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
const blockIconURI = 'data:image/png;base64,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';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
const menuIconURI = 'data:image/png;base64,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';

/**
 * Class for the Speech2Scratch extension
 * @constructor
 */
class Scratch3Speech2Scratch {
    constructor (runtime) {
        this.runtime = runtime;
        this.speech = '';
    }

    getInfo () {
        return {
            id: 'speech2scratch',
            name: 'Speech2Scratch',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'startRecognition',
                    blockType: BlockType.COMMAND,
                    text: '音声認識開始'
                },
                {
                    opcode: 'getSpeech',
                    blockType: BlockType.REPORTER,
                    text: '音声'
                }
            ]
        };
    }

    startRecognition () {
        return new Promise((resolve, reject) => {
            this.speech = '';

            const recognition = new SpeechRecognition();
            recognition.onresult = (event) => {
                this.speech = event.results[0][0].transcript;
                resolve();
            };
            recognition.onerror = (event) => {
                reject(event.error);
            };
            recognition.onend = () => {
                resolve();
            };
            recognition.start();
        });
    }

    getSpeech() {
        return this.speech;
    }
}

module.exports = Scratch3Speech2Scratch;
