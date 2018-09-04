<template>
    <div class="account">
        <div class="user-info mb-26 shadow">
            <div>
                <div class="info-content mb-32">
                    <p class="color-333 fs-18 mb-10">{{userName}}</p>
                    <p class="color-999 fs-14"><span>UID:</span><span>{{userID}}</span></p>
                </div>
                <div class="login-ip fs-14 pt-30 color-999">
                    <span>上次登录时间:</span>   <span>{{formatTime(lastLoginData.addTime)}}</span>   <span>IP:</span>   <span>{{lastLoginData.ip}}</span>
                </div>
            </div>
        </div>
        <div class="risk fs-16 mb-24" v-if="!phone || !googleCode || !email || !avoidFishingCode">
            <div class="mb-16">
                <p>您的账户存在安全风险</p>
            </div>
            <div class="color-333 risk-content">
                <ul>
                    <li>{{phone?'':'· 短信认证未绑定'}}</li>
                    <li>{{googleCode?'':'· 谷歌验证未绑定'}}</li>
                    <li>{{email?'':'· 邮箱未验证'}}</li>
                    <li>{{avoidFishingCode?'':'· 防钓鱼码未验证'}}</li>
                </ul>
            </div>
        </div>
        <div class="safe-set mb-26 shadow">
            <div class="safe-title">
                <h3 class="fs-20 color-333 mb-20">安全设置</h3>
            </div>
            <div class="safe-content">
                <ul>
                    <li>
                        <div class="fl">
                            <div class="psw-icon fl pl-42"><h3 class=" fs-20 color-333">密码设置</h3></div>
                            <div class="fl pl-40 fs-14 color-999">登录时使用</div>
                        </div>
                        <div class="fr">
                            <div class="fr reset">
                                <div class="fs-16 reset-btn user-btn" @click="restPsw">
                                    <router-link to="/personal/modify/restPassword">重置</router-link>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="fl">
                            <div class="fl pl-42" :class="phone? 'phone-icon':'list-icon'"><h3 class=" fs-20 color-333">绑定手机</h3></div>
                            <div class="fl pl-40 fs-14 color-999">为了您的账户安全，在进行提币操作时系统会校验您的手机号，进一步确保是本人操作</div>
                        </div>
                        <div class="fr">
                            <div class="fr reset">
                                <div class="fs-16 user-btn" :class="phone? 'reset-btn':'bind-btn'" @click="bindPhoneNumber">
                                    <router-link to="/personal/modify/bindPhone">{{phone?'修改':'绑定' }}</router-link>
                                </div>
                            </div>
                            <div class="fr"></div>
                        </div>
                    </li>
                    <li>
                        <div class="fl">
                            <div class="fl pl-42" :class="googleCode?'google-icon':'list-icon'"><h3 class=" fs-20 color-333">谷歌验证</h3></div>
                            <div class="fl pl-40 fs-14 color-999">谷歌验证会进一步确认您的账户安全，防止账户被盗用</div>
                        </div>
                        <div class="fr">
                            <div class="fr reset" >
                                <div class="fs-16 user-btn" :class="googleCode? 'reset-btn':'bind-btn'" @click="googleAuth">
                                    <router-link to="/personal/modify/googleAuth">{{googleCode?'修改':'去验证' }}</router-link>
                                </div>
                            </div>
                            <div class="fr"></div>
                        </div>
                    </li>
                    <li>
                        <div class="fl">
                            <div class="fl pl-42" :class="email?'email-icon':'list-icon'"><h3 class=" fs-20 color-333">邮箱验证</h3></div>
                            <div class="fl pl-40 fs-14 color-999">邮箱用户登录 / 提币时使用，一旦验证成功不可修改</div>
                        </div>
                        <div class="fr fs-16 color-999">
                            <div class="fr ml-60 reset">
                                <div class="fs-16 user-btn" :class="email? '':'bind-btn'" @click="bindEmail">
                                    <router-link v-if="!email" to="/personal/modify/bindEmail">设置</router-link>
                                    <p v-else>不可修改</p>
                                </div>
                                <!-- <div>不可修改</div> -->
                            </div>
                            <div class="fr">{{email?email:'' }}</div>
                        </div>
                    </li>
                    <li>
                        <div class="fl">
                            <div class="fl pl-42" :class="avoidFishingCode?'fish-icon':'list-icon'"><h3 class=" fs-20 color-333">防钓鱼码</h3></div>
                            <div class="fl pl-40 fs-14 color-999">设置后，给您发送的邮件中会包含此码；没有包含此码的为伪造，诈骗邮件</div>
                        </div>
                        <div class="fr">
                            <div class="fr reset">
                                <div class="fs-16 user-btn" :class="avoidFishingCode? 'reset-btn':'bind-btn'" @click="antiFishing">
                                    <router-link to="/personal/modify/antiFishing">{{avoidFishingCode?'修改':'设置' }}</router-link>
                                </div>
                            </div>
                            <div class="fr"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="login-record shadow">
            <div class="record-title mb-30">
                <h3 class="fs-20 color-333">登录记录</h3>
            </div>
            <div>
                <div class="record-name">
                    <div><h3 class="fs-16 color-333">登录时间</h3></div>
                    <div><h3 class="fs-16 color-333">IP地址</h3></div>
                    <div><h3 class="fs-16 color-333">所在地</h3></div>
                </div>
                <ul>
                    <li v-for="(item,index) in loginRecordList" :key='index'>
                        <div>{{formatTime(item.addTime)}}</div>
                        <div>{{item.ip}}</div>
                        <div>{{item.location}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../api/account.js";
import formatTime from "../../utils/formatTime.js";
export default {
  data() {
    return {
      userName: "",
      userID: "",
      phone: "",
      googleCode: "",
      email: "",
      avoidFishingCode: "",
      loginRecordList: [],
      lastLoginData: {}
    };
  },
  mounted() {
    this.getUserInfo();
    this.getUserLoginInfo();
  },
  methods: {
    getUserInfo() {
      //phone:手机号,
      // googleCode:谷歌验证码,
      // googleValidate:是否开启谷歌验证码：1开启，2关闭,
      // avoidFishingCode:防钓鱼码,
      axios.account().then(data => {
        this.userName = data.data.username;
        this.userID = data.data.id;
        this.phone = data.data.phone;
        this.googleCode = data.data.googleCode;
        this.email = data.data.email;
        this.avoidFishingCode = data.data.avoidFishingCode;
      });
    },
    getUserLoginInfo() {
      axios.loginTime().then(data => {
        this.loginRecordList = data.data;
        this.lastLoginData = data.data[0] || {};
      });
    },
    /**
     * title: 操作事项
     * type: 0设置/绑定     1修改
     */
    restPsw() {
      localStorage.setItem(
        "crumbs",
        JSON.stringify({ title: "修改密码", type: "1" })
      );
    },
    // 手机
    bindPhoneNumber() {
      let type = this.phone ? "1" : "0";
      let title = type == 1 ? "手机修改" : "手机绑定";
      localStorage.setItem(
        "crumbs",
        JSON.stringify({ title: title, type: type })
      );
    },
    // 谷歌验证
    googleAuth() {
      let type = this.googleCode ? "1" : "0";
      let title = type == 1 ? "重置谷歌验证器" : "开启谷歌验证";
      localStorage.setItem(
        "crumbs",
        JSON.stringify({ title: title, type: type })
      );
    },
    // 绑定邮箱
    bindEmail() {
      localStorage.setItem(
        "crumbs",
        JSON.stringify({ title: "邮箱验证", type: "0" })
      );
    },
    // 防钓鱼码
    antiFishing() {
      let type = this.avoidFishingCode ? "1" : "0";
      localStorage.setItem(
        "crumbs",
        JSON.stringify({ title: "防钓鱼码", type: type })
      );
    },
    formatTime(time) {
      return formatTime.formatTime(time);
    }
  }
};
</script>


<style>
.account {
  overflow: hidden;
  padding-bottom: 100px;
}
.shadow {
  -moz-box-shadow: 0 6px 5px #e8f1fb;
  box-shadow: 0 6px 5px #e8f1fb;
}
.user-info {
  background: #fff;
  padding: 22px 40px 32px;
  border-radius: 6px;
}
.info-content {
  padding: 20px 92px;
  background: url("../../assets/user/user_01.png") no-repeat left center;
}
.login-ip {
  border-top: 1px solid transparent;
  border-image: url("../../assets/user/line.png") 1 1 round;
}
.login-ip span {
  margin-right: 18px;
}
.risk {
  padding: 26px 50px;
  border-radius: 6px;
  background: #eef3fb;
  overflow: hidden;
}
.risk > div:first-child {
  color: #ea6565;
  padding: 6px 36px;
  background: url("../../assets/user/warning.png") no-repeat left center;
  background-size: 26px 26px;
}
.risk-content li {
  float: left;
  margin-left: 38px;
}
.safe-set {
  padding: 38px 50px 18px;
  border-radius: 6px;
  background: #fff;
}
.safe-title {
  border-bottom: 1px solid #d6e1f0;
}

.safe-content li {
  width: 100%;
  height: 78px;
  line-height: 78px;
  border-top: 1px solid transparent;
  border-image: url("../../assets/user/line.png") 1 1 round;
}
.safe-content li:first-child {
  border-top: 0 none;
}
.reset {
  padding: 17px 0;
  line-height: normal;
}
.reset p {
  line-height: 44px;
  text-align: right;
}
.user-btn {
  width: 96px;
  border-radius: 6px;
}
.user-btn a {
  width: 100%;
  display: inline-block;
  padding: 10px 0;
  text-align: center;
}
.reset-btn {
  border: 1px solid #d6e1f0;
}
.reset-btn a {
  color: #66b3ff;
}
.bind-btn a {
  color: #fff;
}
.bind-btn {
  background: #66b3ff;
  color: #fff;
}
.safe-content .list-icon {
  background: url("../../assets/user/warning.png") no-repeat left center;
  background-size: 26px 26px;
}

.safe-content .psw-icon {
  background: url("../../assets/user/psw.png") no-repeat left center;
  background-size: 22px 26px;
}

.safe-content .phone-icon {
  background: url("../../assets/user/phone.png") no-repeat left center;
  background-size: 22px 26px;
}

.safe-content .google-icon {
  background: url("../../assets/user/google.png") no-repeat left center;
  background-size: 22px 22px;
}
.safe-content .email-icon {
  background: url("../../assets/user/email.png") no-repeat left center;
  background-size: 22px 18px;
}

.safe-content .fish-icon {
  background: url("../../assets/user/fish.png") no-repeat left center;
  background-size: 22px 26px;
}

.login-record {
  border-radius: 6px;
  padding: 40px 46px;
  background: #fff;
}
.record-name {
  display: flex;
  text-align: center;
  line-height: 56px;
}
.login-record li {
  display: flex;
  text-align: center;
  line-height: 42px;
}
.record-name div,
.login-record li div {
  flex: 1;
}
.login-record li div {
  font-size: 16px;
  color: #999;
}
.login-record li:nth-child(2n-1) {
  background: #f6faff;
}
</style>
