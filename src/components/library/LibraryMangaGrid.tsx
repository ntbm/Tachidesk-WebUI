/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Redirect, useParams } from 'react-router-dom';
import React from 'react';
import MangaGrid, { IMangaGridProps } from '../manga/MangaGrid';
import useLibraryOptions from '../../util/useLibraryOptions';

interface IMangaCategory {
    category: ICategory
    mangas: IManga[]
    isFetched: boolean
}

type MangaGridWrapperProps =
    Omit<Omit<IMangaGridProps, 'mangas'>, 'isLoading'>
    & {
        categories: IMangaCategory[]
    };
export default function LibraryMangaGrid(props: MangaGridWrapperProps) {
    const {
        categories,
        message,
        messageExtra,
        hasNextPage,
        lastPageNum,
        setLastPageNum,
    } = props;
    const { categoryOrder } = useParams<{ categoryOrder: string }>();
    const categoryIndex = parseInt(categoryOrder, 10);
    const invalidSelection = Number.isNaN(categoryIndex)
        || !categories
        || !categories[categoryIndex];
    if (invalidSelection) {
        return <Redirect to="/library" />;
    }
    const { unread } = useLibraryOptions();
    const mangas = categories[categoryIndex].mangas
        .filter((manga) => {
            switch (unread) {
                case true:
                    return !!manga.unread_count && manga.unread_count >= 1;
                case false:
                    return manga.unread_count === 0;
                default:
                    return true;
            }
        });

    return (
        <MangaGrid
            mangas={mangas}
            isLoading={!categories[categoryIndex].isFetched}
            message={message}
            messageExtra={messageExtra}
            hasNextPage={hasNextPage}
            lastPageNum={lastPageNum}
            setLastPageNum={setLastPageNum}
        />
    );
}
