/*
 * Licensed under MIT (https://github.com/ligoj/ligoj/blob/master/LICENSE)
 */
define(function () {
	var current = {

		// the main table
		table: null,

		// id to update or to delete
		currentId: null,

		invalidateButton: function () {
			var tr = $(this).parents('tr');
			var uc = current.table.fnGetData(tr[0]);
			$.ajax({
				type: 'POST',
				url: REST_PATH + 'system/cache/' + encodeURIComponent(uc.id),
				dataType: 'json',
				success: function () {
					notifyManager.notify(Handlebars.compile(current.$messages.invalidated)(uc.id));
				}
			});
		},

		// initialize the page
		initialize: function () {
			current.table = $('#table').dataTable({
				ajax: {
					url: REST_PATH + 'system/cache',
					dataSrc: ''
				},
				createdRow: function (nRow) {
					$(nRow).find('.invalidate').on('click', current.invalidateButton);
				},
				columns: [{
					data: 'id'
				}, {
					data: 'size'
				}, {
					data: 'hitCount',
					render: function(value, mode, data) {
						if (mode === 'sort') {
							return value || 0;
						}
						if (typeof data.hitCount === 'undefined') {
							return null;
						}
						return value + ' (' + Math.round(data.hitPercentage || 0) + '%)';
					}
				}, {
					data: 'missCount',
					render: function(value, mode, data) {
						if (mode === 'sort') {
							return value || 0;
						}
						if (typeof data.missCount === 'undefined') {
							return null;
						}
						return value + ' (' + Math.round(data.missPercentage || 0) + '%)';
					}
				}, {
					data: 'nearCacheRatio',
					render: function(value, mode, data) {
						if (mode === 'sort') {
							return value || 0;
						}
						if (typeof data.nearCacheRatio === 'undefined') {
							return null;
						}
						return Math.round(data.nearCacheRatio || 0) + '%';
					}
				}, {
					data: 'nearCacheRatio',
					render: function(value, mode, data) {
						if (mode === 'sort') {
							return value || 0;
						}
						if (typeof data.averageGetTime === 'undefined') {
							return null;
						}
						return Math.round(data.averageGetTime || 0) + 'ms';
					}
				}, {
					data: null,
					width: '16px',
					orderable: false,
					render: function () {
						return '<a class="invalidate"><i class="fas fa-sync-alt" data-toggle="tooltip" title="' + current.$messages.invalidate + '"></i></a>';
					}
				}]
			});
		}
	};
	return current;
});
