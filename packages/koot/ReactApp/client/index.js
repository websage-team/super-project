import {
    localeId as LocaleId,
    store as Store,
    history as History
} from '../../index'


// ----------------------------------------------------------------------------


import * as fullConfig from '__KOOT_PROJECT_CONFIG_FULL_PATHNAME__'

import React from 'react'
import { hydrate } from 'react-dom'
import { syncHistoryWithStore } from 'react-router-redux'

import validateRouterConfig from '../../React/validate/router-config'
import { actionUpdate } from '../../React/realtime-location'
import Root from '../../React/root.jsx'

import i18nRegister from '../../i18n/register/isomorphic.client'

let logCountRouterUpdate = 0
let logCountHistoryUpdate = 0


// ----------------------------------------------------------------------------


/**
 * 判断变量是否是 Promise
 * @param {*} v 
 * @returns {Boolean}
 */
const isPromise = (v) => {
    return (typeof v === 'object' && typeof v.before === 'function')
}

/**
 * 处理生命周期方法，返回 Promise
 * @param {Function|Promise} func 
 * @returns {Promise}
 */
const parseLifecycleMethod = (func) => {

    /** @type {Object} 生命周期方法传入的参数 */
    const argsLifecycle = {
        store: Store,
        history: History,
        localeId: LocaleId
    }

    if (typeof func === 'function') {
        const result = func(argsLifecycle)
        if (isPromise(result))
            return result
        return new Promise(resolve => resolve())
    }

    if (isPromise(func))
        return func

    return new Promise(resolve => resolve())

}


// ----------------------------------------------------------------------------


const {
    router: routerConfig,
    client: clientConfig = {}
} = fullConfig

const {
    before,
    after,
} = clientConfig
const onRouterUpdate = clientConfig.routerUpdate || clientConfig.onRouterUpdate
const onHistoryUpdate = clientConfig.historyUpdate || clientConfig.onHistoryUpdate

/** @type {Object} 路由配置 */
const routes = validateRouterConfig(routerConfig)
/** @type {Object} 路由根组件 props */
const routerProps = {
    onUpdate: (...args) => {
        if (__DEV__ && logCountRouterUpdate < 2) {
            console.log(
                `🚩 [koot/client] ` +
                `callback: onRouterUpdate`,
                ...args
            )
            logCountRouterUpdate++
        }
        // if (__DEV__) console.log('router onUpdate', self.__LATHPATHNAME__, location.pathname)
        if (typeof onRouterUpdate === 'function')
            onRouterUpdate(...args)
    }
}

// 从 SSR 结果中初始化当前环境的语种
i18nRegister()

// 客户端流程正式开始
// 生命周期: 客户端流程正式开始前
if (__DEV__)
    console.log(
        `🚩 [koot/client] ` +
        `callback: before`
    )
parseLifecycleMethod(before)
    .then(() => {
        History.listen(location => {
            // 回调: browserHistoryOnUpdate
            // 正常路由跳转时，URL发生变化后瞬间会触发，顺序在react组件读取、渲染之前
            // if (__DEV__) {
            //     console.log('🌏 browserHistory update', location)
            // }
            Store.dispatch(actionUpdate(location))

            if (__DEV__ && logCountHistoryUpdate < 2) {
                console.log(
                    `🚩 [koot/client] ` +
                    `callback: onHistoryUpdate`,
                    [location, Store]
                )
                logCountHistoryUpdate++
            }

            if (typeof onHistoryUpdate === 'function')
                onHistoryUpdate(location, Store)
        })

        const thisHistory = syncHistoryWithStore(History, Store)

        // require('react-router/lib/match')({ history, routes }, (err, ...args) => {
        //     console.log({ err, ...args })
        //     if (err) {
        //         console.log(err.stack)
        //     }
        // })
        return hydrate(
            <Root
                store={Store}
                history={thisHistory}
                routes={routes}
                // onError={(...args) => console.log('route onError', ...args)}
                // onUpdate={(...args) => console.log('route onUpdate', ...args)}
                {...routerProps}
            />,
            document.getElementById('root')
        )
    })
    .then(() => {
        // 生命周期: 客户端流程结束
        if (__DEV__) {
            console.log(
                `🚩 [koot/client] ` +
                `callback: after`
            )
        }
    })
    .then(parseLifecycleMethod(after))
