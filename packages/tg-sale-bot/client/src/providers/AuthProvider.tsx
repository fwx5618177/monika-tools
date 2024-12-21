import React, {
  createContext,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkWalletAccount,
  checkTokenWithApi,
  getUserInfo,
} from "@apis/request_api";
import { isTelegramMiniApp } from "@utils/checkEnv";
import { constants } from "@constants/variable";
import {
  RootState,
  login as reduxLogin,
  logout as reduxLogout,
  updateUserInfo as reduxUpdateUserInfo,
  updateTonAddress as reduxUpdateTonAddress,
  selectIsTokenValid,
  persistor,
} from "@store/store";
import { UserInfo } from "@interfaces/api";

interface AuthContextType {
  updateUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
  login: (token: string, tokenTime: string, userInfo: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const isTokenValid = useSelector(selectIsTokenValid);
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前的路由信息
  const tonWalletAddress = useTonAddress(); // 获取 Ton 地址，无论是 Telegram Mini App 还是 H5/PC 都支持
  const [tonConnectUI] = useTonConnectUI();

  // 登出方法
  const logout = useCallback(() => {
    dispatch(reduxLogout());
    persistor.purge();

    if (tonWalletAddress) tonConnectUI.disconnect();

    // 重新导航到登录页面
    navigate("/login");
  }, [dispatch, navigate, tonConnectUI, tonWalletAddress]);

  const updateUserInfo = useCallback(
    (userInfo: UserInfo) => {
      dispatch(reduxUpdateUserInfo(userInfo));
    },
    [dispatch]
  );

  const checkUserInfo = useCallback(async () => {
    if (!authState.userInfo) {
      const userInfo = await getUserInfo();

      updateUserInfo(userInfo);
    }
  }, [authState.userInfo, updateUserInfo]);

  // 处理 Telegram Mini App 或 H5/PC 的 Ton 地址
  useEffect(() => {
    const token = authState.token;

    if (constants.unAuthPaths.includes(location.pathname)) {
      if (token && isTokenValid) {
        console.log("Token is valid, redirect to home page");
        navigate("/home");
      }
      return;
    }

    checkUserInfo();

    if (tonWalletAddress) {
      // 无论是 H5/PC 还是 Telegram Mini App，Ton 地址存在时直接进行认证
      dispatch(reduxUpdateTonAddress(tonWalletAddress));

      if (isTelegramMiniApp()) {
        // TODO: 处理特定的错误码
        checkWalletAccount(tonWalletAddress)
          .then((response) => {
            if (response.exists) {
              dispatch(
                reduxLogin({
                  userInfo: {
                    ...authState.userInfo,
                    username: response.username as string,
                  } as UserInfo,
                  tokenTime: authState.tokenTime!,
                  token: token!,
                })
              );
              if (location.pathname === "/login") {
                navigate("/home"); // 用户已注册，跳转到首页（仅在首次登录时跳转）
              }
            } else {
              navigate(`/register?address=${tonWalletAddress}`);
            }
          })
          .catch(() => logout());
      } else if (token && isTokenValid) {
        dispatch(
          reduxLogin({
            userInfo: authState.userInfo!,
            token,
            tokenTime: authState.tokenTime!,
          })
        );
      } else {
        checkTokenWithApi()
          .then((response) => {
            if (response.valid) {
              dispatch(
                reduxLogin({
                  userInfo: authState.userInfo!,
                  token: token!,
                  tokenTime: authState.tokenTime!,
                })
              );

              if (constants.unAuthPaths.includes(location.pathname)) {
                navigate("/home"); // 验证通过后跳转到首页（仅在首次登录时跳转）
              }
            } else {
              logout();
            }
          })
          .catch(logout);
      }
    }
  }, [
    tonWalletAddress,
    navigate,
    logout,
    location,
    checkUserInfo,
    dispatch,
    isTokenValid,
    authState.token,
    authState.userInfo,
    authState.tokenTime,
  ]);

  // 登录, 塞入 token 和 tokenTime
  const login = useCallback(
    (token: string, tokenTime: string, userInfo: UserInfo) => {
      dispatch(reduxLogin({ userInfo, token, tokenTime }));
    },
    [dispatch]
  );

  return (
    <AuthContext.Provider value={{ updateUserInfo, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
