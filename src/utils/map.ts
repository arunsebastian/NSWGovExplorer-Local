import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Point from '@arcgis/core/geometry/Point';

const _waitLoad = async (layer: __esri.FeatureLayer) => {
    return new Promise((resolve: any, reject: any) => {
        reactiveUtils
            .whenOnce(() => layer.loaded)
            .then(() => {
                resolve(layer);
            })
            .catch(() => {
                reject();
            });
    });
};

export const waitForFeatureLayersLoad = (
    view: __esri.MapView | __esri.SceneView
) => {
    const featureLayers = view.map.allLayers
        .filter((layer: __esri.Layer) => {
            return layer.type === 'feature';
        })
        .toArray() as __esri.FeatureLayer[];
    return Promise.all(
        featureLayers.map((layer: __esri.FeatureLayer) => {
            return _waitLoad(layer);
        })
    ).then(() => {
        return featureLayers;
    });
};

export const refreshLayer = (layer: __esri.FeatureLayer) => {
    return new Promise((resolve: any, reject: any) => {
        if (layer) {
            reactiveUtils
                .whenOnce(() => layer.loaded)
                .then(() => {
                    resolve(layer);
                })
                .catch(() => {
                    reject();
                });
            layer.set(
                'definitionExpression',
                layer.get('_defaultDefinitionExpression')
                    ? layer.get('_defaultDefinitionExpression')
                    : '1=1'
            );
        } else {
            resolve();
        }
    });
};

export const refreshFeatureLayers = (view: __esri.MapView) => {
    const layers = view.map.allLayers
        .filter((layer: __esri.Layer) => {
            return layer.type === 'feature';
        })
        .toArray() as __esri.FeatureLayer[];
    return new Promise((resolve: any, reject: any) => {
        const refreshPromises = [] as any;
        layers.forEach((layer: __esri.FeatureLayer) => {
            refreshPromises.push(refreshLayer(layer));
        });
        Promise.all(refreshPromises)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
};

export const getLayerExtent = (
    layer: __esri.FeatureLayer,
    view: __esri.MapView
) => {
    return new Promise((resolve: any) => {
        if (layer) {
            layer.when(() => {
                const query = layer.createQuery();
                query.outSpatialReference = view.spatialReference;
                layer.queryExtent(query).then((response: any) => {
                    if (response.count > 0 && response.extent) {
                        if (
                            response.extent.width === 0 &&
                            response.extent.height === 0
                        ) {
                            const pt = new Point({
                                x: response.extent.xmax,
                                y: response.extent.ymax,
                                spatialReference: view.spatialReference
                            });
                            const bufferGeom = geometryEngine.buffer(
                                pt,
                                100,
                                'meters'
                            ) as any;
                            resolve(bufferGeom.extent.expand(1.5));
                        } else {
                            resolve(response.extent);
                        }
                    } else {
                        resolve(null);
                    }
                });
            });
        }
    });
};

export const doIntersectQuery = (
    layer: __esri.FeatureLayer,
    view: __esri.MapView,
    geometry: __esri.Geometry
) => {
    return new Promise((resolve, reject) => {
        view.whenLayerView(layer).then((lyrView: __esri.FeatureLayerView) => {
            const query = lyrView.createQuery();
            query.geometry = geometry;
            if (geometry.type === 'point') {
                query.distance = 2;
                query.units = 'meters';
            }
            query.spatialRelationship = 'intersects';
            query.returnGeometry = true;
            query.outFields = ['*'];
            lyrView.queryFeatures(query).then(
                (result: __esri.FeatureSet) => {
                    resolve({
                        layer: layer,
                        features: result.features.reverse()
                    });
                },
                (error: any) => {
                    console.log(error); // Logs the error message
                    reject();
                }
            );
        });
    });
};

export const doAttributeQuery = (
    layer: __esri.FeatureLayer,
    view: __esri.MapView,
    where: string
) => {
    return new Promise((resolve: any, reject: any) => {
        const query = layer.createQuery();
        query.where = where;
        query.returnGeometry = true;
        query.outFields = ['*'];
        query.cacheHint = false;
        query.outSpatialReference = view.spatialReference;
        layer.queryFeatures(query).then(
            (result: __esri.FeatureSet) => {
                resolve({
                    layer: layer,
                    features: result.features.filter(
                        (feature: __esri.Graphic) => {
                            return feature.geometry;
                        }
                    )
                });
            },
            (error: any) => {
                console.error(error);
                reject();
            }
        );
    });
};

export const syncMaps = async (
    source: __esri.MapView | __esri.SceneView,
    target: __esri.MapView | __esri.SceneView
) => {
    if (target) {
        target.ready
            ? await target.goTo(source.viewpoint)
            : (await reactiveUtils.whenOnce(() => target.ready),
              await target.goTo(source.viewpoint));
    }
};

export const isPortalItemId = (id: string) => {
    return /^\d*[a-zA-Z][a-zA-Z\d]*$/.test(id);
};

export const isPortalUrl = (url: string) => {
    // return /^\d*[a-zA-Z][a-zA-Z\d]*$/.test(id);
};

export const isRestServiceUrl = (url: string) => {
    return url.includes('/arcgis/rest/services');
};
