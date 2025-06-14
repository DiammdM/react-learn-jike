import logo from '@/assets/logo.png'
import { setToken as setStoreToken } from '@/store/modules/user'
import { request, setToken } from '@/utils'
import { Button, Card, Form, Input, message } from 'antd'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './index.scss'

const Login = () => {
    const navigate = useNavigate();
    const dispath = useDispatch();

    const onFinish = async (values) => {
        const res = await request.post('/authorizations', values);
        setToken(res.data.token);
        await dispath(setStoreToken(res.data.token));
        navigate("/");
        message.success('登录成功')
    }
    return (
        <div className="login">
            <Card className="login-container">
                <img className="login-logo" src={logo} alt="" />
                {/* 登录表单 */}
                <Form onFinish={onFinish} validateTrigger='onBlur'>
                    <Form.Item
                        name='mobile'
                        rules={[{
                            required: true,
                            message: '请输入手机号'
                        }, {
                            pattern: /^1[3-9]\d{9}$/,
                            message: '请输入有效的手机号'
                        }]}
                    >
                        <Input size="large" placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item
                        name='code'
                        rules={[{
                            required: true,
                            message: '请输入验证码'
                        }]}
                    >
                        <Input size="large" placeholder="请输入验证码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login