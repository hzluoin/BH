import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/pages/Login'], resolve),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register/:inviteeCode',
      name: 'Register',
      component: resolve => require(['@/pages/Register'], resolve),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/register/:inviteeCode/:account',
      name: 'RegisterAcc',
      component: resolve => require(['@/pages/Register'], resolve),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: resolve => require(['@/pages/ForgetPassword'], resolve),
      meta: {
        title: '找回登录密码'
      }
    },
    {
      path: '/resetPasswords',
      name: 'ResetPasswords',
      component: resolve => require(['@/pages/ResetPasswords'], resolve),
      meta: {
        title: '重置登录密码'
      }
    },
    {
      path: '/account',
      name: 'AccountManage',
      component: resolve => require(['@/pages/account/AccountManage'], resolve),
      meta: {
        title: '我的账户',
        requiresAuth: true
      },
      children: [
        {
          path: '/account/accountInformation',
          name: 'AccountInformation',
          component: resolve => require(['@/pages/account/AccountInformation'], resolve),
          meta: {
            title: '个人信息',
            group: 'AccountInformation'
          }
        },
        {
          path: '/account/securitySettings',
          name: 'SecuritySettings',
          component: resolve => require(['@/pages/account/security_settings/SecuritySettings'], resolve),
          meta: {
            title: '安全设置',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/securitySettings/phone',
          name: 'Phone',
          component: resolve => require(['@/pages/account/security_settings/Phone'], resolve),
          meta: {
            title: '手机认证',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/securitySettings/update_phone',
          name: 'UpdatePhone',
          component: resolve => require(['@/pages/account/security_settings/UpdatePhone'], resolve),
          meta: {
            title: '手机认证修改',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/securitySettings/update_phone_lost',
          name: 'UpdatePhoneLost',
          component: resolve => require(['@/pages/account/security_settings/UpdatePhoneLost'], resolve),
          meta: {
            title: '手机认证修改',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/securitySettings/google_certification',
          name: 'GoogleCertification',
          component: resolve => require(['@/pages/account/security_settings/GoogleCertification'], resolve),
          meta: {
            title: '谷歌认证',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/email',
          name: 'Email',
          component: resolve => require(['@/pages/account/security_settings/Email'], resolve),
          meta: {
            title: '邮箱认证',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/update_password',
          name: 'UpdatePassword',
          component: resolve => require(['@/pages/account/security_settings/UpdatePassword'], resolve),
          meta: {
            title: '登录密码修改',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/reset_password',
          name: 'ResetPassword',
          component: resolve => require(['@/pages/account/security_settings/ResetPassword'], resolve),
          meta: {
            title: '登录密码重置',
            group: 'ResetPassword'
          }
        },
        {
          path: '/account/update_trading_password',
          name: 'UpdateTradingPassword',
          component: resolve => require(['@/pages/account/security_settings/UpdateTradingPassword'], resolve),
          meta: {
            title: '资金密码修改',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/reset_trading_password',
          name: 'ResetTradingPassword',
          component: resolve => require(['@/pages/account/security_settings/ResetTradingPassword'], resolve),
          meta: {
            title: '资金密码重置',
            group: 'SecuritySettings'
          }
        },
        {
          path: '/account/authentication',
          name: 'Authentication',
          component: resolve => require(['@/pages/account/authentication/Authentication'], resolve),
          meta: {
            title: '实名认证'
          },
          children: [
            {
              path: '/account/authentication/low',
              name: 'AuthenticationLow',
              component: resolve => require(['@/pages/account/authentication/AuthenticationLow'], resolve),
              meta: {
                title: '初级认证',
                group: 'Authentication'
              }
            },
            {
              path: '/account/authentication/medium',
              name: 'AuthenticationMedium',
              component: resolve => require(['@/pages/account/authentication/AuthenticationMedium'], resolve),
              meta: {
                title: '中级认证',
                group: 'Authentication'
              }
            },
            {
              path: '/account/authentication/medium_audit',
              name: 'AuthenticationMediumAudit',
              component: resolve => require(['@/pages/account/authentication/AuthenticationMediumAudit'], resolve),
              meta: {
                title: '中级认证审核中',
                group: 'Authentication'
              }
            },
            {
              path: '/account/authentication/high',
              name: 'AuthenticationHigh',
              component: resolve => require(['@/pages/account/authentication/AuthenticationHigh'], resolve),
              meta: {
                title: '高级认证',
                group: 'Authentication'
              }
            }
          ]
        },
        {
          path: '/account/transactionSettings',
          name: 'TransactionSettings',
          component: resolve => require(['@/pages/account/transaction_settings/TransactionSettings'], resolve),
          meta: {
            title: '交易设置',
            group: 'TransactionSettings'
          }
        },
        {
          path: '/account/listManagement',
          name: 'ListManagement',
          component: resolve => require(['@/pages/account/list_management/ListManagement'], resolve),
          meta: {
            title: '名单管理',
            group: 'ListManagement'
          }
        },
        {
          path: '/account/my_advertising',
          name: 'MyAdvertising',
          component: resolve => require(['@/pages/account/my_advertising/MyAdvertising'], resolve),
          meta: {
            title: '我的广告',
            group: 'MyAdvertising'
          }
        }
      ]
    },
    {
      path: '/asset',
      name: 'AssetManage',
      component: resolve => require(['@/pages/asset/AssetManage'], resolve),
      meta: {
        title: '订单管理',
        requiresAuth: true
      },
      children: [
        {
          path: '/asset/asset',
          name: 'MyAssets',
          component: resolve => require(['@/pages/asset/MyAssets'], resolve),
          meta: {
            title: '我的资产'
          }
        },
        {
          path: '/account/top_up',
          name: 'TopUp',
          component: resolve => require(['@/pages/asset/TopUp'], resolve),
          meta: {
            title: '充币'
          }
        },
        {
          path: '/account/Mention_money',
          name: 'MentionMoney',
          component: resolve => require(['@/pages/asset/MentionMoney'], resolve),
          meta: {
            title: '提币'
          }
        },
        {
          path: '/asset/money_record',
          name: 'MoneyRecord',
          component: resolve => require(['@/pages/asset/MoneyRecord'], resolve),
          meta: {
            title: '资金记录'
          }
        },
        {
          path: '/asset/order',
          name: 'Order',
          component: resolve => require(['@/pages/asset/Order'], resolve),
          meta: {
            title: '我的订单'
          }
        }
      ]
    },
    {
      path: '/otc_trading',
      name: 'OtcTrading',
      component: resolve => require(['@/pages/otc_trading/OtcTrading'], resolve),
      meta: {
        title: '场外交易'
      }
    },
    {
      path: '/Currency_application',
      name: 'CurrencyApplication',
      component: resolve => require(['@/pages/Currency_application/CurrencyApplication'], resolve),
      meta: {
        title: '上币申请'
      }
    },
    {
      path: '/Review_payment',
      name: 'ReviewPayment',
      component: resolve => require(['@/pages/Currency_application/ReviewPayment'], resolve),
      meta: {
        title: '上币审核缴费'
      }
    },
    {
      path: '/Details_currency',
      name: 'DetailsCurrency',
      component: resolve => require(['@/pages/Currency_application/DetailsCurrency'], resolve),
      meta: {
        title: 'GRAM上币详情'
      }
    },
    {
      path: '/Application_information',
      name: 'ApplicationInformation',
      component: resolve => require(['@/pages/Currency_application/ApplicationInformation'], resolve),
      meta: {
        title: 'GRAM上币详情'
      }
    },
    {
      path: '/publish',
      name: 'Publish',
      component: resolve => require(['@/pages/publish/Publish'], resolve),
      meta: {
        title: '免费发布交易',
        requiresAuth: true
      }
    },
    {
      path: '/HelpCenter',
      name: 'HelpCenter',
      component: resolve => require(['@/pages/support_center/HelpCenter'], resolve),
      meta: {
        title: '帮助中心'
      }
    },
    {
      path: '/MoreOpen/:myId/:type/:myname',
      name: 'MoreOpen',
      component: resolve => require(['@/pages/support_center/MoreOpen'], resolve),
      meta: {
        title: '更多展开'
      }
    },
    {
      path: '/FrequentlyAskedQuestion/:type/:myId/:helpId',
      name: 'FrequentlyAskedQuestion',
      component: resolve => require(['@/pages/support_center/FrequentlyAskedQuestion'], resolve),
      meta: {
        title: '常见问题'
      }
    },
    {
      path: '/SearchHelp/:type/:keyword',
      name: 'SearchHelp',
      component: resolve => require(['@/pages/support_center/SearchHelp'], resolve),
      meta: {
        title: '搜索结果'
      }
    },
    {
      path: '/activity',
      name: 'Activity',
      component: resolve => require(['@/pages/activity'], resolve),
      meta: {
        title: '抽奖活动'
      }
    },
    {
      path: '/invite',
      name: 'Invite',
      component: resolve => require(['@/pages/Invite'], resolve),
      meta: {
        title: '邀请有礼'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: resolve => require(['@/pages/Home'], resolve),
      meta: {
        title: '币汇'
      }
    },
    {
      path: '/InnovateProject',
      name: 'InnovateProject',
      component: resolve => require(['@/pages/InnovateProject'], resolve),
      meta: {
        title: '创新项目'
      }
    },
    {
      path: '/exchange/FullExchange',
      name: 'FullExchange',
      component: resolve => require(['@/pages/exchange/FullExchange'], resolve),
      meta: {
        title: '币币交易'
      }
    },
    {
      path: '*',
      component: resolve => require(['@/pages/Home'], resolve),
      meta: {
        title: '币汇'
      }
    },
    {
      path: '/line',
      component: resolve => require(['@/pages/exchange/Candlestick'], resolve),
      meta: {
        title: 'K线'
      }
    }
  ]
})
