import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import srcDoc from "srcdoc-polyfill";
// import hashToRandomSeed from "../hashToRandomSeed";
import loopProtect from "loop-protect";
import { JSHINT } from "jshint";
import decomment from "decomment";

export default class P5Sandbox extends React.Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    blockNum: PropTypes.number.isRequired,
  };

  getHTML = () => {
    // console.log("this.props.hash: ", this.props.hash);
    // const seed = hashToRandomSeed(this.props.hash.substring(2)).toString();
    // console.log("seed: ", seed);
    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>artonomous</title>
        <style> body {padding: 0; margin: 0;} </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.dom.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/addons/p5.sound.js"></script>
        <script>
            ${this.props.code.replace("$BLOCK_NUM", this.props.blockNum)}
        </script>
      </head>
      <body>
      </body>
    </html>`;
  };

  componentDidMount() {
    if (this.props.code) {
      this.renderSketch();
    }
  }

  componentDidUpdate(prevProps) {
    // if sketch starts or stops playing, want to rerender
    if (this.props.isPlaying !== prevProps.isPlaying) {
      this.renderSketch();
      return;
    }

    // if the user explicitly clicks on the play button
    if (this.props.isPlaying && this.props.previewIsRefreshing) {
      this.renderSketch();
      return;
    }

    if (this.props.code != prevProps.code) {
      this.renderSketch();
    }

    if (this.props.hash != prevProps.hash) {
      this.renderSketch();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("message", this.handleConsoleEvent);
    ReactDOM.unmountComponentAtNode(this.iframeElement.contentDocument.body);
  }

  addLoopProtect(sketchDoc) {
    const scriptsInHTML = sketchDoc.getElementsByTagName("script");
    const scriptsInHTMLArray = Array.prototype.slice.call(scriptsInHTML);
    scriptsInHTMLArray.forEach(script => {
      script.innerHTML = this.jsPreprocess(script.innerHTML); // eslint-disable-line
    });
  }

  jsPreprocess(jsText) {
    let newContent = jsText;
    // check the code for js errors before sending it to strip comments
    // or loops.
    JSHINT(newContent);

    if (JSHINT.errors.length === 0) {
      newContent = decomment(newContent, {
        ignore: /\/\/\s*noprotect/g,
        space: true,
      });
      newContent = loopProtect(newContent);
    }
    return newContent;
  }

  renderSketch() {
    const doc = this.iframeElement;
    if (this.props.isPlaying) {
      srcDoc.set(doc, this.getHTML());
      if (this.props.endSketchRefresh) {
        this.props.endSketchRefresh();
      }
    } else {
      doc.srcdoc = "";
      srcDoc.set(doc, "  ");
    }
  }

  render() {
    return (
      <iframe
        className="preview-frame"
        width={this.props.width}
        height={this.props.height}
        aria-label="sketch output"
        role="main"
        frameBorder="0"
        title="sketch output"
        ref={element => {
          this.iframeElement = element;
        }}
        sandbox="allow-scripts allow-pointer-lock allow-same-origin allow-popups allow-forms allow-modals"
      />
    );
  }
}