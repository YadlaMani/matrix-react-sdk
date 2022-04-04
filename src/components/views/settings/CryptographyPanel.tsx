/*
Copyright 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { ComponentType } from 'react';

import { MatrixClientPeg } from '../../../MatrixClientPeg';
import { _t } from '../../../languageHandler';
import Modal from '../../../Modal';
import { replaceableComponent } from "../../../utils/replaceableComponent";
import AccessibleButton from "../elements/AccessibleButton";
import * as FormattingUtils from "../../../utils/FormattingUtils";

interface IProps {
}

interface IState {
}

@replaceableComponent("views.settings.CryptographyPanel")
export default class CryptographyPanel extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render(): JSX.Element {
        const client = MatrixClientPeg.get();
        const deviceId = client.deviceId;
        let identityKey = client.getDeviceEd25519Key();
        if (!identityKey) {
            identityKey = _t("<not supported>");
        } else {
            identityKey = FormattingUtils.formatCryptoKey(identityKey);
        }

        let importExportButtons = null;
        if (client.isCryptoEnabled()) {
            importExportButtons = (
                <div className='mx_CryptographyPanel_importExportButtons'>
                    <AccessibleButton kind='primary' onClick={this.onExportE2eKeysClicked}>
                        { _t("Export E2E room keys") }
                    </AccessibleButton>
                    <AccessibleButton kind='primary' onClick={this.onImportE2eKeysClicked}>
                        { _t("Import E2E room keys") }
                    </AccessibleButton>
                </div>
            );
        }

        return (
            <div className='mx_SettingsTab_section mx_CryptographyPanel'>
                <span className='mx_SettingsTab_subheading'>{ _t("Cryptography") }</span>
                <table className='mx_SettingsTab_subsectionText mx_CryptographyPanel_sessionInfo'>
                    <tbody>
                        <tr>
                            <td>{ _t("Session ID:") }</td>
                            <td><code>{ deviceId }</code></td>
                        </tr>
                        <tr>
                            <td>{ _t("Session key:") }</td>
                            <td><code><b>{ identityKey }</b></code></td>
                        </tr>
                    </tbody>
                </table>
                { importExportButtons }
            </div>
        );
    }

    private onExportE2eKeysClicked = (): void => {
        Modal.createTrackedDialogAsync('Export E2E Keys', '',
            import(
                '../../../async-components/views/dialogs/security/ExportE2eKeysDialog'
            ) as unknown as Promise<ComponentType<{}>>,
            { matrixClient: MatrixClientPeg.get() },
        );
    };

    private onImportE2eKeysClicked = (): void => {
        Modal.createTrackedDialogAsync('Import E2E Keys', '',
            import(
                '../../../async-components/views/dialogs/security/ImportE2eKeysDialog'
            ) as unknown as Promise<ComponentType<{}>>,
            { matrixClient: MatrixClientPeg.get() },
        );
    };
}