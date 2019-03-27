// 移动端导航
import React, { Component, Fragment } from 'react';
import { extend } from 'koot';
import { slide as Menu } from 'react-burger-menu';
import classnames from 'classnames';
import { Link } from 'react-router';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

const config = [
    {
        name: '首页',
        link: '/home',
    },
    {
        name: '新闻页',
        link: '/news',
    },
    {
        name: '关于',
        link: '/',
        more: [
            {
                name: '关于关于关于',
                link: '/about-1',
            },
            {
                name: '关于关于关于',
                link: '/about-1',
            },
            {
                name: '关于关于关于',
                link: '/about-1',
            },
            {
                name: '关于-2关于-1',
                link: '/about-2',
            },
            {
                name: '关于-2关于-1',
                link: '/about-2',
            },
            {
                name: '关于-2关于-1',
                link: '/about-2',
            },
        ],
    },
];
class MobileNav extends Component {
    state = {};
    selectDropdownAddClass = id => {
        this.setState({
            [id]: !this.state[id],
        });
    };
    renderList = (data, isMore) => {
        const navLink = (item, hasDropdown) => {
            return (
                <Fragment>
                    <Link
                        to={item.link}
                        rel="noopener noreferrer"
                        className={classnames({ 'select-nav-dropdown': !!hasDropdown })}
                    >
                        {item.name}
                    </Link>
                    {!!hasDropdown && (
                        <span className="select-nav-dropdown-icon">
                            {__CLIENT__ && <ArrowDropDown />}
                        </span>
                    )}
                </Fragment>
            );
        };
        return data.map((item, index) => {
            return (
                <li
                    key={index}
                    onClick={item.more && this.selectDropdownAddClass.bind(this, item.name)}
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
                            {navLink(item, 1)}
                            <ul className="select-nav-wrap">
                                {this.renderList(item.more, 'more')}
                            </ul>
                        </Fragment>
                    )}
                </li>
            );
        });
    };
    render() {
        const { renderList } = this;
        return (
            <nav className={this.props.className}>
                {/* pc导航 */}
                <div className="pc-nav">
                    <ul className="flex-center default-nav-list">{renderList(config)}</ul>
                </div>
                {/* mobile导航 */}
                <div className="mobile-nav">
                    <Menu right>{renderList(config)}</Menu>
                </div>
            </nav>
        );
    }
}

export default extend({
    styles: require('./styles.module.less'),
})(MobileNav);