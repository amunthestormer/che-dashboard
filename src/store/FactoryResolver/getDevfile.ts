/*
 * Copyright (c) 2018-2021 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { FactoryResolver, DevfileV2ProjectSource } from '../../services/helpers/types';
import { isDevfileV2 } from '../../services/workspaceAdapter';
import { getProjectName } from '../../services/helpers/getProjectName';

/**
 * Returns a devfile from the FactoryResolver object.
 * @param data a FactoryResolver object.
 */
export function getDevfile(data: FactoryResolver): api.che.workspace.devfile.Devfile {
  let devfile = data.devfile;

  if (isDevfileV2(devfile)) {
    // temporary solution for fix che-server serialisation bug with empty volume
    const components = devfile.components.map(component => {
      if (Object.keys(component).length === 1 && component.name) {
        component.volume = {};
      }
      return component;
    }) || [];
    devfile = Object.assign(devfile, { components });
    // add a default project
    const projects: DevfileV2ProjectSource[] = [];
    const scmInfo = data['scm_info'];
    if (!devfile.projects?.length && scmInfo) {
      const origin = scmInfo['clone_url'];
      const name = getProjectName(origin);
      const revision = scmInfo.branch;
      const project: DevfileV2ProjectSource = { name, git: { remotes: { origin } } };
      if (revision) {
        project.git.checkoutFrom = { revision };
      }
      projects.push(project);
      devfile = Object.assign({ projects }, devfile);
    }
  }

  return devfile;
}
