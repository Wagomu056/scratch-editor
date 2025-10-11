const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const { OpenAI } = require("openai");

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkNJREFUeNrsmoFxgzAMAE0vA9AJmg1KJ4izQTcIGzSdoGyQ6wRcJ2g3oJ2AdALSCWADau5MjxJDJBs7xJHudMkRRVgPtmRBwNzLUuiT0KhzbC/0VeiBeS6J0HpEE5+D350IvtWdj8FzYPCtct8AvCMBpL4BKJEASlcDCxydp57r2G7YlYsrAJ+W7WcP4M2y/UVIDlwAc1+nWwiAkEs75jOEptwteoEXvpfBQ5siLj9JSEjOIwFgnvabF5ckRo2WSGMTM0ctdS9g4UHw3TSLvvq1Zxph9gI+VmMhbYcJAAEgALYB7KXa7CztXYDhyBwbK1bZeKJaovXfX9Gx/rkNAKcaGM1vqUHwKcB/fi4ABaJeyDWCh7bGQuCdMDmA2NKU0hlwrOuv2Q1mvWPPkmo2csJK6C1yXckRm5JmoXtA+i9P3JFrOe5/D18XCjIhcIA6GQIDQMc/B0wXfq46oELY/sy9Dlhq9hegsnI0JiMAmIBC5KLGkTvSyDWARl4s2bry/yeqdAFNW9uJUpRJqt0i0qoqLiMAY9Va+xTItBRORvxjqkxlXAE7fnlhLT8z5J30IfRbfr8T+jhhZ6mS/tvscC/9Y0QZ15QA5i7KuKgfcO0AFuz4dZSK+fuMvmLA1290dm9zV05TYGAKmPbovhTHN53SFGJzYOoXo1adKwexcd4TTAb+nyFthlJugrShKUBpkAAQAAJAAAiAu0Jow9QNzAhpEw3k+SXSxnkhRHsBWgMIAAEgAATAwzoA3Du7IFE+nf4VYACOBZBMGfW8oAAAAABJRU5ErkJggg=='

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkNJREFUeNrsmoFxgzAMAE0vA9AJmg1KJ4izQTcIGzSdoGyQ6wRcJ2g3oJ2AdALSCWADau5MjxJDJBs7xJHudMkRRVgPtmRBwNzLUuiT0KhzbC/0VeiBeS6J0HpEE5+D350IvtWdj8FzYPCtct8AvCMBpL4BKJEASlcDCxydp57r2G7YlYsrAJ+W7WcP4M2y/UVIDlwAc1+nWwiAkEs75jOEptwteoEXvpfBQ5siLj9JSEjOIwFgnvabF5ckRo2WSGMTM0ctdS9g4UHw3TSLvvq1Zxph9gI+VmMhbYcJAAEgALYB7KXa7CztXYDhyBwbK1bZeKJaovXfX9Gx/rkNAKcaGM1vqUHwKcB/fi4ABaJeyDWCh7bGQuCdMDmA2NKU0hlwrOuv2Q1mvWPPkmo2csJK6C1yXckRm5JmoXtA+i9P3JFrOe5/D18XCjIhcIA6GQIDQMc/B0wXfq46oELY/sy9Dlhq9hegsnI0JiMAmIBC5KLGkTvSyDWARl4s2bry/yeqdAFNW9uJUpRJqt0i0qoqLiMAY9Va+xTItBRORvxjqkxlXAE7fnlhLT8z5J30IfRbfr8T+jhhZ6mS/tvscC/9Y0QZ15QA5i7KuKgfcO0AFuz4dZSK+fuMvmLA1290dm9zV05TYGAKmPbovhTHN53SFGJzYOoXo1adKwexcd4TTAb+nyFthlJugrShKUBpkAAQAAJAAAiAu0Jow9QNzAhpEw3k+SXSxnkhRHsBWgMIAAEgAATAwzoA3Du7IFE+nf4VYACOBZBMGfW8oAAAAABJRU5ErkJggg=='

/**
 * Class for the ChatGPT
 * @constructor
 */
class Scratch3ChatGPT {
    constructor (runtime) {
        this.runtime = runtime;
        this.apiKey = "";
        this.openAI = null;
        this.inputText = "";
        this.responseText = "";
        this.conversationHistory = [];
    }

