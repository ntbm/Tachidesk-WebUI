/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Link, LinkProps, useLocation } from 'react-router-dom';
import React from 'react';

export default function LinkWithQuery(props: LinkProps) {
    const { search } = useLocation();
    const { to } = props;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Link {...props} to={to + search} />;
}
