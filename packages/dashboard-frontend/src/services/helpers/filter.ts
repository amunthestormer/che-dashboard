/*
 * Copyright (c) 2018-2024 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

export default function match(value: string, tokens: string): boolean {
  return tokens
    .trim()
    .toLowerCase()
    .split(/\W+/)
    .every(token =>
      value
        .trim()
        .toLowerCase()
        .split(/\W+/)
        .some(word => word.startsWith(token)),
    );
}
