<template>
        <div class = "mining">
            <div class = "m-present">
                <span class= "text26 m-title">挖矿机制</span>
                <div class = "m-pre-sontop">
                    <div class="sontop-left">
                        <ul>
                            <li class="m-sontt pad-left30">
                                <div class="m-block">
                                    <span class="text-p">今日已挖</span>
                                    <span class="text-14-ly">10,423,2424</span><span class="text-14-ly">CTT</span>
                                </div>
                                <div class="m-block m-fr">
                                    <span class="text-p">今日剩余可挖</span>
                                    <span class="text-14-ly">10,423,2424，956</span><span class="text-14-ly">CTT</span>
                                </div>
                            </li>
                            <li class="m-sontb">
                                <img class="show-img" src="../../assets/home/home_wakua_07.png">
                                <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
                            </li>
                        </ul>
                    </div>
                    <div class ="sontop-center m-block "><router-link to="/home" class="text14-co">规则说明</router-link></div>
                    <div class="sontop-right m-block">
                        <span class="text-p m-marginlet">挖矿难度基数</span>
                        <el-tooltip class="m-block y-box" content="每个账户锁仓5,000 CTT，每小时可挖出的CTT数量" placement="top">
                            <el-button>?</el-button>
                        </el-tooltip>
                        <span class="text-14-ly mrt50">300 CTT<span>小时</span></span>
                        <span class="text-p">CTT总锁仓量</span>
                        <span class="text-14-ly mrt10">10，423,2424CTT</span>
                        <router-link to="/trade" class="text14-co">锁仓/解仓</router-link>
                    </div>
                </div>
                <!-- <div class = "m-pre-sonbot">
                    <ul>
                        <li class = "sonbot-left border-right">
                            <p class="text-p">今日待分配收入合计（BTC估值）</p>
                            <div class ="tetx-span">27.433334323<span class="text18">BTC</span></div>
                            <span class="text-p">今日每百万份CTT已分红收入折合：</span><span class="text-p">1,2974 BTC</span>
                        </li>
                        <li class = "sonbot-center border-right">
                            <p class="text-p"> 昨日已分配收入合计（BTC估值）</p>
                            <div class ="tetx-span">27.433334323<span class="text18" >BTC</span></div>
                            <span class="text-p">昨日每百万份CTT已分红收入折合：</span><span class="text-p">1,2974 BTC</span>
                        </li>
                        <li class = "sonbot-right">
                            <span class="text-p">累计挖矿总产出</span><span class ="text-span18">642,281,782 CTT</span>
                            <div class ="text-p marg-bo10">CTT 抵扣手续费部分锁仓数量: <span class="text-p">1,2974 BTC</span></div>
                            <span class="text-p">CTT总流通量：</span><span class="text-p">1,2974 BTC</span>
                        </li>
                    </ul>
                </div>
                <div class = "m-pre-sontop">
                    <div class="sontop-left">
                        <ul>
                            <li class="m-sontt pad-left30">
                                <div class="m-block">
                                    <span class="text-p">今日已挖</span>
                                    <span class="text-14-ly">{{list1}}</span><span class="text-14-ly">CTT</span>
                                </div>
                                <div class="m-block m-fr">
                                    <span class="text-p">今日剩余可挖</span>
                                    <span class="text-14-ly">{{list2}}</span><span class="text-14-ly">CTT</span>
                                </div>
                            </li>
                            <li class="m-sontb">
                                <img class="show-img" src="../../assets/home/home_wakua_07.png">
                                 <div class="son-show" style ="width:63.9%"></div>
                                <el-progress :text-inside="true" :stroke-width="18" :percentage ="persentNum"></el-progress>
                            </li>
                        </ul>
                    </div>
                    <div class ="sontop-center m-block "><router-link to="/home" class="text14-co">规则说明</router-link></div>
                    <div class="sontop-right m-block">
                        <span class="text-p m-marginlet">挖矿难度基数</span>
                        <el-tooltip class="m-block y-box" content="每个账户锁仓5,000 CTT，每小时可挖出的CTT数量" placement="top">
                            <el-button>?</el-button>
                        </el-tooltip>
                        <span class="text-14-ly mrt50">300 CTT<span>小时</span></span>
                        <span class="text-p">CTT总锁仓量</span>
                        <span class="text-14-ly mrt10">{{list3 || 0}}</span>
                        <router-link to="/trade" class="text14-co">锁仓/解仓</router-link>
                    </div>
                </div> -->
                <div class = "m-pre-sonbot">
                    <ul>
                        <li class = "sonbot-left border-right">
                            <p class="text-p">今日待分配收入合计（BTC估值）</p>
                            <div class ="tetx-span">{{list4}}<span class="text18">BTC</span></div>
                            <span class="text-p">今日每百万份CTT已分红收入折合：</span><span class="text-p">{{list5}} BTC</span>
                        </li>
                        <li class = "sonbot-center border-right">
                            <p class="text-p"> 昨日已分配收入合计（BTC估值）</p>
                            <div class ="tetx-span">{{list1}}<span class="text18" >BTC</span></div>
                            <span class="text-p">昨日每百万份CTT已分红收入折合：</span><span class="text-p">{{list7}} BTC</span>
                        </li>
                        <li class = "sonbot-right">
                            <span class="text-p">累计挖矿总产出</span><span class ="text-span18">{{list7}} CTT</span>
                            <div class ="text-p marg-bo10">CTT 抵扣手续费部分锁仓数量: <span class="text-p">{{list9}} BTC</span></div>
                            <span class="text-p">CTT总流通量：</span><span class="text-p">{{list9 || 0}} BTC</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
