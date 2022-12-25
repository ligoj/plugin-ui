/*
 * Licensed under MIT (https://github.com/ligoj/ligoj/blob/master/LICENSE)
 */
define(function () {
	var current = {

		// the main table
		table: null,

		// id to update or to delete
		currentId: null,

		// extract authorization from select components
		extractDataFromSelect: function (selectId, type) {
			var result = [];
			var auths = $(selectId).select2('data');
			for (var idx = 0; idx < auths.length; idx++) {
				var auth = auths[idx];
				if (auth.type) {
					// Existing authorization
					result.push(auth);
				} else {
					// Added authorization
					result.push({
						pattern: auth.text,
						type: type
					});
				}
			}
			return result;
		},

		// Helper function to serialize all the form fields into a JSON string
		formToJSON: function () {
			var authsUI = current.extractDataFromSelect('#authorizations-ui', 'ui');
			var authsApi = current.extractDataFromSelect('#authorizations-api', 'api');
			return JSON.stringify({
				id: current.currentId,
				name: _('name').val(),
				authorizations: authsUI.concat(authsApi)
			});
		},

		// ---------------- BUTTON MANAGEMENT ----------------

		// delete button management
		deleteButton: function () {
			var tr = $(this).parents('tr');
			var uc = current.table.fnGetData(tr[0]);
			bootbox.confirmDelete(function (confirmed) {
				confirmed && current.deleteEntity(uc.id);
			}, uc.name);
		},

		// create button management
		createButton: function () {
			current.currentId = null;
			_('name').val('');
			_('create').removeClass('hidden');
			_('save').addClass('hidden');
			_('authorizations-api').select2('data', '');
			_('authorizations-ui').select2('data', '');
			_('myModalLabel').text(current.$messages.add);
			_('popup').modal('show');
			return false;
		},

		// ---------------- API CALL ----------------
		// delete api call
		deleteEntity: function (id) {
			$.ajax({
				type: 'DELETE',
				url: REST_PATH + 'system/security/role/' + id,
				success: function () {
					notifyManager.notify(Handlebars.compile(current.$messages.deleted)(id));
					// Refresh the table
					current.table && current.table.api().ajax.reload();
				}
			});
		},

		// Save or update API call
		saveOrUpdate: function () {
			$.ajax({
				type: current.currentId ? 'PUT' : 'POST',
				url: REST_PATH + 'system/security/role',
				dataType: 'json',
				contentType: 'application/json',
				data: current.formToJSON(),
				success: function () {
					notifyManager.notify(Handlebars.compile(current.$messages[current.currentId ? 'updated' : 'created'])(_('name').val()));
					_('popup').modal('hide');
					// Refresh the table
					current.table && current.table.api().ajax.reload();
				}
			});
		},

		// initialize the page
		initialize: function () {
			// initialize components
			_('save').click(current.saveOrUpdate);
			_('create').click(current.saveOrUpdate);
			current.initializeDataTable();
			current.newSelect2('#authorizations-api');
			current.newSelect2('#authorizations-ui');
			// Map fields
			validationManager.mapping.authorizations = 'authorizations-api;authorizations-ui';
			// update focus when modal pop-up is down
			_('popup').on('shown.bs.modal', function () {
				_('name').focus();
			}).on('show.bs.modal', function (event) {
				validationManager.reset($(this));
				var $source = $(event.relatedTarget);
				var $tr = $source.closest('tr');
				var uc = ($tr.length && current.table.fnGetData($tr[0])) || {};
				current.currentId = uc.id;
				_('name').val(uc.name);
				$('.modal-title').text(current.$messages[uc.id ? 'update' : 'create']);
				if (current.currentId) {
					_('create').addClass('hidden');
					_('save').removeClass('hidden');
				} else {
					_('create').removeClass('hidden');
					_('save').addClass('hidden');
				}
				_('authorizations-api').select2('data', uc['authorizations-api']);
				_('authorizations-ui').select2('data', uc['authorizations-ui']);
			});
		},

		/**
		 * Create a new Select2 with basic configuration.
		 */
		newSelect2: function (selector) {
			return $(selector).select2({
				tags: [],
				formatSelection: function (item) {
					if (item.pattern !== undefined) {
						return item.pattern;
					}
					return item.text;
				}
			});
		},

		// initialize the datatable
		initializeDataTable: function () {
			current.table = _('table').dataTable({
				searching: true,
				dom: '<"row"<"col-xs-6"B><"col-xs-6"f>r>t<"row"<"col-xs-6"i><"col-xs-6"p>>',
				ajax: {
					url : REST_PATH + 'system/security/role/withAuth',
					callback :function (json, callback) {
						for (var idx = 0; idx < json.data.length; idx++) {
							var auths = json.data[idx].authorizations;
							var api = [];
							var ui = [];
							for (var authIdx = 0; authIdx < auths.length; authIdx++) {
								if (auths[authIdx].type === 'ui') {
									ui.push(auths[authIdx]);
								} else {
									api.push(auths[authIdx]);
								}
							}
							json.data[idx]['authorizations-api'] = api;
							json.data[idx]['authorizations-ui'] = ui;
						}
						callback(json);
					}
				},
				createdRow: function (nRow) {
					$(nRow).find('.delete').on('click', current.deleteButton);
				},
				columns: [{
					data: 'name'
				}, {
					data: 'authorizations-api',
					render: current.authorizationRenderer
				}, {
					data: 'authorizations-ui',
					render: current.authorizationRenderer
				}, {
					orderable: false,
					data: null,
					width: '32px',
					render: function () {
						return '<a data-toggle="modal" data-target="#popup"><i class="fas fa-pencil-alt" data-toggle="tooltip" title="' + current.$messages.update + '"></i></a><a class="delete"><i class="far fa-trash-alt" data-toggle="tooltip" title="' + current.$messages.delete + '"></i></a>';
					}
				}],
				buttons: [{
					extend: 'create',
					action: current.createButton
				}]
			});
		},

		// render an authorization in data grid
		authorizationRenderer: function (item) {
			var result = '';
			for (var idx = 0; idx < item.length; idx++) {
				if (idx !== 0) {
					result += ', ';
				}
				result += item[idx].pattern;
			}
			return result;
		}
	};
	return current;
});
