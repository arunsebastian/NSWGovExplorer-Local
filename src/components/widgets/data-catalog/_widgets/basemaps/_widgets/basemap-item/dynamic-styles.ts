export default {
    basemapCard: `
        .content-wrapper{
            border:none !important;
        }
        :host([selected]) .content-wrapper {
            box-shadow: inset 5px 0px 0 0 var(--calcite-card-accent-color-selected) !important;
        }
        :host([disabled]) {
            cursor:default !important;
        }
    `
};
