/*
 * Licensed under MIT (https://github.com/ligoj/ligoj/blob/master/LICENSE)
 */
/**
 * Manager used to populate and manage SaaS features.
 */
define(['cascade'], function ($cascade) {
	const current = {

		initialize: function () {
			current.$view.find('.global-configuration').remove();
			// Load global tools
			(current.$session.userSettings.globalTools || []).forEach(current.renderGlobal);
			const restrictedUrl = current.getRestrictedUrl();
			if (typeof restrictedUrl === 'string') {
				// Display only one link
				$('#main-menu').remove();
				$('a[href="#/"]').attr('href', restrictedUrl);
			}
		},

		getRestrictedUrl: function(){
			return current.$session.userSettings['restricted-url'];
		},

		/**
		 * Render the global for the given tool configuration.
		 * @param  {object} globalTool Global tool configuration.
		 */
		renderGlobal: function (globalTool) {
			current.requireTool(current, globalTool.node.id, function ($tool) {
				const $global = ($tool.$view.is('.global-configuration') ? $tool.$view : $tool.$view.find('.global-configuration')).clone();
				$tool.renderGlobal($global, globalTool);
				$global.removeClass('hidden');
			});
		},

		/**
		 * Return the root of refinement. This corresponds to the basic service. The result will be cached.
		 */
		getService: function (node) {
			if (node.service) {
				return node.service;
			}
			node.service = (node.refined && this.getService(node.refined)) || node;
			return node.service;
		},

		/**
		 * Return the first level of refinement, just after root. This corresponds to the first implementation
		 * of a service. The result will be
		 * cached.
		 */
		getTool: function (node) {
			if (node.tool) {
				return node.tool;
			}
			if (node.refined) {
				if (node.refined.refined) {
					node.tool = this.getTool(node.refined);
				} else {
					node.tool = node;
				}
			} else {
				return null;
			}
			return node.tool;
		},

		/**
		 * Load dependencies of given node identifier, and call given callback when :
		 * <ul>
		 * <li>HTML is integrated inside the current view if was not</li>
		 * <li>CSS is loaded and loaded</li>
		 * <li>JavaScript is loaded, injected and initialized</li>
		 * </ul>
		 * @param {object} context Context requesting this service.
		 * @param node Node identifier to prepare dependencies.
		 * @param callback Optional function to call when all dependencies are loaded and initialized.
		 * Parameter will be the controller of the service.
		 */
		requireService: function (context, node, callback) {
			// Check the plugin is enabled
			if (node && typeof securityManager.plugins !== 'undefined' && $.inArray(node.split(':').slice(0, 2).join(':'), securityManager.plugins) < 0) {
				callback && callback();
				return;
			}

			const service = current.getServiceNameFromId(node);
			const path = 'main/service/' + service + '/';
			if (path === context.$path) {
				// Current context is loaded
				return callback && callback(context);
			}
			$cascade.loadFragment(context, context.$transaction, path, service, {
				callback: function ($context) {
					$context.node = 'service:' + service;
					callback && callback($context);
				},
				errorCallback: function (err) {
					errorManager.ignoreRequireModuleError(err.requireModules);
					errorManager.ignoreRequireModuleError(['main/service/' + service + '/nls/messages']);
					callback && callback();
				},
				plugins: ['css', 'i18n', 'partial', 'js']
			});
		},

		/**
		 * Load dependencies of given node identifier, and call given callback when :
		 * <ul>
		 * <li>HTML is integrated inside the service's view if was not</li>
		 * <li>CSS is loaded and loaded</li>
		 * <li>JavaScript is loaded, injected and initialized</li>
		 * <li>All above dependencies for service and for tool, and in this order</li>
		 * </ul>
		 * @param {object} context Context requesting this service.
		 * @param node Node identifier to prepare dependencies.
		 * @param callback Optional function to call when all dependencies are loaded and initialized.
		 * Parameter will be the controller of the tool.
		 */
		requireTool: function (context, node, callback) {
			// First, load service dependencies
			const transaction = context.$transaction;

			// Check the plugin is enabled
			if (node && typeof securityManager.plugins !== 'undefined' && $.inArray(node.split(':').slice(0, 3).join(':'), securityManager.plugins) < 0) {
				callback && callback();
				return;
			}
			current.requireService(context, node, function ($service) {
				if (typeof $service === 'undefined') {
					callback && callback();
					return;
				}

				// Then, load tool dependencies
				const service = current.getServiceNameFromId(node);
				const tool = current.getToolNameFromId(node);
				const path = 'main/service/' + service + '/' + tool;
				if (path === context.$path) {
					// Current context is loaded
					return callback && callback(context);
				}
				$cascade.loadFragment($service, transaction, path, tool, {
					callback: function ($tool) {
						$tool.node = 'service:' + service + ':' + ':' + tool;
						callback && callback($tool, $service);
					},
					errorCallback: function (err) {
						errorManager.ignoreRequireModuleError(err.requireModules);
						errorManager.ignoreRequireModuleError(['main/service/' + service + '/' + tool + '/nls/messages']);
						callback && callback(null, $service);
					},
					plugins: ['css', 'i18n', 'partial', 'js']
				});
			});
		},

		/**
		 * Return the tool identifier part from a node identifier. It's the first level of refinement, just
		 * after service. This corresponds to the first implementation of a service.
		 */
		getToolFromId: function (id) {
			// Pattern is : service:{service name}:{tool name}(:whatever)
			const data = id.split(':');
			return data.length > 2 && data.slice(0, 3).join('-');
		},

		/**
		 * Return the identifier of each hierarchy nodes until the service.
		 */
		getHierarchyId: function (id) {
			// Pattern is : service:{service name}:{tool name}(:whatever)
			const data = id.split(':');
			let index;
			let result = '';
			for (index = 2; index <= data.length; index++) {
				result += ' ' + data.slice(0, index).join('-');
			}
			return result;
		},

		/**
		 * Return the service identifier part from a node identifier.
		 */
		getServiceFromId: function (id) {
			// Pattern is : service:{service name}:{tool name}(:whatever)
			const data = id.split(':');
			return data.length > 1 && data.slice(0, 2).join('-');
		},

		/**
		 * Return the service simple name part from a node identifier.
		 */
		getServiceNameFromId: function (id) {
			// Pattern is : service:{service name}:{tool name}(:whatever)
			return id.split(':')[1];
		},

		/**
		 * Return the service simple name part from a node identifier.
		 */
		getToolNameFromId: function (id) {
			// Pattern is : service:{service name}:{tool name}(:whatever)
			return id.split(':')[2];
		},

		/**
		 * Icon of corresponding tool, and entity's "name".
		 */
		toIconNameTool: function (node) {
			return current.toIcon(node) + '<span class="hidden-xs"' + (node.description ? ' title="' + node.description + '"' : '') + '> ' + current.$main.getNodeName(node) + '</span>';
		},

		toToolBaseIcon: function (node) {
			const fragments = node.split(':');
			return 'main/service/' + fragments[1] + '/' + fragments[2] + '/img/' + fragments[2];
		},

		/**
		 * Icon of corresponding tool.
		 */
		toIcon: function (node, suffix, dataSrc) {
			return current.$main.toIcon(node, suffix, dataSrc);
		},

		/**
		 * Return the "name" of the given entity
		 */
		toName: function (object) {
			return object.name;
		},

		/**
		 * Return the given entity
		 */
		toIdentity: function (object) {
			return object;
		},

		/**
		 * Return the "text" of the given entity
		 */
		toText: function (object) {
			return object.text;
		},

		/**
		 * Return the "description" of the given entity
		 */
		toDescription: function (object) {
			return object.description;
		},

		/**
		 * Refresh the status of given subscription.
		 * @param {array|integer} subscriptions Single or multiple subscription to detail.
		 * @param {function} renderCallback     Callback called for each refreshed subscription.
		 */
		refreshSubscription: function (subscriptions, renderCallback) {
			if (!$.isArray(subscriptions)) {
				subscriptions = [subscriptions];
			}
			if (subscriptions.length === 0) {
				// Nothing to do
				return;
			}
			const subscriptionsAsMap = [];
			const ids = subscriptions.map(function (s) {
				subscriptionsAsMap[s.id] = s;
				return s.id;
			});
			$.ajax({
				dataType: 'json',
				url: REST_PATH + 'subscription/status/refresh?id=' + ids.join('&id='),
				type: 'GET',
				success: function (freshSubscriptions) {
					// Process each result
					ids.forEach(function (id) {
						// Copy fresh data
						const subscription = subscriptionsAsMap[id];
						const freshSubscription = freshSubscriptions[id];
						subscription.parameters = freshSubscription.parameters;
						subscription.data = freshSubscription.data;
						subscription.status = freshSubscription.status;

						// Update the UI
						current.updateSubscriptionStatus(subscription, renderCallback);
					});
				},
				beforeSend: function () {
					ids.forEach(function (id) {
						$('[data-subscription="' + id + '"]').addClass('refresh');
					});
				},
				complete: function () {
					ids.forEach(function (id) {
						$('[data-subscription="' + id + '"]').removeClass('refresh');
					});
				}
			});
		},

		/**
		 * Refresh a subscriptions status.
		 * @param {Object} subscription     The subscription object.
		 * @param {function} renderCallback Callback called when the subscription data has been rendered.
		 */
		updateSubscriptionStatus: function (subscription, renderCallback) {
			// Check the transition to save useless computation
			if ($cascade.isSameTransaction(current)) {
				current.applySubscriptionStyle(null, subscription, true, renderCallback);
			}
		},

		/**
		 * apply subscriptions style
		 */
		applySubscriptionStyle: function ($tr, subscription, refresh, renderCallback) {
			let tdClass;
			let tooltip;
			let contentClass = '';
			const id = subscription.id;
			$tr = $tr || $('[data-subscription="' + id + '"]');
			if (subscription.status === 'up') {
				tdClass = 'status-up';
				tooltip = current.$messages['subscription-state-up'];
			} else if (subscription.status === 'down') {
				tdClass = 'status-down';
				tooltip = current.$messages['subscription-state-down'];
				contentClass = 'fa-chain-broken';
			} else {
				tdClass = 'status-unknown';
				tooltip = current.$messages['subscription-state-unknown'];
			}
			$tr.find('td.status').removeClass('status-up').removeClass('status-down').removeClass('status-unknown')
				.addClass(tdClass)[contentClass ? 'addClass' : 'removeClass']('text-danger')
				.removeAttr('data-original-title').attr('data-title', tooltip).attr('data-container', 'body').attr('rel', 'tooltip')
				.tooltip('fixTitle')
				.find('.status-content').html(contentClass ? '<i class="fas ' + contentClass + '"></i>' : '&nbsp;');

			// Update fresh keys & features
			if (refresh) {
				// Replace the original content with content based on live data
				current.updateSubscriptionDetails($tr, subscription, 'key', true, renderCallback);
				current.updateSubscriptionDetails($tr, subscription, 'features', false, renderCallback);
			}
		},

		/**
		 * Update the subscription UI details in the target jquery row. No involved AJAX call.
		 * @param {jquery}   $tr the Container row of this subscription.
		 * @param {object}   subscription The subscription object to update.
		 * @param {string}   filter The target UI scope, such as "key" of "feature". 
		 * @param {boolean}  replace When true, the details are overridden, Otherwise, the content is added.
		 * @param {function} renderCallback Callback called when the subscription data has been rendered.
		 */
		updateSubscriptionDetails: function ($tr, subscription, filter, replace, renderCallback) {
			const $td = $tr.find('td.' + filter);
			// Build the container
			let $details;
			if (replace) {
				$details = $td;
			} else {
				$details = $td.find('.details');
				if ($details.length === 0) {
					$td.append('<span class="details"></span>');
					$details = $td.find('.details');
				}
			}

			// Build the content
			current.$child && current.requireTool(current.$child, subscription.node.id, function ($tool, $service) {
				// Render common UI of this tool/service
				current.renderOnce($service, 'service');
				current.renderOnce($tool, 'tool');

				const renderDetailsFunction = 'renderDetails' + filter.capitalize();
				const renderFunction = 'render' + filter.capitalize();
				if (!$td.is('.rendered')) {
					// Add minimum data
					$cascade.removeSpin($td).addClass('rendered').prepend(((renderCallback && renderCallback(subscription, filter, $tool, $td)) || '') + current.render(subscription, renderFunction, $tool, $tr, $td));
				}

				// Generate the detailed part
				const newContent = subscription.status === 'up' && current.render(subscription, renderDetailsFunction, $tool, $tr, $td);

				// Update the UI is managed
				$tool && $tool.$parent.renderFeatures && $tool.$parent.renderFeatures(subscription);
				$tool && $tool.renderFeatures && $tool.renderFeatures(subscription);

				if (typeof newContent === 'string' && newContent !== '&nbsp;') {
					// Add generated detailed data
					$details.empty().html(newContent);
					// Render service and tool callbacks
					const callback = renderDetailsFunction + 'Callback';
					$tool && $tool.$parent[callback] && $tool.$parent[callback](subscription, $details);
					$tool && $tool[callback] && $tool[callback](subscription, $details);

					// Also start the carousel if needed
					$details.find('.carousel').carousel({ interval: false });
					renderCallback && renderCallback(subscription, filter, $tool, $details);
				}
			});
		},

		/**
		 * Render the tool or service feature, only once per tool or service.
		 * @param {object} $context The tool or service's context.
		 * @param {string} scope 'tool' or 'service'.
		 */
		renderOnce: function ($context, scope) {
			const scopeClass = 'render-' + scope;
			const scopeSelector = '.' + scopeClass;
			if ((typeof $context === 'undefined') || $context === null || (!$context.$view.is(scopeSelector) && $context.$view.find(scopeSelector).length === 0) || current.$view.find(scopeSelector + '.' + $context.node.replace(/:/g, '-')).length === 1) {
				// This feature is not supported or has already been already rendered
				return;
			}
			// Add the view of this scope
			const $view = ($context.$view.is(scopeSelector) ? $context.$view : $context.$view.find(scopeSelector)).clone().addClass($context.node.replace(/:/g, '-'));
			current.$view.append($view);

			if (typeof $context[scopeClass] === 'function') {
				// Render this scope
				$context[scopeClass]($view);
			}
		},

		/**
		 * Generate a FontAwesome icon. Tooltip is optional and will be resolved with messages if available. 
		 * @param faIcon FontAwesome icon name.Provided CSS class will be prefixed by "fas fa-", unless is starts with 'fas ', 'fab ', 'far ' or space.
		 */
		icon: function (faIcon, tooltip) {
			faIcon = (faIcon || '').match(/^(fa[brs] | |fa-)/) ? faIcon : 'fas fa-' + faIcon;
			return '<i class="' + faIcon + '"' + current.tooltip(tooltip) + '></i>&nbsp;';
		},

		/**
		 * Generate tooltip part.  Text will be resolved with messages if available. If empty, empty text is
		 * returned.
		 */
		tooltip: function (tooltip) {
			return tooltip ? ' data-container="#_ucDiv" data-toggle="tooltip" title="' + (current.$messages[tooltip] || tooltip) + '"' : '';
		},

		/**
		 * Namespace based dynamic call : tool and service specific.
		 */
		render: function (subscription, namespace, $tool, $tr, $td) {
			let result = '';
			if (subscription.parameters && $tool) { // TODO Simplify
				// Render service
				if ($tool.$parent[namespace]) {
					result += $tool.$parent[namespace](subscription, $tr, $td) || '';
				}

				// Render tool
				if ($tool[namespace]) {
					result += $tool[namespace](subscription, $tr, $td) || '';
				}
			}
			return result || '';
		},

		renderKey: function (subscription, parameter) {
			const value = current.getData(subscription, parameter);
			return value && (current.icon('key', current.$messages[parameter] || parameter) + value);
		},

		getData: function (subscription, parameter) {
			return subscription.parameters && subscription.parameters[parameter];
		},

		renderServiceLink: function (icon, link, tooltipKey, textKey, attr, clazz) {
			return '<a href="' + link + '"' + (attr || '') + ' class="feature ' + (clazz || '') + '"><i class="fas fa-' + icon + '" data-toggle="tooltip"' + (tooltipKey ? ' title="' + current.$messages[tooltipKey] + '"' : '') + '></i> ' + (textKey ? current.$messages[textKey] : '') + '</a>';
		},

		renderServiceHelpLink: function (parameters, serviceKey) {
			if (parameters[serviceKey]) {
				return current.renderServiceLink('question-circle-o', parameters[serviceKey], 'service:help', undefined, 'target="_blank"');
			}
			return '';
		},

		/**
		 * Generate a carousel component based on given HTML items. Depending on the amount of subscriptions of same type, and the container, the behavior of the carousel may differ.
		 */
		generateCarousel: function (subscription, items, startIndex, part) {
			part = part || 0;
			const id = 'subscription-details-' + subscription.id;
			let result = '<div id="' + id + '" class="carousel carousel-part' + part + '"';
			const groupBySubscription = subscription.node && (typeof subscription.node.subscriptions !== 'undefined');
			const $carousel = _(id);
			startIndex = $carousel.length ? -1 : current.getVisibleCarouselStartIndex(items, startIndex || 0);
			const baseIndex = $carousel.find('.carousel-inner > .item').length;

			// Too much carousel items -> disable auto scroll
			result += (groupBySubscription && subscription.node.subscriptions.length > 50) ? ' data-interval=""' : ' data-ride="carousel"';
			result += '> ';
			if (groupBySubscription) {
				// Carousel indicator is moved to header instead of each raw
				const $group = $('tr[data-subscription="' + subscription.id + '"]').closest('.node').find('.group-carousel');
				if ($group.length && !$group.hasClass('carousel-part' + part)) {
					// Add a global carousel indicator for this table
					current.generateCarouselIndicators(items, null, startIndex, baseIndex, $group);
					$group.addClass('carousel-part' + part);
				}
			} else {
				// This carousel is independent
				result += current.generateCarouselIndicators(items, id, startIndex, baseIndex, $carousel);
			}

			result += current.generateCarouselInner(items, startIndex, baseIndex, $carousel);

			if ($carousel.length) {
				// Content is already inserted into the DOM
				return '';
			}
			// Carousel navigation is not available in grouped mode
			if (!groupBySubscription) {
				result += '<a class="right carousel-control" data-target="#' + id + '" role="button" data-slide="next"><span class="fas fa-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></a>';
			}
			return result + '</div>';
		},

		/**
		 * Generate the carousel items.
		 * The content can also be merged into an existing carousel.
		 */
		generateCarouselInner: function (items, startIndex, baseIndex, $carousel) {
			const merge = $carousel.length;
			let result = merge ? '' : '<div class="carousel-inner" role="listbox">';
			let value;
			let item;
			for (let i = 0; i < items.length; i++) {
				item = items[i];
				value = $.isArray(item) ? item[1] : item;
				if (value) {
					// Item is well defined, and worth to be displayed
					result += '<div class="item item-' + (baseIndex + i) + ((merge === 0 && (startIndex ? i === startIndex : i === 0)) ? ' active' : '') + '">' + current.toCarouselText(value) + '</div>';
				}
			}

			if (merge === 0) {
				return result + '</div>';
			}
			$carousel.find('.carousel-inner').append(result);
		},

		toCarouselText: function (item) {
			return typeof item === 'undefined' ? '?' : item;
		},

		/**
		 * Return the start index if visible and not out the bounds of the available carousel items.
		 */
		getVisibleCarouselStartIndex: function (items, startIndex) {
			// Find the real visible start index
			let i;
			for (i = 0; i < items.length; i++) {
				if (startIndex === i) {
					const item = items[i];
					if ($.isArray(item) ? item[1] : item) {
						return startIndex;
					}
					return 0;
				}
			}

			// Out of bounds index
			return 0;
		},

		/**
		 * Generate carousel indicators for given items. Each item can be either a raw string, either an array where first item is the tooltip key, and the second is the item text.
		 * The content can also be merged into an existing carousel.
		 */
		generateCarouselIndicators: function (items, id, startIndex, baseIndex, $carousel) {
			const merge = $carousel.length;
			const mergeInd = merge && $carousel.has('.carousel-indicators').length;
			let result = mergeInd ? '' : '<ol class="carousel-indicators">';
			let item;
			let i;
			for (i = 0; i < items.length; i++) {
				item = items[i];
				if (id === null || $.isArray(item) ? item[1] : item) {
					// Item is well defined, and worth to be displayed
					result += '<li';
					if (id) {
						result += ' data-target="#' + id + '"';
					}
					result += ' data-slide-to="' + baseIndex + '"';
					result += (mergeInd === 0 && (startIndex ? i === startIndex : i === 0)) ? ' class="active"' : '';
					result += $.isArray(item) ? ' data-toggle="tooltip" data-container="body" title="' + (current.$messages[item[0]] || item[0]) + '"' : '';
					result += '></li>';
					baseIndex++;
				}
			}
			if (merge === 0) {
				return result + '</ol>';
			}
			// Merge into an existing carousel;
			if (mergeInd) {
				// Merge the indicators to the existing carousel
				$carousel.find('.carousel-indicators').append(result);
			} else {
				// Create the indicators
				$carousel.append(result + '</ol>');
			}
		},

		/**
		 * Round a percent number with at most one decimal.
		 * @param {percent|Number} Percent 0-100 value. Null value means 0.
		 * @return {Number} Percent value with 1 decimal.
		 */
		roundPercent: function (percent) {
			return Math.round((percent || 0) * 10) / 10;
		},

		sparklinePieZoom: function ($spark, data, options) {
			require(['sparkline'], function () {
				current.setupSparkline($spark, data, options);

				// Zoom and auto update tooltips
				$spark.on('mouseenter', function () {
					if (!$spark.is('.zoomed')) {
						$spark.addClass('zoomed').closest('td').addClass('has-zoomed-pie');
						$('.carousel').addClass('has-zoomed-pie');
						current.setupSparkline($spark, data, $.extend({}, options), true);
						window.setTimeout(function () {
							$spark.addClass('zoomed2');
							$spark.find('canvas').on('mouseleave', function () {
								$spark.removeClass('zoomed').closest('td').removeClass('has-zoomed-pie');
								$('.carousel').removeClass('has-zoomed-pie');
								current.setupSparkline($spark, data, options);
								window.setTimeout(function () {
									$spark.removeClass('zoomed2');
								}, 50);
							})
						}, 50);
					}
				});
			});
		},

		setupSparkline: function ($spark, data, options, zoom) {
			$spark.find('canvas').remove();
			options = options || {};
			const size = zoom ? options.zoomSize || '128px' : options.size || '20px';
			const mOptions = $.extend({
				type: 'pie',
				width: size,
				offset: '-90',
				height: size,
				fillColor: 'black',
				borderWidth: size === "128px" ? 4 : 2,
				borderColor: '#ffffff',
			}, options);
			$spark.sparkline(data, mOptions);
			if (options.sparklineClick) {
				$spark.off('sparklineClick').on('sparklineClick', options.sparklineClick);
			}
		}

	};
	return current;
});
