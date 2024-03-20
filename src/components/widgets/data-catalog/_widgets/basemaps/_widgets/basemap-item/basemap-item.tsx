import React from 'react';
import classNames from 'classnames';

const noPreviewImg = require('@assets/images/no-preview.png');
import './basemap-item.scss';

type BasemapItemProps = {
    context?: string;
    item: __esri.Basemap;
    onBasemapItemClicked?: (item: __esri.Basemap) => void;
};

const BasemapItem: React.FC<BasemapItemProps> = ({
    item,
    context,
    onBasemapItemClicked
}: BasemapItemProps) => {
    const handleBasemapItemClicked = () => {
        onBasemapItemClicked && onBasemapItemClicked(item);
    };

    return (
        item && (
            <div className='basemap-item' onClick={handleBasemapItemClicked}>
                <span
                    className={classNames('selection-bar', {
                        selected: (item as any).selected
                    })}
                ></span>
                <img src={item.thumbnailUrl ?? noPreviewImg} alt={item.title} />
                <span className='basemap-item-title'>{item.title}</span>
            </div>
        )
    );
};
export default BasemapItem;
