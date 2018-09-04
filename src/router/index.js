import Vue from "vue";
import Router from "vue-router";
import Layout from "@/components/layout/layout.vue";
import Home from "@/components/home/Home.vue";
import LoginReg from "@/components/common/loginReg.vue";
import Login from "@/components/common/login.vue";
import Register from "@/components/common/register.vue";
import RegisterSuccess from "@/components/common/registerSuccess.vue";
import ForgetPsw from "@/components/common/forgetPsw.vue";
import RestLoginPsw from "@/components/common/restLoginPsw.vue";
import demo from "@/components/common/restLoginPsw.vue";
// 交易中心
import TradeCenter from "@/components/trade/tradeCenter.vue";

// 个人中心
import Personal from "@/components/user/personal.vue";
import Account from "@/components/user/account.vue";
import Modify from "@/components/user/modify.vue";
import RestPassword from "@/components/user/restPassword.vue";
import RestSuccess from "@/components/user/restSuccess.vue";
import BindOresetSuccess from "@/components/user/bindOresetSuccess.vue";
import BindPhoneNumber from "@/components/user/bindPhoneNumber.vue";
import GoogleAuth from "@/components/user/googleAuth.vue";
import BindEmail from "@/components/user/bindEmail.vue";
import AntiFishing from "@/components/user/antiFishing.vue";
import Identity from "@/components/user/identity.vue";
import Kyc1 from "@/components/user/kyc1.vue";
import Kyc2 from "@/components/user/kyc2.vue";
//资产管理
import Assets from "@/components/assets/assets.vue";
import Finance from "@/components/assets/finance.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/demo",
      name: "demo",
      component: demo
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      name: "Login",
      component: LoginReg,
      children: [
        {
          path: "/login",
          name: "Login",
          component: Login
        },
        {
          path: "/register",
          name: "regiser",
          component: Register
        },
        {
          path: "/registerSuccess",
          name: "RegisterSuccess",
          component: RegisterSuccess
        },
        {
          path: "/forgetPassword",
          name: "ForgetPsw",
          component: ForgetPsw
        },
        {
          path: "/restLoginPsw/:userName/:msgCode",
          name: "RestLoginPsw",
          component: RestLoginPsw
        }
      ]
    },
    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        // 首页
        {
          path: "/home",
          name: "Home",
          component: Home
        },
        // 交易中心
        {
          path: "/trade",
          name: "tradeCenter",
          component: TradeCenter
        },
        // 个人中心
        {
          path: "/personal",
          name: "personal",
          component: Personal,
          meta: { requireAuth: true },
          children: [
            {
              path: "/personal/account",
              name: "account",
              component: Account,
              meta: { requireAuth: true }
            },
            {
              path: "/personal/identity",
              name: "identity",
              component: Identity,
              meta: { requireAuth: true },
              children: [
                {
                  path: "/personal/identity/Kyc1",
                  name: "Kyc1",
                  component: Kyc1,
                  meta: { requireAuth: true }
                },
                {
                  path: "/personal/identity/Kyc2",
                  name: "Kyc2",
                  component: Kyc2,
                  meta: { requireAuth: true }
                }
              ]
            }
          ]
        },
        {
          path: "/personal/modify",
          name: "modify",
          component: Modify,
          meta: { requireAuth: true },
          children: [
            {
              path: "/personal/modify/restPassword",
              name: "restPassword",
              component: RestPassword,
              meta: { requireAuth: true }
            },
            {
              path: "/personal/modify/restSuccess",
              name: "restSuccess",
              component: RestSuccess,
              meta: { requireAuth: true }
            },
            {
              path: "/personal/modify/bindOresetSuccess",
              name: "bindOresetSuccess",
              component: BindOresetSuccess,
              meta: { requireAuth: true }
            },
            {
              path: "/personal/modify/bindPhone",
              name: "bindPhoneNumber",
              component: BindPhoneNumber,
              meta: { requireAuth: true }
            },
            {
              path: "/personal/modify/googleAuth",
              name: "googleAuth",
              component: GoogleAuth,
              meta: { requireAuth: true }
            },
            {
              path: "/personal/modify/bindEmail",
              name: "bindEmail",
              component: BindEmail,
              meta: { requireAuth: true }
            },
            {
              path: "/personal/modify/antiFishing",
              name: "antiFishing",
              component: AntiFishing,
              meta: { requireAuth: true }
            }
          ]
        },
        // 资产管理
        {
          path: "/assets",
          name: "assets",
          component: Assets,
          meta: { requireAuth: true }
        },
        {
          path: "/assets/finance",
          name: "finance",
          component: Finance,
          meta: { requireAuth: true }
        }
      ]
    }
  ]
});
