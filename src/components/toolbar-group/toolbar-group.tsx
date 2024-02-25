import React from 'react';
import { effect, signal } from '@preact/signals-react';
import './toolbar-group.scss';

export type ToolbarGroupProps = {
    position?: 'top' | 'bottom' | 'left' | 'right';
    children?: any;
};

enum CLASS {
    HORIZONTAL_TOP = 'h-top',
    HORIZONTAL_BOTTOM = 'h-bottom',
    VERTICAL_LEFT = 'v-left',
    VERTICAL_RIGHT = 'v-right'
}

const domClass = signal(CLASS.VERTICAL_LEFT);

const ToolbarGroup: React.FC<ToolbarGroupProps> = (
    props: ToolbarGroupProps
) => {
    const { position = 'bottom', children } = props;

    effect(() => {
        if (position === 'top') {
            domClass.value = CLASS.HORIZONTAL_TOP;
        } else if (position === 'right') {
            domClass.value = CLASS.VERTICAL_RIGHT;
        } else if (position === 'left') {
            domClass.value = CLASS.VERTICAL_LEFT;
        } else {
            domClass.value = CLASS.HORIZONTAL_BOTTOM;
        }
    });

    return <div className={`toolbar-group ${domClass.value}`}>{children}</div>;
};

export default ToolbarGroup;
