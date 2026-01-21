const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

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
 * Class for the Ollama extension
 * @constructor
 */
class Scratch3Ollama {
    constructor (runtime) {
        this.runtime = runtime;
        this.ollamaResponse = '';
        this.ollamaServerURL = 'http://localhost:11434';
        this.ollamaModel = 'gemma3:1b';
        this.ollamaSystemPrompt = 'あなたは教育向けプログラミングWebアプリのScratchに組み込まれた猫のキャラクターです。フレンドリーな回答をしてください。回答は100文字程度で答えてください。mdファイル形式は使わないでください。';
    }

    getInfo () {
        return {
            id: 'ollama',
            name: 'Ollama',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'setServerURL',
                    blockType: BlockType.COMMAND,
                    text: 'サーバーURLを [URL] に設定',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'http://localhost:11434'
                        }
                    }
                },
                {
                    opcode: 'setModel',
                    blockType: BlockType.COMMAND,
                    text: 'モデルを [MODEL] に設定',
                    arguments: {
                        MODEL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'gemma3:1b'
                        }
                    }
                },
                {
                    opcode: 'setSystemPrompt',
                    blockType: BlockType.COMMAND,
                    text: 'システムプロンプトを [PROMPT] に設定',
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'あなたは教育向けプログラミングWebアプリのScratchに組み込まれた猫のキャラクターです。フレンドリーな回答をしてください。回答は100文字程度で答えてください。mdファイル形式は使わないでください。'
                        }
                    }
                },
                {
                    opcode: 'sendPrompt',
                    blockType: BlockType.COMMAND,
                    text: '[PROMPT] を送信',
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'こんにちは、元気ですか？'
                        }
                    }
                },
                {
                    opcode: 'getResponse',
                    blockType: BlockType.REPORTER,
                    text: '答え'
                }
            ]
        };
    }

    setServerURL (args) {
        this.ollamaServerURL = Cast.toString(args.URL);
    }

    setModel (args) {
        this.ollamaModel = Cast.toString(args.MODEL);
    }

    setSystemPrompt (args) {
        this.ollamaSystemPrompt = Cast.toString(args.PROMPT);
    }

    async sendPrompt (args) {
        const prompt = Cast.toString(args.PROMPT);

        try {
            const response = await fetch(`${this.ollamaServerURL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.ollamaModel,
                    messages: [{ role: 'system', content: this.ollamaSystemPrompt }, { role: 'user', content: prompt }],
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.ollamaResponse = data.message.content;
        } catch (error) {
            this.ollamaResponse = `Error: ${error.message}`;
            throw error;
        }
    }

    getResponse () {
        return this.ollamaResponse;
    }
}

module.exports = Scratch3Ollama;
