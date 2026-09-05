package org.ligoj.app.plugin.ui.demo;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

/**
 * Test class of {@link DemoProjectResource}: a sink, the payloads are accepted and dropped.
 */
class DemoProjectResourceTest {

	private final DemoProjectResource resource = new DemoProjectResource();

	private DemoProjectEditionVo newVo(final List<String> tags) {
		final var vo = new DemoProjectEditionVo();
		vo.setName("Demo");
		vo.setPkey("demo");
		vo.setTeamLeader("junit");
		vo.setDescription("Some description");
		vo.setTags(tags);
		return vo;
	}

	@Test
	void createDropsThePayload() {
		final var vo = newVo(List.of("a", "b"));
		Assertions.assertDoesNotThrow(() -> resource.create(vo));
		// Untouched: nothing is derived from the payload
		Assertions.assertEquals("Some description", vo.getDescription());
		Assertions.assertEquals(List.of("a", "b"), vo.getTags());
	}

	@Test
	void updateDropsThePayload() {
		final var vo = newVo(null);
		vo.setId(3);
		Assertions.assertDoesNotThrow(() -> resource.update(vo));
		Assertions.assertNull(vo.getTags());
	}
}
