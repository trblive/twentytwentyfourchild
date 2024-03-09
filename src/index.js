import "@wordpress/components/build-style/style.css";
import "@wordpress/block-editor/build-style/style.css";

const { PanelBody, PanelRow, TextControl } = wp.components;
const { InspectorControls, PanelColorSettings } = wp.blockEditor;
const { Fragment } = wp.element;
const { __ } = wp.i18n;


const loadStaticCssOnHead = (staticCss) => {
    if (staticCss.id && staticCss.href) {
        let styleSelector = window.document;
        let iframes = document.getElementsByName('editor-canvas');
        if (iframes.length) {
            styleSelector = iframes[0].contentDocument;
        }
        if (styleSelector.getElementById(staticCss.id) === null) {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.id = staticCss.id;
            if (styleSelector.getElementsByTagName('head').length !== 0) {
                styleSelector.getElementsByTagName('head')[0].appendChild(link);
                link.href = staticCss.href;
            } else {
                styleSelector.getElementsByTagName('body')[0].appendChild(link);
                link.href = staticCss.href;
            }
        } else {
            styleSelector.getElementById(staticCss.id).href = staticCss.href;
        }
    }
};

function EditorReady($, iframes) {
    let wpdocument = $(document);

    if (typeof iframes !== "undefined" && iframes.length) {
        wpdocument = $('iframe[name="editor-canvas"]').contents();
    }

    wpdocument.on(
        "change",
        ".block-editor-panel-color-gradient-settings__dropdown, .components-text-control__input",
        function () {
            console.log(this);
        }
    )
}


function addBoxShadow(settings, name) {
    if (typeof settings.attributes !== "undefined") {
        if (name !== "core/button") {
            return settings;
        }
        settings.attributes = Object.assign(settings.attributes, {
            shadowColor: {
                type: "string"
            },
            customShadowColor: {
                type: "string"
            },
            xValue: {
                type: "number",
                default: 0
            },
            yValue: {
                type: "number",
                default: 0
            },
            blur: {
                type: "number",
                default: 0
            },
            spread: {
                type: "number",
                default: 0
            }
        });
    }
    return settings;
}
wp.hooks.addFilter(
    'blocks.registerBlockType',
    'childTheme-box-shadow',
    addBoxShadow
);

// create stylesheet
let styleSheet = document.createElement("style");
styleSheet.setAttribute('id', 'custom-styles');
document.head.appendChild(styleSheet);

