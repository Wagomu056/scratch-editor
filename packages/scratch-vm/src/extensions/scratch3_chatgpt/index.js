const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
//const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkNJREFUeNrsmoFxgzAMAE0vA9AJmg1KJ4izQTcIGzSdoGyQ6wRcJ2g3oJ2AdALSCWADau5MjxJDJBs7xJHudMkRRVgPtmRBwNzLUuiT0KhzbC/0VeiBeS6J0HpEE5+D350IvtWdj8FzYPCtct8AvCMBpL4BKJEASlcDCxydp57r2G7YlYsrAJ+W7WcP4M2y/UVIDlwAc1+nWwiAkEs75jOEptwteoEXvpfBQ5siLj9JSEjOIwFgnvabF5ckRo2WSGMTM0ctdS9g4UHw3TSLvvq1Zxph9gI+VmMhbYcJAAEgALYB7KXa7CztXYDhyBwbK1bZeKJaovXfX9Gx/rkNAKcaGM1vqUHwKcB/fi4ABaJeyDWCh7bGQuCdMDmA2NKU0hlwrOuv2Q1mvWPPkmo2csJK6C1yXckRm5JmoXtA+i9P3JFrOe5/D18XCjIhcIA6GQIDQMc/B0wXfq46oELY/sy9Dlhq9hegsnI0JiMAmIBC5KLGkTvSyDWARl4s2bry/yeqdAFNW9uJUpRJqt0i0qoqLiMAY9Va+xTItBRORvxjqkxlXAE7fnlhLT8z5J30IfRbfr8T+jhhZ6mS/tvscC/9Y0QZ15QA5i7KuKgfcO0AFuz4dZSK+fuMvmLA1290dm9zV05TYGAKmPbovhTHN53SFGJzYOoXo1adKwexcd4TTAb+nyFthlJugrShKUBpkAAQAAJAAAiAu0Jow9QNzAhpEw3k+SXSxnkhRHsBWgMIAAEgAATAwzoA3Du7IFE+nf4VYACOBZBMGfW8oAAAAABJRU5ErkJggg=='

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
//const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABWhJREFUeNrsW+1x4zgMZXb2v9KB04GyFSgd6K4CbQfaq0DbgdKBLhUoHchbgXwVyKlATgU5awacwAhIQh92bAdvBpPYsinqEQQeQdoYhUKhUCgUCoVCoVAoFAqF4mJwcyb9WO3tznFts7dXJfAQ6d4ewO6F39mCbcDWe3v5agQWe/vJeNsa/u6AnDvymQePdz7u7enaQ0Wyt25vb2DD//ne4hFt1PDdCqxH7bUj27ooZORBk4nt2DYi0rYdmP7ayasnfD+GNirkuRkMAva4EuyqYuCQKJ7R6x3Esluwe0dM28H/vz2xj37HJpfhfv9dg+dFKEYNsa5BnnhsS66BwBwepkHT7xTWkhh5dHw7cvvPIFuOjQ3c58epRfexdWAMGu92ZjtWH1LduB65UkmB6EE7/rmU6bxidJskjpXodbZQPySxMjlVGIhJzEuFHlCApGmJsM6InivRtaXEPCawZ4jKyfUa+rUYoSnxphjeszddjWyvJCTaRFCg94sjEWiTHHWKhqya3tAKaDXlxhE8RMfcPEJLrKliOQ1M7/qIBPrCQwTXauKV2VjiemYNi0eCEruaOEh4ytak3WqBaeQiUBIiqI4tJDfriLclgTXqGxLOcx6wIUIcP6jVlXPX09RigabtSYxMJetXG5PGdKqZmSU7ofhuJ2Rn14oo9/SpJ4RlniR0QF7JfFk6qlPRBWJhzMTjHt6TTPHM0bZrSraOONxwxMdMYPWy7SFwarxKR3hIRqSQlEjOC0uPQuiYNlNutrUoYHM3rAOjtIQHUsHbC+JdQkjpAjEtcgxS6fDUOOA4BwGcYxvHAS7mVCNjZkic92ZalTkhg5mPnDVWQcTCFVCPCawCwdQ3IrVgOoQkTEYGop4RBiriwZwA7jyhonfMRK8HdgINV6JOxZ7ONMJpmjPkTxkAOhitg5wGeVQoy1fCMNOzbApGF5MorclZT/MVV7OFyLN9WBE1YfveBeSRtN5ZjyUQJ42exAvXCKbMiPfMEimeGTtpRi5Jm6HBkxZkIzQAGSUlFo50JegIt36ugdA5ySKUeBpmsBogtEDXO2a1Iylc1FyoKoVz31VJCVmPHqAgDxwtRB724hju13r6VDK6s/I4TYrI72m+WAnTv1TZS6wy8+C7d0PMtfrACwXOYxtmEJzhpmDSfyaorvSBhyigLVxnm1uiyslAWBnUCgauQwTWKJYlghj5oSp0w2TZn45Or5n3HiYSMOxJ/DND59k+Dn+fyFQb9pu35uP5m+G9FyBqeJaNed+bHvZsXkkbD2A7+PyzYQ4z3ThG97eRbwRxnX02h5tAFnfw0MO1HxNkyhoebgftDH38y7xv2HN92yLC1tCHzUKD6RWKFeP6CbIVEz8lRVWJZIrhHjmTeDpHhh+zd7xUEhtVzm+FFY5QcqhRFozQOrY0pzvBUJgzQ4yqxaERTUmyejuxzRXtZ4Huk4jD9cLIXOg5muSEhDVIMEcO2XZxJEaOKswYa2buv2ACZ8XDb59A4KC3/kaS5l+H5OGwIZp0zpmbW4++FeP7J3riC4jgJ5KM7OHLW6TlHglZW/h7P+P+dhGwM18Aufl4MGjO9gHewvgyoFpzTgxszlUPjtGNY08wrAx/WmHsURJcVY8u3ZvGFFMjj/CuTPh4XUyy/0WfpY7Nx8NDIU/KHEVaTuJUaA3NHVfLzBUgIjVIS2Ts+KwlITeHJ8QieC2pBfbmSk7xhyo/dk8lM4e/RpIkDd926eIx7+bMiPwF9b07x2cezXuB0yC9aLXjPdGLOxDqj+YMftl56vVyKZyWXMleklSuzgNDhN56Vh5b8/5zr1ejUCgUCoVCoVAoFAqFQqFQKDj8L8AArqESEfsu3jMAAAAASUVORK5CYII=';
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAkNJREFUeNrsmoFxgzAMAE0vA9AJmg1KJ4izQTcIGzSdoGyQ6wRcJ2g3oJ2AdALSCWADau5MjxJDJBs7xJHudMkRRVgPtmRBwNzLUuiT0KhzbC/0VeiBeS6J0HpEE5+D350IvtWdj8FzYPCtct8AvCMBpL4BKJEASlcDCxydp57r2G7YlYsrAJ+W7WcP4M2y/UVIDlwAc1+nWwiAkEs75jOEptwteoEXvpfBQ5siLj9JSEjOIwFgnvabF5ckRo2WSGMTM0ctdS9g4UHw3TSLvvq1Zxph9gI+VmMhbYcJAAEgALYB7KXa7CztXYDhyBwbK1bZeKJaovXfX9Gx/rkNAKcaGM1vqUHwKcB/fi4ABaJeyDWCh7bGQuCdMDmA2NKU0hlwrOuv2Q1mvWPPkmo2csJK6C1yXckRm5JmoXtA+i9P3JFrOe5/D18XCjIhcIA6GQIDQMc/B0wXfq46oELY/sy9Dlhq9hegsnI0JiMAmIBC5KLGkTvSyDWARl4s2bry/yeqdAFNW9uJUpRJqt0i0qoqLiMAY9Va+xTItBRORvxjqkxlXAE7fnlhLT8z5J30IfRbfr8T+jhhZ6mS/tvscC/9Y0QZ15QA5i7KuKgfcO0AFuz4dZSK+fuMvmLA1290dm9zV05TYGAKmPbovhTHN53SFGJzYOoXo1adKwexcd4TTAb+nyFthlJugrShKUBpkAAQAAJAAAiAu0Jow9QNzAhpEw3k+SXSxnkhRHsBWgMIAAEgAATAwzoA3Du7IFE+nf4VYACOBZBMGfW8oAAAAABJRU5ErkJggg=='

/**
 * Class for the ChatGPT
 * @constructor
 */
class Scratch3ChatGPT {
    constructor (runtime) {
        this.runtime = runtime;
        this.apiKey = "";
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
                    text: 'APIキーをせってい [TEXT]',
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
                    text: 'APIキーをとりだす',
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
    }

    getApiKey() {
        return this.apiKey;
    }

    now () {
      return Date.now();
    }
}
module.exports = Scratch3ChatGPT;
