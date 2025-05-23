// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { i18nReact } from '../../../../../../utils/i18nReact';
import useSaveData from '../../../../../../utils/hooks/useSaveData/useSaveData';
import { ActionType } from '../FileAndFolderActions.util';
import { BULK_COPY_API_URL, BULK_MOVE_API_URL } from '../../../../api';
import FileChooserModal from '../../../../FileChooserModal/FileChooserModal';
import { FileStats, StorageDirectoryTableData } from '../../../../types';

interface MoveCopyModalProps {
  isOpen?: boolean;
  action: ActionType.Copy | ActionType.Move;
  currentPath: FileStats['path'];
  files: StorageDirectoryTableData[];
  onSuccess: () => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

const MoveCopyModal = ({
  isOpen = true,
  action,
  currentPath,
  files,
  onSuccess,
  onError,
  onClose
}: MoveCopyModalProps): JSX.Element => {
  const { t } = i18nReact.useTranslation();

  const { save } = useSaveData(undefined, {
    skip: !files.length,
    onSuccess: onSuccess,
    onError: onError
  });

  const handleCopyOrMove = async (destination_path: string) => {
    const url = {
      [ActionType.Copy]: BULK_COPY_API_URL,
      [ActionType.Move]: BULK_MOVE_API_URL
    }[action];

    if (!url) {
      return;
    }

    const formData = new FormData();
    files.forEach(selectedFile => {
      formData.append('source_path', selectedFile.path);
    });
    formData.append('destination_path', destination_path);

    return save(formData, { url });
  };

  return (
    <FileChooserModal
      onClose={onClose}
      onSubmit={handleCopyOrMove}
      showModal={isOpen}
      title={action === ActionType.Move ? t('Move to') : t('Copy to')}
      sourcePath={currentPath}
      submitText={action === ActionType.Move ? t('Move') : t('Copy')}
    />
  );
};

export default MoveCopyModal;