</template>
<script>
    import tradeApi from '../../api/tradeApi'
    import assetsApi from '../../api/assetsApi'
     export default {
        data() {
            return {
                messages : "延禧攻略",
                persentNum:0,
                nameList:[],
                list1:"",
                list2:"",
                list3:"",
                list4:"",
                list5:"",
                list6:"",
                list7:"",
                list8:"",
                list9:"",

                
            };
        },
        mounted(){
            this.getNameList();
        },
        methods:{
            //初始化
            init(){
                this.persentNum = 80;
            },
            //获取收入分配数据
            getNameList(){
                assetsApi.currencyPrice().then(data =>{
                    this.nameList = data.result;
                    this.filterList(data.result);
                    this.init();
                })
            },
            filterList(data){
                this.list1 =data[1].latest;
                this.list2 =data[2].latest;
                this.list3 =data[3].latest;
                this.list4 =data[4].latest;
                this.list5 =data[5].latest;
                this.list6 =data[6].latest;
                this.list7 =data[7].latest;
                this.list8 =data[8].latest;
                this.list9 =data[7].latest;
                this.persentNum = Number(data[2].latest).toFixed(2);
            }
        },
        filters:{

        }
     };
</script>
<style lang = "scss">
    .mining{
        width:80%;
        min-width: 1200px;
        margin: auto;
        height:210px;
        .m-title{
            margin-bottom: 25px;
            margin-top: 10px;
            display: inline-block;
        }
        .m-pre-sontop{
            width:100%;
            height:50px;
            background-color: #fafcff;
        }
        .sontop-left{
            width:40%;
            list-style-type: none;
            padding: 0;
            margin: 0;
            display: inline-block;
        }
        .sontop-center{
            margin-left: 25px;
            position: relative;
            top: 0px;
            cursor: pointer
        }
        .sontop-right{
            position: relative;
            top: 0px;
        }
        .y-box{
            width: 16px;
            height: 16px;
            background-color: #398bfe;
            text-align: center;
            border-radius: 50%;
            color:#fafcff;
            cursor: pointer;
            padding: 9px 13px 9px 5px;
            line-height: 0;
        }
        .mrt50{
            margin-right: 50px;
        }
        .mrt10{
            margin-right: 10px;
        }
        .mar10{
            margin-right: 10px;
        }
        .m-marginlet{
            margin-left: 200px;
        }
        .pad-left30{
            padding-left: 30px;
        }
        .m-sontb{
            height: 15px;
            border-radius: 4px;
            background-color: #80b2e64f;
            margin-top: 15px;
            margin-left: 30px;
            position: relative;
        }
        .son-show{
            height: 15px;
            border-radius: 4px;
            background-color: #398bfe;
            float: right;
            position: relative;
        }
        .show-img{
            width:36px;
            height:30px;
            position: absolute;
            top: -15px;
            left: 203px;
            z-index: 0;
            display:none;
        }
        .m-pre-sonbot{
            width:100%;
            height: 150px;
        }
        .m-block{
            display: inline-block;
        }
        .m-fr{
            float: right;
        }
        .m-pre-sonbot ul{
            width:100%;
            height:100%;
            margin: 0 auto;
            border-radius: 4px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            background-color: #fafcff;
            
        }
        .m-pre-sonbot ul li{
            display:inline-block;
            box-sizing: border-box;
            width: 33%;
            height:60%;
            margin-top: 25px;
            padding-left: 30px;
        }
        .border-right{
            border-right: 1px solid #d0d0d0;
        }
        .text-p{
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 1px;
            color: #666666;
        }
        .text-14-ly{
            font-size: 14px;
            color: #c7c7c7;
        }
        .text14-co{
            font-size: 14px;
            color: #398bfe;
        }
        .tetx-span{
            font-size: 32px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 1px;
            color: #398bfe;
            margin-bottom: 10px;
        }
        .text-span18{
            font-size: 18px;
            color: #398bfe;
            margin-left: 10px;
        }
        .text18{
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #666666;
        }
        .text26{
            font-size: 26px;
            color:#333333;
        }
        .marg-bo10{
            margin-bottom: 12px;
            margin-top: 10px;
        }
        .el-progress-bar__inner{
            position: relative;
            background-color: #398bfe;
            text-align: left;
            float:right;
        } 
        .el-progress-bar__innerText{
            /* display:none; */
        }
        
    }
</style>
