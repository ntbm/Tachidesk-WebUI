/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Checkbox } from '@mui/material';
import React, {
    useEffect, useState,
} from 'react';
import ClearIcon from '@mui/icons-material/Clear';

export interface IThreeStateCheckboxProps {
    name: string
    checked: boolean | undefined | null
    onChange: (change: boolean | undefined | null) => void
}

enum CheckState {
    SELECTED, INTERMEDIATE, UNSELECTED,
}

function checkedToState(checked: boolean | undefined | null): CheckState {
    switch (checked) {
        case true:
            return CheckState.SELECTED;
        case false:
            return CheckState.INTERMEDIATE;
        default:
            return CheckState.UNSELECTED;
    }
}
function stateToChecked(state: CheckState): boolean | undefined {
    switch (state) {
        case CheckState.SELECTED:
            return true;
        case CheckState.INTERMEDIATE:
            return false;
        default:
        case CheckState.UNSELECTED:
            return undefined;
    }
}
function stateTransition(state: CheckState): CheckState {
    switch (state) {
        case CheckState.SELECTED:
            return CheckState.INTERMEDIATE;
        case CheckState.INTERMEDIATE:
            return CheckState.UNSELECTED;
        case CheckState.UNSELECTED:
        default:
            return CheckState.SELECTED;
    }
}

const ThreeStateCheckbox = (props: IThreeStateCheckboxProps) => {
    const {
        name, checked, onChange,
    } = props;
    const [localChecked, setLocalChecked] = useState(checkedToState(checked));
    useEffect(() => setLocalChecked(checkedToState(checked)), [checked]);
    const handleChange = () => {
        setLocalChecked(stateTransition(localChecked));
        if (onChange) {
            onChange(stateToChecked(stateTransition(localChecked)));
        }
    };
    return (
        <Checkbox
            name={name}
            checked={localChecked === CheckState.SELECTED}
            indeterminate={localChecked === CheckState.INTERMEDIATE}
            indeterminateIcon={<ClearIcon />}
            onChange={handleChange}
            className={`${localChecked}`}
            {...{ props }}
        />
    );
};
export default ThreeStateCheckbox;
