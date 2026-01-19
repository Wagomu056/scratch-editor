const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkNJREFUeNrsmoFxgzAMAE0vA9AJmg1KJ4izQTcIGzSdoGyQ6wRcJ2g3oJ2AdALSCWADau5MjxJDJBs7xJHudMkRRVgPtmRBwNzLUuiT0KhzbC/0VeiBeS6J0HpEE5+D350IvtWdj8FzYPCtct8AvCMBpL4BKJEASlcDCxydp57r2G7YlYsrAJ+W7WcP4M2y/UVIDlwAc1+nWwiAkEs75jOEptwteoEXvpfBQ5siLj9JSEjOIwFgnvabF5ckRo2WSGMTM0ctdS9g4UHw3TSLvvq1Zxph9gI+VmMhbYcJAAEgALYB7KXa7CztXYDhyBwbK1bZeKJaovXfX9Gx/rkNAKcaGM1vqUHwKcB/fi4ABaJeyDWCh7bGQuCdMDmA2NKU0hlwrOuv2Q1mvWPPkmo2csJK6C1yXckRm5JmoXtA+i9P3JFrOe5/D18XCjIhcIA6GQIDQMc/B0wXfq46oELY/sy9Dlhq9hegsnI0JiMAmIBC5KLGkTvSyDWARl4s2bry/yeqdAFNW9uJUpRJqt0i0qoqLiMAY9Va+xTItBRORvxjqkxlXAE7fnlhLT8z5J30IfRbfr8T+jhhZ6mS/tvscC/9Y0QZ15QA5i7KuKgfcO0AFuz4dZSK+fuMvmLA1290dm9zV05TYGAKmPbovhTHN53SFGJzYOoXo1adKwexcd4TTAb+nyFthlJugrShKUBpkAAQAAJAAAiAu0Jow9QNzAhpEw3k+SXSxnkhRHsBWgMIAAEgAATAwzoA3Du7IFE+nf4VYACOBZBMGfW8oAAAAABJRU5ErkJggg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkNJREFUeNrsmoFxgzAMAE0vA9AJmg1KJ4izQTcIGzSdoGyQ6wRcJ2g3oJ2AdALSCWADau5MjxJDJBs7xJHudMkRRVgPtmRBwNzLUuiT0KhzbC/0VeiBeS6J0HpEE5+D350IvtWdj8FzYPCtct8AvCMBpL4BKJEASlcDCxydp57r2G7YlYsrAJ+W7WcP4M2y/UVIDlwAc1+nWwiAkEs75jOEptwteoEXvpfBQ5siLj9JSEjOIwFgnvabF5ckRo2WSGMTM0ctdS9g4UHw3TSLvvq1Zxph9gI+VmMhbYcJAAEgALYB7KXa7CztXYDhyBwbK1bZeKJaovXfX9Gx/rkNAKcaGM1vqUHwKcB/fi4ABaJeyDWCh7bGQuCdMDmA2NKU0hlwrOuv2Q1mvWPPkmo2csJK6C1yXckRm5JmoXtA+i9P3JFrOe5/D18XCjIhcIA6GQIDQMc/B0wXfq46oELY/sy9Dlhq9hegsnI0JiMAmIBC5KLGkTvSyDWARl4s2bry/yeqdAFNW9uJUpRJqt0i0qoqLiMAY9Va+xTItBRORvxjqkxlXAE7fnlhLT8z5J30IfRbfr8T+jhhZ6mS/tvscC/9Y0QZ15QA5i7KuKgfcO0AFuz4dZSK+fuMvmLA1290dm9zV05TYGAKmPbovhTHN53SFGJzYOoXo1adKwexcd4TTAb+nyFthlJugrShKUBpkAAQAAJAAAiAu0Jow9QNzAhpEw3k+SXSxnkhRHsBWgMIAAEgAATAwzoA3Du7IFE+nf4VYACOBZBMGfW8oAAAAABJRU5ErkJggg==';

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
