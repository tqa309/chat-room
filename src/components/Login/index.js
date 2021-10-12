import React from 'react'
import { Row, Col, Typography, Button } from 'antd'
import firebase, { auth } from '../firebase/config'
import { useHistory } from 'react-router-dom'

const { Title } = Typography

const fbProvider = new firebase.auth.FacebookAuthProvider()

export default function Login() {
    const handleFbLogin = () => {
        auth.signInWithPopup(fbProvider)
    }

    return (
        <div>
            <Row justify="center" style={{ height: 800 }}>
                <Col span={8}>
                    <Title level={3} style={{ textAlign: 'center' }}>
                        ChatRoom
                    </Title>
                    <Button style={{ width: '100%', marginBottom: 5 }}>
                        Đăng nhập bằng Google
                    </Button>
                    <Button style={{ width: '100%' }} onClick={handleFbLogin}>
                        Đăng nhập bằng Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    )
}
