// 移动端导航
import React, { Component, Fragment } from 'react';
import { extend, store } from 'koot';
import { slide as Menu } from 'react-burger-menu';
import classnames from 'classnames';
import { Link } from 'react-router';
// import queryString from 'query-string';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import config from './config';
import routerConfig from '@routes/config.js';

class MobileNav extends Component {
    state = {
        // currentPath: '',
        isMenuOpen: false,
    };
    componentDidMount() {
        // this.setState(
        //     {
        //         currentPath: store.getState().routing.locationBeforeTransitions.pathname,
        //     },
        //     () => {
        //         console.log(store.getState().routing);
        //     }
        // );
    }
    componentWillUpdate(currentProps) {
        // console.log('++++++++++', store.getState().routing.locationBeforeTransitions);
    }

    // 点击展开下拉
    changeMenuOpen = (item, isMore) => {
        if (isMore) {
            this.setState({
                [item.name]: !this.state[item.name],
                isMenuOpen: true,
            });
            return;
        }

        // 关闭侧边导航 和 所有下拉
        const wrap = {};
        config.map((item, index) => {
            return (wrap[item.name] = false);
        });
        this.setState({
            isMenuOpen: false,
            ...wrap,
        });
    };

    renderList = (data, isMore) => {
        const navLink = (item, hasDropdown) => {
            return (
                <Fragment>
                    <Link
                        to={item.link}
                        rel="noopener noreferrer"
                        className={classnames({ 'select-nav-dropdown': hasDropdown })}
                        onClick={e => {
                            this.changeMenuOpen(item, hasDropdown);
                        }}
                    >
                        {item.name}
                        {hasDropdown && (
                            <span className="select-nav-dropdown-icon">
                                {__CLIENT__ && <ArrowDropDown />}
                            </span>
                        )}
                    </Link>
                </Fragment>
            );
        };
        return data.map((item, index) => {
            return (
                <li
                    key={index}
                    className={classnames(
                        'flex-center',
                        !isMore ? 'nav-item' : 'select-nav-item',
                        item.more ? 'hasSelect' : '',
                        this.state[item.name] ? 'active' : ''
                    )}
                >
                    {!item.more ? (
                        navLink(item)
                    ) : (
                        <Fragment>
                            {navLink(item, true)}
                            <ul className="select-nav-wrap">{this.renderList(item.more, true)}</ul>
                        </Fragment>
                    )}
                </li>
            );
        });
    };
    render() {
        const { renderList } = this;
        const { isMenuOpen } = this.state;

        return (
            <nav className={this.props.className}>
                {/* pc导航 */}
                <div className="pc-nav">
                    <ul className="flex-center default-nav-list">{renderList(config)}</ul>
                </div>
                {/* mobile导航 */}
                <div className="mobile-nav">
                    <Menu isOpen={isMenuOpen} right>
                        {renderList(config)}
                    </Menu>
                </div>
            </nav>
        );
    }
}

export default extend({
    styles: require('./styles.module.less'),
})(MobileNav);
