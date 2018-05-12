/*
 * Licensed under MIT (https://github.com/ligoj/ligoj/blob/master/LICENSE)
 */
define(function () {
	var current = {
		/**
		 * Return a cookie value.
		 * @param  {Sring} name  Cookie name.
		 * @return {String}      Cookie value.
		 */
		getCookie: function (name) {
			var value = document.cookie;
			var start = value.indexOf(' ' + name + '=');
			if (start === -1) {
				start = value.indexOf(name + '=');
			}
			if (start === -1) {
				value = null;
			} else {
				start = value.indexOf('=', start) + 1;
				var end = value.indexOf(';', start);
				if (end === -1) {
					end = value.length;
				}
				value = unescape(value.substring(start, end));
			}
			return value;
		},

		/**
		 * Load session data.
		 */
		initialize: function () {
			$.ajax({
				type: 'GET',
				url: REST_PATH + 'session',
				dataType: 'json',
				success: function (data) {
					_('userName').val(data.userName);
					_('session').val(current.getCookie('JSESSIONID'));
					if (data.applicationSettings) {
						_('buildNumber').val(parseInt(data.applicationSettings.buildNumber, 10));
						var timestamp = parseInt(data.applicationSettings.buildTimestamp, 10);
						if (isNaN(timestamp)) {
							_('buildTimestamp').val(data.applicationSettings.buildTimestamp);
							_('buildDate').val(formatManager.formatDate(NaN));
						} else {
							_('buildTimestamp').val(timestamp);
							_('buildDate').val(formatManager.formatDate(timestamp));
						}
						_('buildVersion').val(data.applicationSettings.buildVersion);
					} else {
						notifyManager.notifyDanger(current.$messages.noBuildInformation);
					}
				}
			});
			current.fetchSystem();
			_('defaultTimeZone').on('blur change', function () {
				current.updateTimeZone('default', 'defaultTimeZone', $(this).val());
			});
			_('timeZone').on('blur change', function () {
				current.updateTimeZone('application', 'timeZone', $(this).val());
			});
			_('cryptography').on('submit', function (e) {
				e.preventDefault();
				$.ajax({
					type: 'POST',
					url: REST_PATH + 'system/security/crypto',
					dataType: 'text',
					contentType: 'text/plain',
					data: _('to-encrypt').val(),
					success: function (data) {
						_('encrypted').text(data);
						_('to-encrypt').trigger('focus');
					}
				});
			});
			current.initializeTable();
		},
		
		initializeTable: function() {
			_('popup').on('shown.bs.modal', function () {
				// Clever auto focus
				if (_('value').val()) {
					_('value').trigger('focus');
				} else {
					_('name').trigger('focus');
				}
			}).on('show.bs.modal', function (event) {
				var $source = $(event.relatedTarget);
				var $tr = $source.closest('tr');
				var uc = ($tr.length && current.table.fnGetData($tr[0])) || {};
				_('name').val(uc.name || '');
				if (uc.secured && uc.name) {
					current.$cascade.appendSpin(_('value').addClass('hidden').closest('div'));
					_('value').val('ERROR');
					$.ajax({
						type: 'GET',
						url: REST_PATH + 'system/configuration/' + encodeURIComponent(uc.name),
						dataType: 'text',
						success: function (data) {
							_('value').val(data);
						},
						complete: function() {
							current.$cascade.removeSpin(_('value').removeClass('hidden').closest('div'));
						}
					});
				} else {
					_('value').val(uc.value);
					current.$cascade.removeSpin(_('value').removeClass('hidden').closest('div'));
				}
				validationManager.reset($(this));
			}).on('submit', function() {
				var name = _('name').val();
				$.ajax({
					type: 'POST',
					url: REST_PATH + 'system/configuration/' + encodeURIComponent(name),
					dataType: 'text',
					contentType: 'text/plain',
					data: _('value').val(),
					success: function (data) {
						_('popup').modal('hide');
						notifyManager.notify(Handlebars.compile(current.$messages.updated)(name));
						current.table && current.table.api().ajax.reload();
					}
				});
			});

			current.table = _('table')
			.on('click', '.delete', current.deleteConfiguration)
			.dataTable({
				ajax: function () {
					return REST_PATH + 'system/configuration';
				},
				createdRow: function (nRow) {
					$(nRow).find('.delete').on('click', current.deleteButton);
				},
				dataSrc: '',
				sAjaxDataProp: '',
				pageLength: -1,
				dom: '<"row"<"col-sm-11"B><"col-sm-1"f>r>t',
				destroy: true,
				order: [
					[0, 'asc']
				],
				columns: [{
					width: '300px',
					data: 'name'
				}, {
					data: 'value',
					render: function (data, mode, model) {
						if (mode === 'display') {
							return '<div class="configuration-value">' + (model.secured ? '<i class="fas fa-ellipsis-h"></i><i class="fas fa-ellipsis-h"></i>' : data) + '</div>';
						}
						return data;
					}
				}, {
					data: 'secured',
					className: 'hidden-xs hidden-sm',
					width: '16px',
					render: function (data, mode) {
						if (mode === 'display') {
							return data ? '<i class="fas fa-check" data-toggle="tooltip" title="' + current.$messages['configuration-secured'] + '"></i>' : '';
						}
						return data;
					}
				}, {
					data: 'persisted',
					className: 'hidden-xs hidden-sm',
					width: '16px',
					render: function (data, mode, model) {
						if (mode === 'display') {
							return data ? '<i class="fas fa-check" data-toggle="tooltip" title="' + current.$messages['configuration-type-persisted'] + '"></i>' :  model.override ? '<i class="fas fa-exclamation-triangle text-warning" data-toggle="tooltip" title="' + current.$messages['configuration-override'] + '"></i>' : '';
						}
						return data;
					}
				}, {
					data: null,
					width: '30px',
					orderable: false,
					render: function () {
						return '<a data-toggle="modal" data-target="#popup"><i class="fas fa-pencil-alt" data-toggle="tooltip" title="' + current.$messages.update + '"></i></a><a class="delete"><i class="fas fa-times" data-toggle="tooltip" title="' + current.$messages['delete'] + '"></i></a>';
					}
				}],
				buttons: [{
					extend: 'create',
					action: function () {
						_('popup').modal('show');
					}
				}]
			});
		},

		/**
		 * Fetch system data.
		 */
		fetchSystem: function () {
			$.ajax({
				type: 'GET',
				url: REST_PATH + 'system',
				dataType: 'json',
				success: function (data) {
					_('date').val(moment.utc(data.date.date).local().format('L-LT:ss') + ' / ' + data.date.date);
					_('cpu').val(data.cpu.total);
					_('timeZone').val(data.date.timeZone);
					_('defaultTimeZone').val(data.date.defaultTimeZone);
					_('originalDefaultTimeZone').val(data.date.originalDefaultTimeZone);
					var maxMemory = data.memory.maxMemory || data.memory.totalMemory + 1000000;
					var committedUsedPercent = Math.round(1000 * (data.memory.totalMemory - data.memory.freeMemory) / maxMemory) / 10;
					_('memory-committed-used').css({
						width: committedUsedPercent + '%'
					}).tooltip({
						html: true,
						title: 'Committed used memory<br/>' + committedUsedPercent + '%<br/>' + formatManager.formatSize(data.memory.totalMemory - data.memory.freeMemory) + ' / ' + formatManager.formatSize(data.memory.maxMemory)
					});
					var committedFreePercent = Math.round(1000 * data.memory.freeMemory / maxMemory) / 10;
					_('memory-committed-free').css({
						width: committedFreePercent + '%'
					}).tooltip({
						html: true,
						title: 'Committed free memory<br/>' + committedFreePercent + '%<br/>' + formatManager.formatSize(data.memory.freeMemory) + ' / ' + formatManager.formatSize(data.memory.maxMemory)
					});
					var freePercent = 100 - committedFreePercent - committedUsedPercent;
					_('memory-free').css({
						width: freePercent + '%'
					}).tooltip({
						html: true,
						title: 'Free memory<br/>' + freePercent + '%<br/>' + formatManager.formatSize(data.memory.maxMemory - data.memory.totalMemory) + ' / ' + formatManager.formatSize(data.memory.maxMemory)
					});
				}
			});
		},
		deleteConfiguration: function () {
			var tr = $(this).parents('tr');
			var uc = current.table.fnGetData(tr[0]);
			bootbox.confirmDelete(function (confirmed) {
				if (confirmed) {
					$.ajax({
						type: 'DELETE',
						url: REST_PATH + 'system/configuration/' + encodeURIComponent(uc.name),
						success: function () {
							notifyManager.notify(Handlebars.compile(current.$messages.deleted)(uc.name));
							current.table && current.table.api().ajax.reload();
						}
					});
				}
			}, uc.name);
		},
		updateTimeZone: function (type, name, id) {
			$.ajax({
				type: 'PUT',
				url: REST_PATH + 'system/timezone/' + type,
				dataType: 'text',
				contentType: 'text/plain',
				data: id,
				success: function () {
					notifyManager.notify(Handlebars.compile(current.$messages.updated)(name));
				}
			});
		}
	};
	return current;
});
