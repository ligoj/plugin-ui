package org.ligoj.app.plugin.ui.demo;

import java.util.List;

import org.ligoj.app.resource.project.ProjectEditionVo;

import lombok.Getter;
import lombok.Setter;

/**
 * Payload accepted by the demo project endpoint: the standard project fields plus the data added by the demo
 * extension of the project dialog. This is the point of the demo: a plugin's own endpoint accepts a more complete
 * payload than the standard project API.
 */
@Getter
@Setter
public class DemoProjectEditionVo extends ProjectEditionVo {

	private static final long serialVersionUID = 1L;

	/**
	 * Tags typed in the demo section of the project dialog, parsed by the demo extension. Optional.
	 */
	private List<String> tags;
}
