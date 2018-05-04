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
				pageLength: -1,
				dom: "<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i>>",
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
						return current.formatRate(mode, data, 'hitCount', 'hitPercentage', true);
					}
				}, {
					data: 'missCount',
					render: function(value, mode, data) {
						return current.formatRate(mode, data, 'missCount', 'missPercentage', false);
					}
				}, {
					data: 'averageGetTime'
				}, {
					data: null,
					width: '16px',
					orderable: false,
					render: function () {
						return '<a class="invalidate"><i class="fas fa-sync-alt" data-toggle="tooltip" title="' + current.$messages.invalidate + '"></i></a>';
					}
				}]
			});
		},
		
		formatRate: function (mode, data, valueProperty, percentProperty, hitMode) {
			var value = data[valueProperty];
			if (mode === 'sort') {
				return value || 0;
			}
			if (typeof value === 'undefined') {
				return null;
			}
			
			var percent = data[percentProperty];
			if (typeof percent === 'undefined' || value <= (hitMode ? 0 : 1)) {
				// Not enough data to display a rate
				return value;
			}
			
			// Full rendering mode
			percent = Math.round(percent || 0);
			var score = hitMode ? percent : 100 - percent;
			var labelClass = 'danger';
			if (score >= 90 || data.hitCount === 1) {
				labelClass = 'success';
			} else if (score >= 80) {
				labelClass = 'primary';
			} else if (score >= 50) {
				labelClass = 'warning';
			}
			return value + '<span class="pull-right label label-' + labelClass + '">' + percent  + '%</span>';
		}
	};
	return current;
});
