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

import userEvent from '@testing-library/user-event';
import React from 'react';

import { EditorImageField } from '@/components/EditorSelector/Definition/ImageField';
import getComponentRenderer, { screen } from '@/services/__mocks__/getComponentRenderer';

const { createSnapshot, renderComponent } = getComponentRenderer(getComponent);

const mockOnChange = jest.fn();

describe('EditorDefinitionField', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('snapshot', () => {
    const snapshot = createSnapshot();
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  test('image change', async () => {
    renderComponent();

    const input = screen.getByRole('textbox');

    const editorId = 'editor-image';
    await userEvent.click(input);
    await userEvent.paste(editorId);

    expect(mockOnChange).toHaveBeenNthCalledWith(1, editorId);

    userEvent.clear(input);
    expect(mockOnChange).toHaveBeenNthCalledWith(2, undefined);
  });
});

function getComponent() {
  return <EditorImageField onChange={mockOnChange} />;
}
