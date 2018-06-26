package org.ligoj.app.plugin.ui;

import org.ligoj.bootstrap.core.plugin.FeaturePlugin;
import org.springframework.stereotype.Component;

/**
 * The common shared UI assets.
 */
@Component
public class UiResource implements FeaturePlugin {

	@Override
	public String getKey() {
		return "feature:ui";
	}

}
