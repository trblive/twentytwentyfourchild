import "@wordpress/components/build-style/style.css";
import "@wordpress/block-editor/build-style/style.css";

const { ColorPalette, PanelBody, PanelRow, TextControl } = wp.components;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { __ } = wp.i18n;

// create stylesheets
let styleSheet = document.createElement("style");

const loadStylesOnIframeHead = (staticCss) => {
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
wp.hooks.addFilter(
    'blocks.registerBlockType',
    'childTheme-box-shadow',
    addBoxShadow
);


// add box shadow controls to block editor tools
const boxShadowControls = wp.compose.compose(

    wp.blockEditor.withColors({shadowColor: 'color'}),

    wp.compose.createHigherOrderComponent((BlockEdit) => {

        return (props) => {

            loadStylesOnIframeHead({id: "child-editor-styles"});

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
                newClassName =  blockName + "-" + uniqueClass;
            }

            let classArray = newClassName.split(' ');

            let selectors = '';

            classArray.forEach((myClass) => {
                if (myClass !== undefined) {
                    selectors += '.' + myClass;
                }
            })


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

            return (
                <Fragment>
                    <BlockEdit {...newProps} />
                    {isSelected && (props.name === 'core/button') &&
                        <InspectorControls>

                            <PanelBody title={__('Box shadow')}>
                                <ColorPalette
                                    colors = {wp.data.select( 'core/block-editor' ).getSettings().colors}
                                    value = {shadowColor.color}
                                    onChange ={setShadowColor}
                                    enableAlpha ={false}
                                    disableCustomColors
                                />
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
                                </PanelRow>
                                <PanelRow>
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


// generate save CSS
function applyBoxShadow(props, blockType, attributes) {

    if (blockType.name === "core/button") {

        let { shadowColor } = attributes;

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
wp.hooks.addFilter(
    "blocks.getSaveContent.extraProps",
    "block-apply-shadow-class",
    applyBoxShadow
);

