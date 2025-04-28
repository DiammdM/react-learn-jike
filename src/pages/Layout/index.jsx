import { getUserInfo } from '@/apis/user'
import { clearUserInfo, setUserInfo } from '@/store/modules/user'
import {
    DiffOutlined,
    EditOutlined,
    HomeOutlined,
    LogoutOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Popconfirm } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './index.scss'

const { Header, Sider } = Layout

const items = [
    {
        label: '首页',
        key: '/home',
        icon: <HomeOutlined />,
    },
    {
        label: '文章管理',
        key: '/article',
        icon: <DiffOutlined />,
    },
    {
        label: '创建文章',
        key: '/publish',
        icon: <EditOutlined />,
    },
]

const GeekLayout = () => {
    const nagigate = useNavigate();
    const dispath = useDispatch();
    const location = useLocation();
    const user = useSelector(state => state.user.userInfo);
    const selectedkey = location.pathname

    useEffect(() => {
        (async () => {
            const user = await getUserInfo();
            dispath(setUserInfo(user.data))
        })()

    }, [dispath])

    const logout = () => {
        dispath(clearUserInfo());
        nagigate("/login");
    }
    const changePage = (e) => {
        nagigate(e.key)
    }

    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-logout">
                        <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={logout}>
                            <LogoutOutlined /> 退出
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        selectedKeys={selectedkey}
                        onClick={changePage}
                        items={items}
                        style={{ height: '100%', borderRight: 0 }}></Menu>
                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}>
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    )
}
export default GeekLayout