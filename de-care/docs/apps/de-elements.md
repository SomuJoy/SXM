# SXM Angular Elements

This app is used to bundle a set of elements to be used stand alone.

## Elements available

-   RFLZ identification
-   FLEPZ identification

## Usage

### All

The javascript file for the elements bundle needs to be included on the page where the Angular Element will be used. This is only needed once, and from there you can use any of
the element tags (and any number of instances of them) on the page.

```html
<script src="de-care-elements-es2015.js" type="module"></script>
<script src="de-care-elements-es5.js" nomodule defer>
```

There are 2 bundle files that can be included, one for modern "evergreen" browsers and one for older browsers.
The above markup will handle differential loading. Each script tag has a
type="module" or nomodule attribute. Browsers with native support for ES modules only load the
scripts with the module type attribute and ignore scripts with the nomodule attribute.
Legacy browsers only load the scripts with the nomodule attribute, and ignore the script
tags with the module type that load ES modules.

_(Note that `de-care-elements-*.js` will be the name of the elements bundle artifacts produced from the build and deploy scripts. The prefix of these
files can be configured in those scripts so the name may vary.)_

### RFLZ

**HTML**

```html
<sxm-rflz-widget></sxm-rflz-widget>
```

### FLEPZ

**HTML**

```html
<sxm-flepz-widget></sxm-flepz-widget>
```

## Overriding App Settings at Runtime

The main app settings (values like the api url, etc) can be changed at runtime by adding specific key/values to local storage.

-   Create a local storage key named `siriusxmws_useOverrideSettings` and set that to `true` or `false` to toggle using override settings.
    <br />_(the override settings will only be used if this key is present and set to `true`.)_
-   Create a local storage key named `siriusxmws_settings` and set that to a _json_ object with properties matching the settings key(s) you want to override.
    <br /> (example of just overriding the `apiUrl` setting: `{ "apiUrl": "https://some-other-url" }`)

## Overriding Elements Settings at Runtime

The elements specific settings (values like the redirect urls, etc) can be changed at runtime by adding specific key/values to local storage.

-   Create a local storage key named `siriusxmws_useOverrideElementsSettings` and set that to `true` or `false` to toggle using override settings.
    <br />_(the override elements settings will only be used if this key is present and set to `true`.)_
-   Create a local storage key named `siriusxmws_elementsSettings` and set that to a _json_ object with properties matching the settings key(s) you want to override.
    <br /> (example of just overriding the `rflzSuccessUrl` setting: `{ "rflzSuccessUrl": "/some-other-path/activate/trial" }`)

## FLEPZ Widget Usage Parameters

| Element Attribute (Input) | Example Value                                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| extra-params              | programCode=6FOR60AA&anyOtherParam=paramValue                              | Extra params allows additional parameter configuration which will override any existing url query parameters. If there are multiple parameters, this should be written with an “&” between each key value pair. <br><br> Valid parameters*:<br><br><ul><li>langPref</li><li>programCode</li><li>promoCode</li>radioId<li>tbView</li></ul>*additional parameters may be added by request                                                                                                                                                                                                                                                                                         |
| tabs-to-show              | car-info,account-info,your-info                                            | Tabs to show allows configuration of visible tabs within the flepz-widget. If used, only explicitly stated tabs will be displayed, in the order they are written. If this attribute is not used, the default tabs will be Your Info and Car Info. <br><br>Valid tabs: <ul><li>Account Info<ul><li>Displays Radio ID and Account Number fields in US</li><li>Displays Radio ID and Last Name in CA</li></ul><li>Car Info<ul><li>Displays Radio ID, Vin, and License Plate radio options in US</li><li>Displays Radio ID and VIN radio options in CA</li></ul><li>Your Info<ul><li>Displays the FLEPZ form</li><li>CA includes field for marketing promo code</li></ul></li></ul> |
| translation-overrides     | { 'CAR_INFO': {'en-US': 'Ride Info'}, 'YOUR_INFO': { 'en-US': 'My Info' }} | Translation overrides allows custom copy to be used in place of the preconfigured translatable copy. This attribute takes an object as its value in the following format: <br><br> <code>{<br>  'TRANSLATION_PROPERTY': { <br>    'locale': 'custom copy',<br>    'locale2': 'custom copy'<br>  },<br>  'TRANSLATION_PROPERTY_2': {<br>    'locale': 'custom copy',<br>    'locale2': 'custom copy'<br>  }<br>}</code> <br><br> Valid Translation Properties:<ul><li>ACCOUNT_INFO (tab label)</li><li>CAR_INFO (tab info)</li><li>YOUR_INFO (tab info)</li><li>BUTTON (initial tab view button)</li></ul> Valid Locales:<ul><li>en-US</li><li>en-CA</li><li>fr-CA</li></ul>     |
