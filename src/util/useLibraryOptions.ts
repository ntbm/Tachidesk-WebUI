/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { BooleanParam, useQueryParam } from 'use-query-params';

export type NullAndUndefined<T> = T | null | undefined;

interface IUseLibraryOptions {
    unread: NullAndUndefined<boolean>
    setUnread: (unread: NullAndUndefined<boolean>) => void
}

export default function useLibraryOptions(): IUseLibraryOptions {
    const [unread, setUnread] = useQueryParam('unread', BooleanParam);
    return {
        unread, setUnread,
    };
}
