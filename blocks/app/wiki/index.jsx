import block_icons from "../icons/index.jsx";

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { TextControl, HorizontalRule } = wp.components;

/**
 * Register Piratenwiki Gutenberg Block
 *
 * @author Mike Kühnapfel <mike.kuehnapfel@piraten-rek.de>
 * @since 1.0.0
 * @version 1.0.0
 */
registerBlockType('piwi/wiki', {
    title: __('Piratenwiki-Seite', 'piwi'),
    description: __('Bindet den Text einer Seite aus dem Piraten-Wiki ein', 'piwi'),
    category: 'widgets',
    icon: block_icons.wiki,
    keywords: [
        __('Piraten', 'piwi'),
        __('Wiki', 'piwi'),
        'nostrasponte'
    ],
    supports: {
        html: true,
        multiple: false
    },
    attributes: {
        pageName: {
            type: 'string',
            source: 'attribute',
            selector: 'div',
            attribute: 'data-page'
        }
    },
    edit: props => {
        return [
            <InspectorControls>
                <HorizontalRule/>
                <TextControl
                    label={__('Name der Seite', 'piwi')}
                    help={__('Bsp: NRW:Rhein-Erft-Kreis/Kreisverband/Satzung')}
                    value={ props.attributes.pageName }
                    onChange={ new_val => props.setAttributes({ pageName: new_val}) }
                />
            </InspectorControls>,
            <div className={ props.className } data-page={props.attributes.pageName}>
                <p>{ __('Die angeforderte Seite wird geladen…', 'piwi') }</p>
                <p><a href={ `https://wiki.piratenpartei.de/${props.attributes.pageName}` } target="_blank" className="btn" rel="noopener noreferrer">Die Seite im Piratenwiki ansehen</a></p>
            </div>
        ];
    },
    save: props => {
        return <div className={props.className} data-page={props.attributes.pageName}>
            <div className="loader"/>
            <p>{ __('Die angeforderte Seite wird geladen…', 'piwi') }</p>
            <p><a href={ `https://wiki.piratenpartei.de/${props.attributes.pageName}` } target="_blank" className="btn" rel="noopener noreferrer">Die Seite im Piratenwiki ansehen</a></p>
        </div>;
    }
});