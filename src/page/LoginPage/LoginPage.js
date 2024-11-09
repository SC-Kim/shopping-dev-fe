import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./style/login.style.css";
import { loginWithEmail, loginWithGoogle } from "../../features/user/userSlice";
import { clearErrors } from "../../features/user/userSlice";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginError } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  // useEffect(() => {
  //   if (loginError) {
  //     dispatch(clearErrors());
  //   }
  // }, [loginError]);
  
  useEffect(() => {
    if (user) {
      navigate("/"); // user가 존재할 때만 리다이렉트
    }
  }, [user, navigate]);

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    //구글 로그인 하기
    dispatch(loginWithGoogle(googleData.credential))
  };

  const handleGoogleLoginError = () => {
    document.getElementById("googleErrorMessage").innerText = "구글 로그인에 실패했습니다. 다시 시도해 주세요.";
  };

  // if (token) {
  //   sessionStorage.setItem("token", token);
  // }
  return (
    <>
      <Container className="login-area">
        {loginError && (
          <div className="error-message">
            <Alert variant="danger">{loginError}</Alert>
          </div>
        )}
        <div id="googleErrorMessage" className="error-message">
          {/* Google 로그인 오류 메시지가 여기에 표시됩니다. */}
        </div>
        <Form className="login-form" onSubmit={handleLoginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit">
              Login
            </Button>
            <div>
              아직 계정이 없으세요?<Link to="/register">회원가입 하기</Link>{" "}
            </div>
          </div>

          <div className="text-align-center mt-2">
            <p>-외부 계정으로 로그인하기-</p>
            <div className="display-center">
              {/*
              1. 구글 로그인 버튼 가져오기 
              2. Oauth 로그인을 위해서 google api 사이트에 가입하고 클라이언트키, 시크릿키 받아오기 
              3. 로그인 
              4. 백엔드에서 로그인 하기 (토큰값 읽어와서 유저 정보를 뽑아내고 email )
                 a. 이미 로그인을 한 적이 있는 유저 --> 로그인 시키고 토큰값 주면 장땡
                 b. 처음 로그인 시도를 한 유저 (데이터베이스에 없다.) -> 유저 정보 새로 생성 --> 토큰값 넘긴다 
               */}
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={handleGoogleLoginError} // 실패 시 오류 메시지 표시
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
