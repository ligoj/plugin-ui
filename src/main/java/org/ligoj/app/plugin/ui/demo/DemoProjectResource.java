package org.ligoj.app.plugin.ui.demo;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import lombok.extern.slf4j.Slf4j;

/**
 * Demo endpoint of the UI plugin, target of the demo `editExtension` of the project dialog (its `apiPath`
 * override) while the demo mode is enabled. It showcases how a plugin points a standard dialog to its own API to
 * receive a MORE complete payload than the standard project API accepts: the project fields plus {@code tags}.
 * <p>
 * This endpoint is a sink: the received payload is acknowledged, logged and dropped. Nothing is persisted, no
 * project is created or updated. Only administrators are authorized by default, as for any endpoint without an
 * explicit authorization.
 */
@Path("/system/demo/project")
@Service
@Slf4j
public class DemoProjectResource {

	/**
	 * Acknowledge a "creation" payload. Nothing is persisted.
	 *
	 * @param vo The project fields plus the demo {@code tags}.
	 */
	@POST
	public void create(final DemoProjectEditionVo vo) {
		drop("creation", vo);
	}

	/**
	 * Acknowledge an "update" payload. Nothing is persisted.
	 *
	 * @param vo The project fields plus the demo {@code tags}.
	 */
	@PUT
	public void update(final DemoProjectEditionVo vo) {
		drop("update", vo);
	}

	/**
	 * Log a summary of the received payload, then drop it.
	 */
	private void drop(final String operation, final DemoProjectEditionVo vo) {
		final var tags = Objects.requireNonNullElse(vo.getTags(), List.<String>of());
		log.info("Demo project API: {} payload of project '{}' received with {} tag(s) {}, dropped (nothing is persisted)",
				operation, vo.getPkey(), tags.size(), tags);
	}
}
