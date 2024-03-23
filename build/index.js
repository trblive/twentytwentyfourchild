/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor/build-style/style.css":
/*!**********************************************************!*\
  !*** external ["wp","blockEditor/buildStyle/style.css"] ***!
  \**********************************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor/buildStyle/style.css"];

/***/ }),

/***/ "@wordpress/components/build-style/style.css":
/*!*********************************************************!*\
  !*** external ["wp","components/buildStyle/style.css"] ***!
  \*********************************************************/
/***/ ((module) => {

module.exports = window["wp"]["components/buildStyle/style.css"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _wordpress_components_build_style_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components/build-style/style.css */ "@wordpress/components/build-style/style.css");
/* harmony import */ var _wordpress_block_editor_build_style_style_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor/build-style/style.css */ "@wordpress/block-editor/build-style/style.css");



const {
  ColorPalette,
  PanelBody,
  PanelRow,
  TextControl
} = wp.components;
const {
  InspectorControls
} = wp.blockEditor;
const {
  Fragment
} = wp.element;
const {
  __
} = wp.i18n;

// create stylesheets
let styleSheet = document.createElement("style");
const loadStylesOnIframeHead = staticCss => {
  let styleSelector = window.document;
  let iframes = document.getElementsByName('editor-canvas');
  if (iframes.length) {
    styleSelector = iframes[0].contentDocument;
  }
  if (staticCss.id) {
    if (styleSelector.getElementById(staticCss.id) === null) {
      styleSheet.id = staticCss.id;
      if (styleSelector.getElementsByTagName('head').length !== 0) {
        styleSelector.getElementsByTagName('head')[0].appendChild(styleSheet);
      } else {
        styleSelector.getElementsByTagName('body')[0].appendChild(styleSheet);
      }
    }
  }
};
function addBoxShadow(settings, name) {
  if (typeof settings.attributes !== "undefined") {
    if (name !== "core/button") {
      return settings;
    }
    settings.attributes = Object.assign(settings.attributes, {
      shadowColor: {
        type: "string"
      },
      xValue: {
        type: "string",
        default: 0
      },
      yValue: {
        type: "string",
        default: 0
      },
      blur: {
        type: "string",
        default: 0
      },
      spread: {
        type: "string",
        default: 0
      }
    });
  }
  return settings;
}
wp.hooks.addFilter('blocks.registerBlockType', 'childTheme-box-shadow', addBoxShadow);

// add box shadow controls to block editor tools
const boxShadowControls = wp.compose.compose(wp.blockEditor.withColors({
  shadowColor: 'color'
}), wp.compose.createHigherOrderComponent(BlockEdit => {
  return props => {
    loadStylesOnIframeHead({
      id: "child-editor-styles"
    });
    if (props.name !== "core/button") {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockEdit, {
        ...props
      });
    }
    const {
      attributes,
      setAttributes,
      isSelected,
      shadowColor,
      setShadowColor
    } = props;
    const {
      xValue,
      yValue,
      blur,
      spread
    } = attributes;
    let newClassName = attributes.className !== undefined ? attributes.className : '';
    let newStyles = {
      ...props.style
    };

    // create unique identifier if none exists
    let blockName = props.name.split('core/')[1];
    let uniqueClass;
    const newProps = {
      ...props,
      attributes: {
        ...attributes,
        className: newClassName
      },
      style: newStyles
    };
    if (!/([0-9]+([A-Za-z]+[0-9]+)+)[A-Za-z]+/.test(newProps.attributes.className)) {
      uniqueClass = (Math.random() + 1).toString(25).substring(2);
      newClassName = blockName + "-" + uniqueClass;
    }
    let classArray = newClassName.split(' ');
    let selectors = '';
    classArray.forEach(myClass => {
      if (myClass !== undefined) {
        selectors += '.' + myClass;
      }
    });
    if (shadowColor.color !== undefined) {
      // create regex pattern for selected identifier
      // separate variables for readability
      let expression = `${selectors}` + ' > \\* \{ box-shadow: ([A-Za-z0-9]+( [A-Za-z0-9]+)+) #[A-Za-z0-9]+; \}';
      let regex = new RegExp(expression, "g");

      // store styles
      let styles = `box-shadow: ${xValue}px ${yValue}px ${blur}px ${spread}px ${shadowColor.color}`;

      // check if pattern already exists for selected identifier
      if (regex.test(styleSheet.innerHTML) === true) {
        // replace with updated styles
        styleSheet.innerHTML = styleSheet.innerHTML.replace(regex, `${selectors} > * { ${styles}; }`);
      } else {
        // append styles to stylesheet
        styleSheet.innerHTML += ` ${selectors} > * { ${styles}; }`;
      }
    } else {
      // clear styles
      if (/([0-9]+([A-Za-z]+[0-9]+)+)[A-Za-z]+/.test(newProps.attributes.className)) {
        let expression = `${selectors}` + ' > \\* \{ box-shadow: ([A-Za-z0-9]+( [A-Za-z0-9]+)+) #[A-Za-z0-9]+; \}';
        let regex = new RegExp(expression, "g");
        let styles = ' ';
        if (regex.test(styleSheet.innerHTML) === true) {
          styleSheet.innerHTML = styleSheet.innerHTML.replace(regex, styles);
        }
      }
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockEdit, {
      ...newProps
    }), isSelected && props.name === 'core/button' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelBody, {
      title: __('Box shadow'),
      className: __('shadow-controls')
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ColorPalette, {
      colors: wp.data.select('core/block-editor').getSettings().colors,
      value: shadowColor.color,
      onChange: setShadowColor,
      enableAlpha: false,
      disableCustomColors: true
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TextControl, {
      label: __('X'),
      value: xValue,
      onChange: nextXValue => {
        setAttributes({
          xValue: nextXValue
        });
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TextControl, {
      label: __('Y'),
      value: yValue,
      onChange: nextYValue => {
        setAttributes({
          yValue: nextYValue
        });
      }
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelRow, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TextControl, {
      label: __('blur'),
      value: blur,
      onChange: nextBlur => {
        setAttributes({
          blur: nextBlur
        });
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TextControl, {
      label: __('spread'),
      value: spread,
      onChange: nextSpread => {
        setAttributes({
          spread: nextSpread
        });
      }
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelRow, {
      className: __('shadow-help')
    }, "Heads up! These settings will only work on a static post/page. If your homepage is set to \"latest posts\", sadly these styles cannot be displayed :("))));
  };
}, 'boxShadowControls'));
wp.hooks.addFilter('editor.BlockEdit', 'childTheme-box-shadow-controls', boxShadowControls);

// generate save CSS
function applyBoxShadow(props, blockType, attributes) {
  if (blockType.name === "core/button") {
    let {
      shadowColor
    } = attributes;
    let blockName = blockType.name.split('core/')[1];
    let className = props.className !== undefined ? props.className : "";
    if (shadowColor !== undefined) {
      if (!/([0-9]+([A-Za-z]+[0-9]+)+)[A-Za-z]+/.test(props.className)) {
        let uniqueClass = (Math.random() + 1).toString(25).substring(2);
        className += " " + blockName + "-" + uniqueClass;
      }
    }
    props.className = className;
  }
  return props;
}
wp.hooks.addFilter("blocks.getSaveContent.extraProps", "block-apply-shadow-class", applyBoxShadow);
})();

/******/ })()
;
//# sourceMappingURL=index.js.map