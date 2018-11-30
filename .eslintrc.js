module.exports = {
    extends: ["react-app", "airbnb", "eslint-config-with-prettier"],
    env: {
        browser: false,
        jest: false,
        es6: true,
        node: true,
    },
    rules: {
        "indent": "off",
        "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
        "no-tabs": "off",
        "comma-dangle": "off",
        "function-paren-newline": "off",
        "eol-last": "off",
        "no-use-before-define": "off",
        "no-underscore-dangle": "off",
        "global-require": "off",
        "prefer-template": "off",
        "max-len": "off",
        "arrow-parens": "off",
        "no-confusing-arrow": "off",
        "arrow-body-style": "off",
        "class-methods-use-this": "off",
        "no-shadow": ["error", {"allow": ["push", "goBack", "fields"]}],
        "import/newline-after-import": "off",
        "import/no-named-as-default": "off",
        "import/extensions": "off",
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
        "jsx-a11y/label-has-for": [ 2, {
            "required": {
                "some": [ "nesting", "id" ]
            }
        }],
        "jsx-a11y/href-no-hash": "off",
        "jsx-a11y/anchor-is-valid": "off",

        "react/sort-comp": "off",
        "react/style-prop-object": "off",
        "react/jsx-filename-extension": "off",
        "react/prefer-stateless-function": "off",
        "react/forbid-prop-types": "off",
        "react/prop-types": "off",
        "react/no-typos": "off",
        "react/require-default-props": "off",
        "react/no-did-mount-set-state": "off",
        "react/no-did-update-set-state": "off",
    }
};