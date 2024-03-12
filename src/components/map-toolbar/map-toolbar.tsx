import React, { useEffect, useRef } from 'react';
import './map-toolbar.scss';

export type MapToolbarProps = {
    position?: 'top' | 'bottom' | 'left' | 'right';
    children?: any;
};

enum CLASS {
    HORIZONTAL_TOP = 'h-top',
    HORIZONTAL_BOTTOM = 'h-bottom',
    VERTICAL_LEFT = 'v-left',
    VERTICAL_RIGHT = 'v-right'
}

const MapToolbar: React.FC<MapToolbarProps> = (props: MapToolbarProps) => {
    const { position = 'bottom', children } = props;
    const domClassRef = useRef<string>(CLASS.HORIZONTAL_BOTTOM);

    useEffect(() => {
        if (position === 'top') {
            domClassRef.current = CLASS.HORIZONTAL_TOP;
        } else if (position === 'right') {
            domClassRef.current = CLASS.VERTICAL_RIGHT;
        } else if (position === 'left') {
            domClassRef.current = CLASS.VERTICAL_LEFT;
        } else {
            domClassRef.current = CLASS.HORIZONTAL_BOTTOM;
        }
    }, [position]);

    return (
        <div className={`map-toolbar ${domClassRef.current}`}>{children}</div>
    );
};

export default MapToolbar;
