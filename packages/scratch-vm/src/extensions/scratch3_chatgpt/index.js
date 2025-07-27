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

const functions = [
  {
    name: "processActionSequence",
    description: "一連のアクションを順番に処理します",
    parameters: {
      type: "object",
      properties: {
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: {
                type: "string",
                enum: ["持つ", "行く", "食べる"],
                description: "実行する動作",
              },
              target: {
                type: "string",
                enum: ["りんご", "スタート地点", "みかん", "バナナ"],
                description: "動作対象の物体",
              },
            },
            required: ["action", "target"],
          },
        },
      },
      required: ["actions"],
    },
  },
];

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
                  opcode: 'now',
                  text: 'now',
                  blockType: BlockType.REPORTER,
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

    getApiKey() {
        return this.apiKey;
    }

    async requestChatGPT(args) {
        this.inputText = Cast.toString(args.TEXT);
        const response = await this.openAI.responses.create({
            model: "gpt-4.1",
            input: this.inputText,
        });
        this.responseText = response.output_text;
    }

    async requestChatGPTWithTool(args) {
        this.inputText = Cast.toString(args.TEXT);

        // 最終結果
        var return_value = "";

        // ユーザーの指示を分解
        {
          const response = await this.openAI.chat.completions.create({
            model: "gpt-4-0613", // GPT-4のfunction calling対応版
            messages: [
              {
                role: "system",
                content:
                  `あなたは日本語の指示を猫オブジェクトへ適用するため、指示を「action（動作）」と「target（対象）」のリストに分解します。\n` +
                  `**[必須]**猫オブジェクトが対象に動作するには、**必ず**"行く"アクションで各対象まで移動してからにしてください。\n` +
                  `猫オブジェクトは最初、スタート地点にいます。\n` +
                  `使用可能な動作: ["持つ", "行く", "食べる"]\n` +
                  `使用可能な対象: ["りんご", "スタート地点", "みかん", "バナナ"]\n` +
                  `指示を理解して、processActionSequence関数に適した形式で返してください。`,
              },
              {
                role: "user",
                content: this.inputText
              },
            ],
            tools: functions.map((fn) => ({ type: "function", function: fn })),
            tool_choice: { type: "function", function: { name: "processActionSequence" } },
          });

          // 結果の抽出
          const toolCall = response.choices[0]?.message?.tool_calls?.[0];
          if (toolCall) {
            const args = JSON.parse(toolCall.function.arguments);
            //console.log("💡 分解されたアクション一覧:");
            for (const step of args.actions) {
              return_value += `${step.action},${step.target},`;
            }
            if (return_value.endsWith(',')) {
              return_value = return_value.slice(0, -1); // 最後のカンマを削除
            }
          } else {
            return_value = "Function calling failed";
            console.error("❌ Function calling に失敗しました。");
          }
        }

        // ユーザーの指示の実行前後のメッセージ作成
        {
          const response = await this.openAI.responses.create({
            model: 'gpt-4o',
            instructions:
            'あなたはscratchに組み込まれている猫のキャラクターです。入力される指示を実行する前と実行した後のメッセージを作成してください。\n' +
            '# 例\n' +
            '## 指示\nりんごを食べてからみかんを持って戻ってきて\n' +
            '## 実行前メッセージ\nりんごを食べてからみかんを持って戻るよ！\n' +
            '## 実行後メッセージ\nりんごを食べてからみかんを持って戻ったよ！\n' +
            '# フォーマット\n' +
            '{実行前メッセージ},{実行後メッセージ}\n',
            input: this.inputText,
          });
          return_value = response.output_text + ',' + return_value;
        }

        this.responseText = return_value;
    }

    getResponseText() {
      return this.responseText;
    }

    clearResponseText() {
      this.responseText = "";
    }

    now () {
      return Date.now();
    }
}
module.exports = Scratch3ChatGPT;
