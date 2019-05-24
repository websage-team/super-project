// console.log('router/index.js', {
//     'in __KOOT_SSR__': __KOOT_SSR__.LocaleId
// });

import routeCheck from 'koot/React/route-check'
import Root from '@components/app'

// console.log((typeof Store === 'undefined' ? `\x1b[31m×\x1b[0m` : `\x1b[32m√\x1b[0m`) + ' Store in [routes]')

export default {

    component: Root,
    name: 'app-root',

    indexRoute: {
        getComponent: (nextState, cb) => {
            import(
                /* webpackChunkName: "PageHome" */
                '@views/home'
            ).then(module => {
                if (routeCheck(nextState)) cb(null, module.default);
            })
        }
    },

    childRoutes: (() => {
        const children = [
            {
                path: 'static',
                name: 'Page: Static Assets',
                // component: require('@views/static').default,
                getComponent: (nextState, cb) => {
                    import(
                        /* webpackChunkName: "PageStatic" */
                        '@views/static'
                    ).then(module => {
                        if (routeCheck(nextState)) cb(null, module.default);
                    })
                },
                childRoutes: [{
                    path: ':noComponentGiven'
                }],
            },
            {
                path: 'delayed',
                name: 'Page: Delayed Rendering',
                getComponent: (nextState, cb) => {
                    import(
                        /* webpackChunkName: "PageDelayed" */
                        '@views/delayed'
                    ).then(module => {
                        if (routeCheck(nextState)) cb(null, module.default);
                    })
                }
            }
        ]
        if (!__SPA__) {
            children.push({
                path: 'extend',
                name: 'Page: Component Extender',
                // component: require('@views/extend').default,
                getComponent: (nextState, cb) => {
                    import(
                        /* webpackChunkName: "PageExtend" */
                        '@views/extend'
                    ).then(module => {
                        if (routeCheck(nextState)) cb(null, module.default);
                    })
                }
            })
        }
        return children
    })()

}
