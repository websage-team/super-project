import React, { Component } from 'react';
import { extend } from 'koot';
import API from '@utils/api';
import http from '@utils/http';
import Header from '@modules/header';
import Slider from '@components/slider';
import classnames from 'classnames';

class PageHome extends Component {
    componentDidMount() {
        // if (__CLIENT__) {
        //     const header = document.getElementsByTagName('header')[0];
        //     const scrollHeight = window.scrollY;
        //     if (scrollHeight == 0) {
        //         header.style.position = 'static';
        //     }
        // }
        http.get(API.ACCOUNT.getList(), { params: { project_id: 61 } })
            .then(resp => {
                console.log('请求成功 ====> ', resp.data.categories);
            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        return (
            <div className={classnames('home', this.props.className)}>
                <Header />
                <section>
                    <Slider />
                </section>
            </div>
        );
    }
}

export default extend({
    connect: true,
    pageinfo: () => ({
        title: `${__('pages.home.title')} - ${__('title')}`,
        metas: [{ description: __('pages.home.description') }],
    }),
    styles: require('./styles.module.less'),
})(PageHome);