    getInfo () {
        return {
            id: 'chatgpt',
            name: 'ChatGPT',
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'setApiKey',
                    blockType: BlockType.COMMAND,
                    text: 'APIキーをせっていする [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: this.apiKey
                        }
                    }
                },
                {
                    opcode: 'getApiKey',
                    blockType: BlockType.REPORTER,
                    text: 'APIキー',
                },
                {
                    opcode: 'requestChatGPT',
                    blockType: BlockType.COMMAND,
                    text: 'ChatGPTにリクエストする [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: this.inputText
                        }
                    }
                },
                {
                    opcode: 'requestChatGPTWithTool',
                    blockType: BlockType.COMMAND,
                    text: 'ChatGPTにツールを使ってリクエストする [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: this.inputText
                        }
                    }
                },
                {
                    opcode: 'getResponseText',
                    blockType: BlockType.REPORTER,
                    text: 'ChatGPTのレスポンス',
                },
                {
                    opcode: 'clearResponseText',
                    blockType: BlockType.COMMAND,
                    text: 'ChatGPTのレスポンスをクリアする',
                },
                {
                    opcode: 'setFunctions',
                    blockType: BlockType.COMMAND,
                    text: 'ファンクション定義をセットする [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'setPrompt',
                    blockType: BlockType.COMMAND,
                    text: 'プロンプトをセットする [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'あなたはScratchに組み込まれている猫のキャラクターです。'
                        }
                    }
                },
                {
                    opcode: 'clearConversationHistory',
                    blockType: BlockType.COMMAND,
                    text: '会話履歴をクリアする',
                }
            ]
        };
    }

    setApiKey(args) {
        this.apiKey = Cast.toString(args.TEXT);
        this.openAI = new OpenAI({ 
          apiKey: this.apiKey,
          dangerouslyAllowBrowser: true
        });
    }

    setFunctions(args) {
      try {
          this.functions = JSON.parse(Cast.toString(args.TEXT));
          console.log('Functions updated:', this.functions);
      } catch (error) {
          console.error('Invalid functions JSON:', error);
          this.functions = functions; // デフォルトに戻す
      }
    }

    setPrompt(args) {
      this.prompt = Cast.toString(args.TEXT);
      this.conversationHistory = [
        { role: "system", content: this.prompt }
      ];
    }

    async requestChatGPT(args) {
        this.inputText = Cast.toString(args.TEXT);
        const response = await this.openAI.responses.create({
            model: "gpt-4o",
            instructions: this.prompt,
            input: this.inputText,
        });
        this.responseText = response.output_text;
    }

    async requestChatGPTWithTool(args) {
      if (!this.prompt) {
        this.responseText = "プロンプトが設定されていません。";
        return;
      }
      if (!this.functions) {
        this.responseText = "ファンクション定義が設定されていません。";
        return;
      }

      this.inputText = Cast.toString(args.TEXT);
      console.log(this.inputText);

      // 会話履歴がなければ初期化
      if (this.conversationHistory.length === 0) {
        this.conversationHistory = [
          { role: "system", content: this.prompt }
        ];
      }

      // ユーザーメッセージを会話履歴に追加
      this.conversationHistory.push({ 
        role: "user", 
        content: this.inputText 
      });

      // 最終結果
      var return_value = "";

      // ユーザーの指示を分解
        //model: "gpt-4-0613", // GPT-4のfunction calling対応版
      const response = await this.openAI.chat.completions.create({
        model: "gpt-4.1-nano", // GPT-4のfunction calling対応版
        messages: this.conversationHistory,
        tools: this.functions.map((fn) => ({ type: "function", function: fn })),
        tool_choice: { type: "function", function: { name: "processActionSequence" } },
      });

      // 結果の抽出
      const toolCall = response.choices[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        console.log(toolCall);
        const args = JSON.parse(toolCall.function.arguments);
        //console.log("💡 分解されたアクション一覧:");
        var total_message = "";
        for (const step of args.actions) {
          return_value += `${step.arg1},${step.arg2},`;
          total_message += step.arg1;
        }

        // アシスタントの返答を会話履歴に追加
        this.conversationHistory.push({
          role: "assistant",
          content: total_message
        });
      } else {
        return_value = "Function calling failed";
        console.error("❌ Function calling に失敗しました。");
      }

      this.responseText = return_value;
      console.log(this.responseText);
    }

    getResponseText() {
      return this.responseText;
    }

    clearResponseText() {
      this.responseText = "";
    }

    clearConversationHistory() {
      this.conversationHistory = [];
      if (this.prompt) {
        this.conversationHistory = [
          { role: "system", content: this.prompt }
        ];
      }
    }
}
module.exports = Scratch3ChatGPT;
