/*
 * Licensed under MIT (https://github.com/ligoj/ligoj/blob/master/LICENSE)
 */
define(["../../../rest/swagger-ui-bundle.js","../../../rest/swagger-ui-standalone-preset.js"], function(SwaggerUIBundle,SwaggerUIStandalonePreset) {
    return {
	initialize: function () {
	    window.SwaggerTranslator;
        $(function(){
          // Build a system
          const ui = SwaggerUIBundle({
            url: "rest/openapi.json",
            dom_id: '#swagger-ui',
            defaultModelsExpandDepth: -1,
            deepLinking: false,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          })
          window.ui = ui
        })
	}
	};
});
