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
    const { categoryOrder: orderFromParams } = useParams<{ categoryOrder: string }>();
    const categoryOrder = parseInt(orderFromParams, 10);
    const invalidSelection = Number.isNaN(categoryOrder)
        || !categories
        || categories.filter((c) => c.category.order === categoryOrder).length === 0;
    const categoryIndex = categories.findIndex((c) => c.category.order === categoryOrder);
    if (invalidSelection) {
        return <Redirect to="/library" />;
    }
    const { unread } = useLibraryOptions();
    const mangas = categories[categoryIndex].mangas
        .filter((manga) => {
            switch (unread) {
                case true:
                    return !!manga.unreadCount && manga.unreadCount >= 1;
                case false:
                    return manga.unreadCount === 0;
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
