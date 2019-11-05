<template>
  <div id="INDEX">
    <el-card class="box-card">
      <div class="scan-box">
        <div class="scan-input">
          <input type="text" v-model="code" placeholder="请输入验证码"/>
        </div>
        <div class="scan-icon" @click="scan">
          <i class="el-icon-full-screen"></i>
        </div>
      </div>
      <div class="scan-button">
        <el-button @click="getCouponData" style="width: 100%;" type="text" class="mini-button">查 询</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="user-info-box">
        <div class="user-info-item">
          <div class="user-info-left">券编号</div>
          <div class="user-info-right">{{coupon_num}}</div>
        </div>
        <div class="user-info-item">
          <div class="user-info-left">购买时间</div>
          <div class="user-info-right">{{coupon_time}}</div>
        </div>
        <div class="user-info-item">
          <div class="user-info-left">金额</div>
          <div class="user-info-right">{{coupon_cost}}</div>
        </div>
      </div>
      <div class="scan-button">
        <el-button @click="redeemCoupons" style="width: 100%;" type="text" class="mini-button">兑 换</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <div class="coupon-header">
        <div class="coupon-title">
          <el-date-picker
            v-model="month"
            type="month"
            placeholder="选择月"
            style="width: 100%;"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions"
            value-format="yyyy-MM"
            @change="getMonthData">
          </el-date-picker>
        </div>
        <div class="coupon-button">
          <el-button @click="export2Excel()" type="text" class="mini-button">导出数据</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="calc(100vh - 332px)">
        <el-table-column
          prop="cashCouponName"
          label="券名称"
          min-width="87"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="购买时间"
          min-width="80"
          align="center">
          <template slot-scope="scope">
            <div class="time_size">{{scope.row.purchasingDate | fulldate}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cashCouponMoney"
          label="金额"
          min-width="77"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isEmploy"
          label="状态"
          min-width="65"
          align="center">
        </el-table-column>
      </el-table>
      <div class="coupon-box">
        <div class="coupon-item" style="border-right: 1px solid #EEEEEE;">已核销:<span>{{isEmploy}}</span></div>
        <div class="coupon-item">未核销:<span>{{Employ}}</span></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  data(){
    return{
      month:"",
      code:"",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      coupon_num:"暂无数据",
      coupon_time:"暂无数据",
      coupon_cost:"暂无数据",
      tableData: [],
      Employ:0,
      isEmploy:0,
      endDay:""
    }
  },
  created(){
    this.getDefTime();
  },
  watch:{
    code:function(val){
      if(this.code.length<=0){
        this.coupon_num = "暂无数据";
        this.coupon_time = "暂无数据";
        this.coupon_cost = "暂无数据";
      };
    },
		immediate: true,
		deep: true
  },
  methods: {
    getDefTime(){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      };
      this.month = year + "-" + month;
      this.getMonthData(this.month);
    },
    redeemCoupons(){
      if(this.coupon_num == '暂无数据'){
        this.$message.error('请先点击查询按钮');
      }else{
        let port = 'merchantCashCoupon/useCashCoupon'
        let obj = {
          opid:sessionStorage.getItem("ShopId"),
          cashCouponRecordNo:this.code
        };
        let upData = this.axios.upData(port,obj);
        upData.then(res => {
          if(res.data.status == 200){
            this.code = "";
            this.coupon_num = "暂无数据";
            this.coupon_time = "暂无数据";
            this.coupon_cost = "暂无数据";
            this.getData();
            this.$message.success('兑换成功');
          }else if(res.data.status == 588){
            this.checkLogin();
          }else{
            this.$message.error(res.data.msg);
          }
        });
      };
    },
    getMonthData(data){
      let date;
      let endDay;
      if(!!data){
        date = data;
      }else{
        date = this.month;
      };
      if(date.split('-')[1]=='04'||date.split('-')[1]=='06'||date.split('-')[1]=='09'||date.split('-')[1]=='11'){
        endDay = '30';
      }else if(date.split('-')[1] == '02'){
        let year = date.split('-')[0];
        if(year%4==0&&year%100!=0||year%400==0){
          endDay = '29';
        }else{
          endDay = '28';
        }
      }else{
        endDay = '31';
      };
      this.endDay = endDay;
      this.getData(endDay);
    },
    getData(date){
      let day;
      if(!!date){
        day = date;
      }else{
        day = this.endDay;
      };
      let port = 'merchantCashCoupon/getCashCouponRecord';
      let obj = {
        opid:sessionStorage.getItem("ShopId"),
        startTime:this.month + '-01',
        endTime:this.month + '-' + day + " 23:59:59"
      };
      console.log(obj);
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          this.Employ = 0;
          this.isEmploy = 0;
          for(let i=0;i<data.length;i++){
            data[i].cashCouponMoney = parseFloat(data[i].cashCouponMoney).toFixed(2);
            data[i].purchasingDate = this.formatDate(new Date(data[i].purchasingDate));
            if(data[i].isEmploy){
              data[i].isEmploy = '已核销';
              this.isEmploy += 1;
            }else{
              data[i].isEmploy = '未核销';
              this.Employ += 1;
            }
          };
          this.tableData = data;
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    export2Excel() {
      let ua = navigator.userAgent.toLowerCase();
      function isWeixinBrowser() {
        return (/micromessenger/.test(ua)) ? true : false;
      };
      let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //ios终端
      let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if(isWeixinBrowser()) {
        // 微信
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
          //ios
          this.$message.error('请在电脑上打开该页面');
          event.preventDefault();
        }else if(/(Android)/i.test(navigator.userAgent)) {
          //android
          this.$message.error('请在浏览器上打开该页面');
          event.preventDefault();
        };
      }else{
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
          //ios
          this.$message.error('请在电脑上打开该页面');
          event.preventDefault();
        }else if(/(Android)/i.test(navigator.userAgent)) {
          //android
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../excel/Export2Excel");
            const tHeader = ["券编号", "券名称", "购买时间", "兑换时间", "金额", "状态"]; // 上面设置Excel的表格第一行的标题
            const filterVal = ["cashCouponRecordNo", "cashCouponName", "purchasingDate", "useDate", "cashCouponMoney", "isEmploy"]; // 上面的index、phone_Num、school_Name是tableData里对象的属性
            const list = this.tableData; //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            const fileName = this.month + " " + sessionStorage.getItem("shopName") + "核销报表";
            export_json_to_excel(tHeader, data, fileName);
          });
        }else{
          //web
          require.ensure([], () => {
            const { export_json_to_excel } = require("../../excel/Export2Excel");
            const tHeader = ["券编号", "券名称", "购买时间", "兑换时间", "金额", "状态"]; // 上面设置Excel的表格第一行的标题
            const filterVal = ["cashCouponRecordNo", "cashCouponName", "purchasingDate", "useDate", "cashCouponMoney", "isEmploy"]; // 上面的index、phone_Num、school_Name是tableData里对象的属性
            const list = this.tableData; //把data里的tableData存到list
            const data = this.formatJson(filterVal, list);
            const fileName = this.month + " " + sessionStorage.getItem("shopName") + "核销报表";
            export_json_to_excel(tHeader, data, fileName);
          });
        }
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    getCouponData(){
      if(this.code == ''){
        this.$message.error('验证码不能为空');
      }else{
        let port = 'merchantCashCoupon/getMerchantCashCouponRecordOne';
        let obj = {
          opid:sessionStorage.getItem("ShopId"),
          cashCouponRecordNo:this.code
        };
        let upData = this.axios.upData(port,obj);
        upData.then(res => {
          if(res.data.status == 200){
            let data = res.data.data;
            this.coupon_num = data.cashCouponRecordNo;
            if(!!data.purchasingDate.split('.')[1]){
              this.coupon_time = data.purchasingDate.split('.')[0];
            }else{
              this.coupon_time = data.purchasingDate;
            };
            this.coupon_cost = parseFloat(data.cashCouponMoney).toFixed(2) + '元';
          }else if(res.data.status == 588){
            this.checkLogin();
          }else{
            this.$message.error(res.data.msg);
          }
        });
      };
    },
    scan(){
      let port = 'weChatOperation/createJSWeChatSign';
      let obj = {
        opid:sessionStorage.getItem("ShopId"),
        url:location.href.split('#')[0]
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let that = this;
          let data = res.data.data;
          wx.config({
            debug: false,
            appId: data.appid, // 必填,公众号的唯一标识
            timestamp: data.timestamp, // 必填,生成签名的时间戳
            nonceStr: data.noncestr, // 必填,生成签名的随机串
            signature: data.sign, // 必填,签名
            jsApiList: ['scanQRCode'] // 必填,需要使用的JS接口列表
          });
          wx.ready(function () {
            // config信息验证成功后会执行ready方法,所有接口调用都必须在config接口获得结果之后
            // config 是一个客户端的异步操作,所以如果需要在页面加载时调用相关接口,则须把相关接口放在ready函数中调用来确保正确执行.对于用户触发是才调用的接口,则可以直接调用,不需要放在ready函数中
            wx.checkJsApi({ // 判断当前客户端版本是否支持指定JS接口
              jsApiList: [
                'scanQRCode'
              ],
              success: function (res) { // 以键值对的形式返回，可用true，不可用false。如：{"checkResult":{"scanQRCode":true},"errMsg":"checkJsApi:ok"}
                if (res.checkResult.scanQRCode === true) {
                  wx.scanQRCode({ // 微信扫一扫接口
                    desc: 'scanQRCode desc',
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                      that.code = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                      console.log(that.code)
                    }
                  })
                } else {
                  alert('抱歉，当前客户端版本不支持扫一扫')
                }
              },
              fail: function (res) { // 检测getNetworkType该功能失败时处理
                alert('fail' + res)
              }
            })
          });
           /* 处理失败验证 */
          wx.error(function (res) {
          // config 信息验证失败会执行error函数,如签名过期导致验证失败,具体错误信息可以打开config的debug模式查看,也可以在返回的res参数中查看,对于SPA可以在这里更新签名
            console.log(res);
            alert('配置验证失败: ' + res.errMsg)
          });
        }else if(res.data.status == 588){
          this.checkLogin();
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
  },
}
</script>

