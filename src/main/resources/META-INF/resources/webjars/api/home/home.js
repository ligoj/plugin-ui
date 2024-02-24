/*
 * Licensed under MIT (https://github.com/ligoj/ligoj/blob/master/LICENSE)
 */
define(["../../../rest/swagger-ui-bundle.js","../../../rest/swagger-ui-standalone-preset.js"], function(SwaggerUIBundle,SwaggerUIStandalonePreset) {
 const AdvancedFilterPlugin = function (system) {
         return {
             fn: {
                 opsFilter: function (taggedOps, phrase) {
                     phrase = phrase.toLowerCase()
                     //first filter out all actions that don't meet the search criteria
                     var filteredActions = taggedOps.map((tagObj) => {
                         tagObj._root.entries[1][1] = tagObj._root.entries[1][1].filter((operationObj) => {
                             var op = JSON.parse(JSON.stringify(operationObj));
                             var summary = "";
                             var description = "";
                             if (typeof op.operation.summary !== 'undefined') {
                                 summary = JSON.stringify(op.operation.summary).toLowerCase();
                             }
                             if (typeof op.operation.description !== 'undefined') {
                                 description = JSON.stringify(op.operation.description).toLowerCase();
                             }
                             if ((op.path.toLowerCase().indexOf(phrase) === -1)
                                 && (summary.indexOf(phrase) === -1)
                                 && (description.indexOf(phrase) === -1)
                             ) {
                                 return false;
                             } else {
                                 return true;
                             }
                         });
                         return tagObj;
                     });
                     //then filter any Tags with no actions remaining
                     return filteredActions.filter((tagObj) => {
                         return (tagObj._root.entries[1][1].size > 0);
                     });
                 }
             }
         };
     };
     return {

	initialize: function () {
	    window.SwaggerTranslator;
        $(function(){
          // Build a system
          const ui = SwaggerUIBundle({
            url: "rest/openapi.json",
            dom_id: '#swagger-ui',
            displayRequestDuration: true,
            deepLinking: false,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.FiltrePreset,
              AdvancedFilterPlugin
            ],
            filter: true,
            layout: "StandaloneLayout",
            validatorUrl: "https://validator.swagger.io/validator",
          })
          window.ui = ui
        })
	}
	};
});
