/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React, { useContext, useEffect, useState } from 'react';
import NavbarContext from 'context/NavbarContext';
import client from 'util/client';
import cloneObject from 'util/cloneObject';
import EmptyView from 'components/EmptyView';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import {
    Redirect, Route, Switch, useLocation, useRouteMatch,
} from 'react-router-dom';
import { Tab, Tabs } from '@mui/material';
import LibraryMangaGrid from '../../components/library/LibraryMangaGrid';
import LinkWithQuery from '../../components/util/LinkWithQuery';
import LibraryOptions from '../../components/library/LibraryOptions';

interface IMangaCategory {
    category: ICategory
    mangas: IManga[]
    isFetched: boolean
}

export default function Library() {
    const {
        path, // "/library" Mount Point
        url,
    } = useRouteMatch();
    const { pathname } = useLocation(); // /library/:id maybe /library/:id/sub/path later
    const categoryOrder = pathname
        .replace(`${path}/`, '')
        .split('/')[0];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
        setTitle,
        setAction,
    } = useContext(NavbarContext);
    useEffect(() => {
        setTitle('Library');
        setAction(<><LibraryOptions /></>);
    }, []);
    const [categories, setCategories] = useState<IMangaCategory[]>();

    // a hack so MangaGrid doesn't stop working. I won't change it in case
    // if I do manga pagination for library..
    const [lastPageNum, setLastPageNum] = useState<number>(1);

    useEffect(() => {
        client.get('/api/v1/category')
            .then((response) => response.data)
            .then((_categories: ICategory[]) => {
                const categoryTabs = _categories.map((category) => ({
                    category,
                    mangas: [] as IManga[],
                    isFetched: false,
                }));

                setCategories(categoryTabs);
            });
    }, []);

    // fetch the current tab
    useEffect(() => {
        if (categories !== undefined) {
            categories.forEach((tab, index) => {
                if (tab.category.order === parseInt(categoryOrder, 10) && !tab.isFetched) {
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    client.get(`/api/v1/category/${tab.category.id}`)
                        .then((response) => response.data)
                        .then((data: IManga[]) => {
                            const tabsClone = cloneObject(categories);
                            tabsClone[index].mangas = data;
                            tabsClone[index].isFetched = true;

                            setCategories(tabsClone);
                        });
                }
            });
        }
    }, [categories?.length, categoryOrder]);

    if (categories === undefined) {
        return <LoadingPlaceholder />;
    }

    if (categories.length === 0) {
        return <EmptyView message="Your Library is empty" />;
    }

    const TabBar = (props: { selectedTab: string }) => {
        const { selectedTab } = props;

        // Visual Hack: 160px is min-width for viewport width of >600
        const scrollableTabs = window.innerWidth < categories.length * 160;
        if (!categories || categories.length < 2 || Number.isNaN(parseInt(selectedTab, 10))) {
            return null;
        }

        const tabDefines = categories.map((tab) => (
            <Tab
                label={tab.category.name}
                value={tab.category.order}
                key={tab.category.order}
                component={LinkWithQuery}
                to={`${path}/${tab.category.order}`}
                replace
            />
        ));

        return (
            <Tabs
                key={selectedTab}
                value={parseInt(selectedTab, 10)}
                indicatorColor="primary"
                textColor="primary"
                centered={!scrollableTabs}
                variant={scrollableTabs ? 'scrollable' : 'fullWidth'}
                scrollButtons
                allowScrollButtonsMobile
            >
                {tabDefines}
            </Tabs>
        );
    };

    return (
        <>
            <TabBar selectedTab={categoryOrder} />
            <Switch>
                <Route path={`${path}/:categoryOrder`}>
                    <LibraryMangaGrid
                        hasNextPage={false}
                        lastPageNum={lastPageNum}
                        setLastPageNum={setLastPageNum}
                        categories={categories}
                    />
                </Route>
                <Route>
                    <Redirect
                        push={false}
                        to={`${url}/${categories[0].category.order}`}
                    />
                </Route>
            </Switch>
        </>
    );
}