<style scoped>
#INDEX{

}
.scan-box{
  display: flex;
  align-items: center;
  padding: 5px;
  justify-content: space-between;
}
.scan-input{
  width: calc(100% - 60px);
  margin-left: 10px;
}
.scan-input input{
  width: 100%;
  height: 20px;
  line-height: 20px;
  border: 0px;
}
.scan-icon{
  text-align: center;
  font-size: 28px;
  width: 28px;
  height: 28px;
}
.scan-button{
  padding: 5px 0px;
  border-top: 1px solid #EEEEEE;
}
.coupon-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 7px;
  border-bottom: 1px solid #EEEEEE;
}
.coupon-title{
  width: 75%;
}
.coupon-button{
  width: 20%;
}
.user-info-box{
  margin: 5px;
  border: 1px solid #EEEEEE;
  border-radius: 10px;
}
.user-info-item{
  display: flex;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid #EEEEEE;
  height: 26px;
  line-height: 26px;
}
.user-info-item:last-of-type{
  border: 0px;
}
.user-info-left{
  width: 30%;
  border-right: 1px solid #EEEEEE;
  font-weight: bold;
  color: #909399;
}
.user-info-right{
  width: 65%;
  color: #959799;
}
.coupon-box{
  display: flex;
  align-items: center;
  font-size: 14px;
}
.coupon-item{
  width: 50%;
  color: #959799;
  padding: 2px 0px;
}
.coupon-item span{
  margin-left: 3px;
  color: red;
  font-weight: bold;
}
</style>