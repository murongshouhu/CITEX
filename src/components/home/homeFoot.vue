<template>
    <div class="home-foot">
        <div class="foot-present">
            <div class="foot-left">
                <img class="left-img" src="../../assets/home/home_ft_01.png">
            </div>
            <div class="foot-right">
                <div class ="right-top"><span class="text-top">CITEX强大的交易工具</span></div>
                <div class ="right-bottom"><span class="text-bottom">CITEX由来自传统金融结构（券商、交易所、PE/VC投资基金）以及区块链行业专家打造，在系统安全，撮合引擎，量化交易，内控管理流程等领域拥有资深经验，交易平台先落地于韩国和香港，后续将进行全球化部署</span></div>
            </div>
        </div>
    </div>
    
</template>
<script>
export default {
  data() {
    return {
        
    };
  }
};
</script>


<style lang="scss">
.home-foot{
    *{
        margin: 0;
        padding: 0;
    }
    .foot-present{
        width:80%;
        height: 632px;
        margin: auto;
    }
    .foot-left{
        width :30%;
       height: 100%;
    }
    .left-img{
        background-image:url(../../assets/home/home_ft_01.png);
        width: 100%;
	    height: 472px;
    }
    .foot-right{
        width:70%;
        height:100%;
        float: right;
        display: inline-block;
        margin-top: -700px;
    }
    .right-top{
        width: 100%;
        height:40%;
        text-align: right;
    }
    .right-bottom{
        text-align: right;
        margin-left: 263px;
    }
    .text-top{
        width: 346px;
        height: 32px;
        font-family: PingFangSC-Medium;
        font-size: 34px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 96px;
        letter-spacing: 0px;
        color: #333333;
        margin-top: 137px;
        display: inline-block;
    }
    .text-bottom{
        width: 855px;
        height: 51px;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 32px;
        letter-spacing: 0px;
        color: #666666;
    }
}


</style>