// add box shadow controls to block editor tools
const boxShadowControls = wp.compose.compose(

    wp.blockEditor.withColors({shadowColor: 'box-shadow'}),

    wp.compose.createHigherOrderComponent((BlockEdit) => {

        return (props) => {
            if (props.name !== "core/button") {
                return(
                    <BlockEdit {...props} />
                );
            }
            const { attributes, setAttributes, isSelected, shadowColor, setShadowColor } = props;
            const { xValue, yValue, blur, spread } = attributes;

            let newClassName = attributes.className !== undefined ? attributes.className : '';
            let newStyles = {
                ...props.style
            };
            let blockName;

            const newProps = {
                ...props,
                attributes: {
                    ...attributes,
                    className: newClassName
                },
                style: newStyles
            };

            if (props.isSelected === true) {
                blockName = props.name.split('core/')[1];

                if (shadowColor.color !== undefined) {

                    // create unique identifier if none exists
                    if (!/([0-9]+([A-Za-z]+[0-9]+)+)[A-Za-z]+/.test(newProps.attributes.className)) {
                        let uniqueClass = (Math.random() + 1).toString(25).substring(2);
                        newClassName += blockName + "-" + uniqueClass;
                    }

                    // create regex pattern for selected identifier
                    // separate variables for readability
                    let expression = '\.' + `${newClassName}` + ' > \\* \{ box-shadow: ([A-Za-z0-9]+( [A-Za-z0-9]+)+) #[A-Za-z0-9]+; \}';
                    let regex = new RegExp(expression, "g");

                    // store styles
                    let styles = `box-shadow: ${xValue}px ${yValue}px ${blur}px ${spread}px ${shadowColor.color}`;

                    // check if pattern already exists for selected identifier
                    if (regex.test(styleSheet.innerHTML) === true) {

                        console.log(styleSheet.innerHTML.match(regex));

                        // replace with updated styles
                        styleSheet.innerHTML = styleSheet.innerHTML.replace(regex, `.${newClassName} > * { ${styles}; }`);

                    } else {
                        // append styles to stylesheet
                        styleSheet.innerHTML += ` .${newClassName} > * { ${styles}; }`;
                    }
                }
            }

            return (
                <Fragment>
                    <BlockEdit {...newProps} />
                    {isSelected && (props.name === 'core/button') &&
                        <InspectorControls>
                            <PanelColorSettings
                                title = {__('Box shadow colour')}
                                initialOpen = {true}
                                enableAlpha = {true}
                                colorSettings = {[
                                    {
                                        label: __('Shadow'),
                                        value: shadowColor.color,
                                        onChange: setShadowColor
                                    }
                                ]}
                            />
                            <PanelBody>
                                <PanelRow>
                                    <TextControl
                                        label = {__('X')}
                                        value = {xValue}
                                        onChange = { (nextXValue) => {
                                            setAttributes({
                                                xValue: nextXValue,
                                            })
                                        }}
                                    />
                                    <TextControl
                                        label = {__('Y')}
                                        value = {yValue}
                                        onChange = { (nextYValue) => {
                                            setAttributes({
                                                yValue: nextYValue,
                                            })
                                    }}
                                    />
                                    <TextControl
                                        label = {__('blur')}
                                        value = {blur}
                                        onChange = { (nextBlur) => {
                                            setAttributes({
                                                blur: nextBlur,
                                            })
                                    }}
                                    />
                                    <TextControl
                                        label = {__('spread')}
                                        value = {spread}
                                        onChange = { (nextSpread) => {
                                            setAttributes({
                                                spread: nextSpread,
                                            })
                                    }}
                                    />
                                </PanelRow>
                            </PanelBody>
                        </InspectorControls>
                    }
                </Fragment>
            );
        };
}, 'boxShadowControls'));

wp.hooks.addFilter(
    'editor.BlockEdit',
    'childTheme-box-shadow-controls',
    boxShadowControls
);

// generate classes
function applyBoxShadow(props, blockType, attributes) {
    if (blockType.name === "core/button") {
        const {
            shadowColor,
            customShadowColor
        } = attributes;
        let blockName = blockType.name.split('core/')[1];
        let className = props.className !== undefined ? props.className : "";
        if (shadowColor !== undefined || customShadowColor !== undefined) {
            className += " has-box-shadow ";
            if (!/([0-9]+([A-Za-z]+[0-9]+)+)[A-Za-z]+/.test(props.className)) {
                let uniqueClass = (Math.random() + 1).toString(25).substring(2);
                className += " " + blockName + "-" + uniqueClass;
            }
        }
        props.className = className;
    }
    return props;
}
wp.hooks.addFilter(
    "blocks.getSaveContent.extraProps",
    "block-apply-shadow-class",
    applyBoxShadow
);

(function ($) {
    function preEditor() {
        if (window.location.href.indexOf('site-editor.php') > -1) {
            let blockLoaded = false;
            let blockLoadedInterval = setInterval(function () {
                let iframes = $('iframe[name="editor-canvas"]');
                if (iframes.length) {
                    /*post-title-0 is ID of Post Title Textarea*/
                    //Actual functions goes here
                    EditorReady($, iframes);

                    blockLoaded = true;
                }
                if (blockLoaded) {
                    clearInterval(blockLoadedInterval);
                }
            }, 500);
        } else {
            EditorReady($);
        }
    }

    preEditor();
})(jQuery);