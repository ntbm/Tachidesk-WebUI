/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Link, LinkProps, useLocation } from 'react-router-dom';
import React from 'react';

interface LinkWithQueryProps extends LinkProps {
    to: string
    replace: boolean
}

function LinkWithQuery(props: LinkWithQueryProps, ref: React.Ref<HTMLAnchorElement>) {
    const { search } = useLocation();
    const { to, replace } = props;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Link {...props} to={to + search} replace={replace} innerRef={ref} />;
}

export default React.forwardRef(LinkWithQuery);
