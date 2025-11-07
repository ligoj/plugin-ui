/*
 * Licensed under MIT (https://github.com/ligoj/ligoj/blob/master/LICENSE)
 */
define(['cascade'], function ($cascade) {
	var current = {

		/**
		 * Datatables of plug-ins.
		 */
		table: null,

		initialize: function () {
			current.table = _('table').on('click', '.delete', function () {
				current.deleteNode(_('table').dataTable().fnGetData($(this).closest('tr')[0]));
			}).dataTable({
				ajax: () => `${REST_PATH}node`,
				dataSrc: 'data',
				sAjaxDataProp: 'data',
				dom: '<"row"<"col-sm-11"B><"col-sm-1"f>r>t',
				pageLength: -1,
				destroy: true,
				order: [
					[0, 'asc']
				],
				columns: [{
					data: 'id',
					className: 'truncate'
				}, {
					data: 'name',
					className: 'truncate'
                }, {
                    data: 'status',
                    className: 'truncate'
                }, {
					data: '',
					className: 'icon',
					render: function (node, mode) {
						if (mode === 'display') {
							return `<a class="delete" data-toggle="tooltip" title="${current.$messages.delete}"><i class="far fa-trash-alt"></i></a>`;
						}
						return node;
					}
				}],
				buttons: [{
				    className: 'btn-primary',
                    text: current.$messages.configure,
                    action: current.newSubscription
				}]
			});
		},


		/**
		 * New subscription form
		 * @param {object} data Project data
		 */
		newSubscription: function (project) {
			// Subscription UI mode
			_('main').addClass('hidden');
			_('table_wrapper').addClass('hidden');

			$cascade.loadFragment(current, current.$transaction, 'main/subscribe-wizard', 'subscribe-wizard', {
				callback: function (context) {
					context.setModel(0); // No associated project
				},
				plugins: ['css', 'i18n', 'html', 'js']
			});

			$(document).off('subscribe:cancel').on('subscribe:cancel', '#subscribe-definition', function () {
				$(document).off('subscribe:saved,subscribe:cancel');
				current.clearAndReload();
                current.restoreView();
            });
		},

		restoreView: function() {
            _('main').removeClass('hidden');
            _('table_wrapper').removeClass('hidden');
            _('_module-main/subscribe-wizard/subscribe-wizard').empty().remove();
		},

		/**
		 * Clear the plugin list and reload it.
		 */
		clearAndReload: function() {
			if (current.table) {
				current.table.api().clear().draw().ajax.reload();
			}
		},

		/**
		 * Delete a specific version.
		 */
		deleteNode: function (node, confirmed) {
		    if (confirmed === true) {
                $.ajax({
                    type: 'DELETE',
                    url: `${REST_PATH}node/${node.id}`,
                    dataType: 'text',
                    contentType: 'application/json',
                    success: function () {
                        notifyManager.notify(Handlebars.compile(current.$messages.deleted)(node.name));
                        current.clearAndReload();
                    }
                });
			} else {
				// Requires a confirmation for the selected node row
				const displayName = node.name + '[' + node.id + ']';
				bootbox.confirmDelete(function (confirmed) {
					confirmed && current.deleteNode(node, true);
				}, displayName);
            }
		}
	};
	return current;
});
