<template>
  <div id="User">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
    >
      <el-card class="box-card">
        <dl class="message">
          <dd class="name">
            <img src="../../../static/img/u207.png" class="img" alt="img" style="vertical-align: middle;">
            <div style="margin-left: 5px;">店铺名称</div>
          </dd>
          <dd class="text">
            <span class="info" style="margin-left: 3px;">{{name}}</span>
          </dd>
          <dd class="button">
            <el-button style="margin: auto;" type="success" size="mini" @click="setShopName()">修改名称</el-button>
          </dd>
        </dl>
        <dl class="message">
          <dd class="name">
            <img src="../../../static/img/u207.png" class="img" alt="img" style="vertical-align: middle;">
            <div style="margin-left: 5px;">店铺图标</div>
          </dd>
          <dd class="text">
            <div style="margin-left: 3px;" class="shop-icon" @click="showImg">
              <img :src="shopIcon">
            </div>
          </dd>
          <dd class="button">
            <el-button style="margin: auto;" type="success" size="mini" @click="dialogVisible2 = true;">修改图标</el-button>
          </dd>
        </dl>
        <dl class="message">
          <dd class="name">
            <img src="../../../static/img/u207.png" class="img" alt="img" style="vertical-align: middle;">
            <div style="margin-left: 5px;">店铺电话</div>
          </dd>
          <dd class="text">
            <span class="info" style="margin-left: 3px;">{{tel}}</span>
          </dd>
          <dd class="button">
            <el-button style="margin: auto;" type="success" size="mini" @click="setShopTel()">修改电话</el-button>
          </dd>
        </dl>
        <!-- 5 -->
        <dl class="message">
          <dd class="name">
            <img src="../../../static/img/u207.png" class="img" alt="img" style="vertical-align: middle;">
            <div style="margin-left: 5px;">店铺简介</div>
          </dd>
          <dd class="text">
            <span style="margin-left: 3px;"></span>
          </dd>
          <dd class="button">
            <el-button style="margin: auto;" type="success" size="mini" @click="goProtocol()">编辑说明</el-button>
          </dd>
        </dl>
      </el-card>
      <el-card class="box-card">
        <div class="set-title">店铺地址设置</div>
        <div class="address-box">
          <el-input class="address-input" type="textarea" :disabled="addlock" v-model="ruleForm.address" placeholder="请输入内容"></el-input>
        </div>
        <div class="cost-footer-button" style="border-top: 1px solid #EEEEEE;">
          <div style="width: 50%;">
            <a :href="href">
              <el-button @click="getAddress" type="text" style="width: 100%;" class="text-button">获取地址</el-button>
            </a>
          </div>
          <div style="width: 50%;border-left: 1px solid #EEEEEE;">
            <el-button @click="postAddress('ruleForm')" type="text" style="width: 100%;" class="text-button">确认地址</el-button>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="set-title">代金券设置</div>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="calc(100vh - 405px)">
          <el-table-column
            prop="cashCouponName"
            label="名称"
            min-width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="cashCouponMoney"
            label="价格"
            min-width="75"
            align="center">
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="80"
            align="center">
            <template slot-scope="scope">
              <div class="time_size">{{scope.row.createDate | fulldate}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="60"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="showData(scope.row)" class="mini-button" size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="cost-footer-button">
          <div style="width: 50%;">
            <el-button @click="dialogVisible6 = true" type="text" style="width: 100%;" class="text-button">添 加</el-button>
          </div>
          <div style="width: 50%;border-left: 1px solid #EEEEEE;">
            <el-button @click="dialogVisible8 = true" type="text" style="width: 100%;" class="text-button">查 询</el-button>
          </div>
        </div>
      </el-card>
      <!-- 弹窗 -->
      <!-- 设置店铺名称 -->
      <el-dialog
        title="店铺名设置"
        :visible.sync="dialogVisible1"
        width="90%"
        top="35vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入店铺名"></el-input>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button @click="setShopInfo('ruleForm',ruleForm.name,'name')" class="button-margin" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 设置店铺图标 -->
      <el-dialog
        title="店铺图标设置"
        :visible.sync="dialogVisible2"
        width="90%"
        top="35vh">
        <div style="padding-top: 10px;">
          <div style="padding-bottom: 20px;">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              list-type="picture"
              :auto-upload="false"
              :limit="1"
              :http-request="upImg">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload()">上传到服务器</el-button>
            </el-upload>
          </div>
        </div>
      </el-dialog>
      <!-- 设置店铺电话 -->
      <el-dialog
        title="店铺电话设置"
        :visible.sync="dialogVisible3"
        width="90%"
        top="35vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="tel">
            <el-input type="number" v-model="ruleForm.tel" placeholder="请输入店铺电话"></el-input>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button @click="setShopInfo('ruleForm',ruleForm.tel,'tel')" class="button-margin" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 店铺图标展示 -->
      <el-dialog
        title="店铺图标"
        :visible.sync="dialogVisible5"
        width="90%"
        top="30vh">
        <div style="padding-top: 10px;">
          <div class="icon-box">
            <img :src="showIcon">
          </div>
          <div style="padding: 10px 0px;"></div>
        </div>
      </el-dialog>
      <!-- 添加优惠券 -->
      <el-dialog
        title="添加优惠券"
        :visible.sync="dialogVisible6"
        width="90%"
        top="30vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="cashName" label="优惠券名称">
            <el-input v-model="ruleForm.cashName" placeholder="请输入优惠券名称"></el-input>
          </el-form-item>
          <el-form-item prop="cash" label="优惠券价格">
            <el-input v-model="ruleForm.cash" placeholder="请输入优惠券价格"></el-input>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible6 = false">取 消</el-button>
          <el-button @click="addData('ruleForm')" class="button-margin" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改优惠券 -->
      <el-dialog
        title="修改优惠券"
        :visible.sync="dialogVisible7"
        width="90%"
        top="25vh">
        <div style="padding-top: 10px;">
          <el-form-item prop="cashName_c" label="优惠券名称">
            <el-input v-model="ruleForm.cashName_c" placeholder="请输入优惠券名称"></el-input>
          </el-form-item>
          <el-form-item prop="cash_c" label="优惠券价格">
            <el-input v-model="ruleForm.cash_c" placeholder="请输入优惠券价格"></el-input>
          </el-form-item>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible7 = false">取 消</el-button>
          <el-button @click="changeData('ruleForm')" class="button-margin" type="primary">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查询优惠券 -->
      <el-dialog
        title="查询优惠券"
        :visible.sync="dialogVisible8"
        width="90%"
        top="20vh">
        <div>
          <dl class="item-text">
            <dd class="item-title">优惠券名称:</dd>
            <dd class="item-body">
              <el-input v-model="S_name" placeholder="请输入优惠券名称"></el-input>
            </dd>
          </dl>
          <dl class="item-text">
            <dd class="item-title">优惠券价格:</dd>
            <dd class="item-body">
              <el-input v-model="S_cash" placeholder="请输入优惠券价格"></el-input>
            </dd>
          </dl>
        </div>
        <dl class="item-text">
          <dd class="item-title">创建开始时间:</dd>
          <dd class="item-body">
            <el-date-picker
              v-model="S_stime"
              type="date"
              placeholder="请选择时间"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              :editable="false">
            </el-date-picker>
          </dd>
        </dl>
        <dl class="item-text">
          <dd class="item-title">创建结束时间:</dd>
          <dd class="item-body">
            <el-date-picker
              v-model="S_etime"
              type="date"
              placeholder="请选择时间"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              :editable="false"
              default-time="23:59:59">
            </el-date-picker>
          </dd>
        </dl>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reset()">清 空</el-button>
          <el-button @click="searchData()" class="button-margin" type="primary">确 定</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    var checkCash = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入优惠券价格"));
      } else if(isNaN(value)){
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return{
      name:"",
      tel:"",
      introduction:"",
      // 修改
      dialogVisible1:false,
      dialogVisible2:false,
      dialogVisible3:false,
      tableData:[],
      href:"http://apis.map.qq.com/tools/locpicker?search=1&type=0&key=7Y7BZ-YWG6D-R3O4A-P45VJ-7EEYK-XPBIF&referer=myapp",
      ruleForm: {
        name:"",
        tel:"",
        address:"",
        cashName:"",
        cash:"",
        cashName_c:"",
        cash_c:"",
      },
      rules: {
        name: [{ required: true, message: '请输入店铺名', trigger: 'blur' }],
        tel: [
          { required: true, message: '请输入店铺电话', trigger: 'blur' },
          { min: 8, max: 12, message: '长度在8到12个字符', trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入店铺地址', trigger: 'blur' }],
        cashName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        cash: [{ validator: checkCash, trigger: "blur" }],
        cashName_c: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        cash_c: [{ validator: checkCash, trigger: "blur" }]
      },
      shopIcon:"",
      lat:"",
      lon:"",
      addlock: true,
      dialogVisible5:false,
      showIcon:"",
      // 优惠券
      dialogVisible6:false,
      dialogVisible7:false,
      cashNo:"",
      // 查询
      dialogVisible8:false,
      S_name:"",
      S_cash:"",
      S_stime:"",
      S_etime:""
    }
  },
  watch:{
    'ruleForm.address':{
      handler: function(val, oldVal){
        if(val){
          this.addlock = false;
        }
      },
      immediate: true
    }
  },
  created(){
    this.getData();
    this.getCouponData();
  },
  methods:{
    getData(){
      let port = 'merchant/merchantData'
      let obj = {
        opid:sessionStorage.getItem("ShopId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          this.name = data.merchantName;
          this.tel = data.merchantMobile;
          this.ruleForm.address = data.merchantAddress;
          this.introduction = data.merchantIntroduce;
          this.getLocation();
          if(!!data.merchantIoc){
            this.shopIcon = data.merchantIoc;
          }else{
            this.shopIcon = '../../../static/img/zhanwei.jpg';
          }
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    getCouponData(){
      let port = 'merchantCashCoupon/getMerchantCashCoupon';
      let obj = {
        opid:sessionStorage.getItem("ShopId")
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            data[i].createDate = this.formatDate(new Date(data[i].createDate));
            if(!data[i].cashCouponMoney){
              data[i].cashCouponMoney = parseFloat(0).toFixed(2);
            }else{
              data[i].cashCouponMoney = parseFloat(data[i].cashCouponMoney).toFixed(2);
            };
          };
          this.tableData = data;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    upImg(file){
      let File = file.file;
      let addImg = this.axios.addImg(File);
      addImg.then((res) => {
        if(res.data.status == 200){
          this.addIcon(res.data.data)
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },
    addIcon(icon){
      let port = 'merchant/changeMerchant'
      let obj = {
        opid:sessionStorage.getItem("ShopId"),
        merchantIoc:icon
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          this.$message.success('图标设置成功');
          this.$refs.upload.clearFiles();
          this.getData();
          this.dialogVisible2 = false;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    showImg(){
      this.showIcon = this.shopIcon;
      this.dialogVisible5 = true;
    },
    setShopName(){
      this.ruleForm.name = this.name;
      this.dialogVisible1 = true;
    },
    setShopTel(){
      this.ruleForm.tel = this.tel;
      this.dialogVisible3 = true;
    },
    setShopInfo(formName,info,dialog){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let port = 'merchant/changeMerchant'
          let obj = {
            opid:sessionStorage.getItem("ShopId"),
          };
          switch(dialog) {
            case 'name':
              obj.merchantName = info;
              break;
            case 'tel':
              obj.merchantMobile = info;
              break;
          };
          let upData = this.axios.upData(port,obj);
          upData.then(res => {
            if(res.data.status == 200){
              this.$message.success('信息设置成功');
              switch(dialog) {
                case 'name':
                  this.dialogVisible1 = false;
                  break;
                case 'tel':
                  this.dialogVisible3 = false;
                  break;
              };
              this.getData();
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    goProtocol(){
      this.$router.push({
        path: '/shopinfo',
        name: "shopinfo",
        query:{
          introduction:this.introduction
        }
      });
    },
    addData(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let port = 'merchantCashCoupon/addMerchantCashCoupon';
          let obj = {
            opid:sessionStorage.getItem("ShopId"),
            cashCouponMoney: this.ruleForm.cash,
            cashCouponName: this.ruleForm.cashName,
          };
          let upData = this.axios.upData(port,obj);
          upData.then(res => {
            if(res.data.status == 200){
              this.getCouponData();
              this.$message.success('添加成功');
              this.dialogVisible6 = false;
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    showData(data){
      this.cashNo = data.cashCouponNo;
      this.ruleForm.cashName_c = data.cashCouponName;
      this.ruleForm.cash_c = data.cashCouponMoney;
      this.dialogVisible7 = true;
    },
    changeData(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let port = 'merchantCashCoupon/changeMerchantCashCoupon';
          let obj = {
            opid: sessionStorage.getItem("ShopId"),
            cashCouponNo: this.cashNo,
            cashCouponName: this.ruleForm.cashName_c,
            cashCouponMoney: this.ruleForm.cash_c
          };
          let upData = this.axios.upData(port,obj);
          upData.then(res => {
            if(res.data.status == 200){
              this.getCouponData();
              this.$message.success('修改成功');
              this.dialogVisible7 = false;
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    searchData(){
      let port = 'merchantCashCoupon/getMerchantCashCoupon';
      let obj = {
        opid:sessionStorage.getItem("ShopId"),
        cashCouponMoney: this.S_cash,
        cashCouponName: this.S_name,
        startDate: this.S_stime,
        endDate: this.S_etime
      };
      let upData = this.axios.upData(port,obj);
      upData.then(res => {
        if(res.data.status == 200){
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
            data[i].createDate = this.formatDate(new Date(data[i].createDate));
            if(!data[i].cashCouponMoney){
              data[i].cashCouponMoney = parseFloat(0).toFixed(2);
            }else{
              data[i].cashCouponMoney = parseFloat(data[i].cashCouponMoney).toFixed(2);
            };
          };
          this.tableData = data;
          this.dialogVisible8 = false;
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    reset(){
      this.S_stime = "";
      this.S_etime = "";
      this.S_name = "";
      this.S_cash = "";
      this.getCouponData();
      this.dialogVisible8 = false;
    },
    getAddress(){
      let href = window.location.href;
      let urlArr = href.split("?");
      this.href = this.href + `&backurl=${urlArr[0]}`;
      let handleUrl = function(url) {
        let decodedUrl = decodeURI(url);
        let query = decodedUrl.split("?")[1];
        let queryObj = {};
        if (query) {
          let queryArr = query.split("&");
          queryArr.forEach(item => {
            let itemArr = item.split("=");
            queryObj[itemArr[0]] = itemArr[1];
          });
        }
        console.log("处理url", queryObj);
        return queryObj;
      };
    },
    getLocation(){
      let url = window.location.href;
      if(!!url.split('?')[1]){
        let latng = url.split('&latng=')[1].split('&addr=')[0];
        let addr = url.split('&addr=')[1].split('&city=')[0];
        this.lat = latng.split(',')[0];
        this.lon = latng.split(',')[1];
        this.ruleForm.address = decodeURI(addr);
      }
    },
    postAddress(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let port = 'merchant/changeMerchant'
          let obj = {
            opid:sessionStorage.getItem("ShopId"),
            merchantAddress:this.ruleForm.address,
            lng:this.lat,
            lat:this.lon
          };
          let upData = this.axios.upData(port,obj);
          upData.then(res => {
            if(res.data.status == 200){
              this.$message.success('地址设置成功');
              this.getData();
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
dl{
  margin:0px;
  padding: 5px 0px;
  border-bottom: 1px solid #EEEEEE;
}
dd{
  margin: 0px;
}
.message{
  display: flex;
  align-items: center;
}
.name{
  width: 28%;
  font-size: 13px;
  line-height: 28px;
  text-align: left;
  display: flex;
  align-items: center;
}
.text{
  width: 47%;
  line-height: 18px;
  font-size: 13px;
  border-left: 1px solid #C1C1C1;
  margin: 5px 0px;
  text-align: left;
}
.button{
  width: 23%;
}
.img{
  width: 22px;
  height: 22px;
  margin-left: 5px;
}
.info{
  overflow: hidden;
  text-overflow: ellipsis;
}
.text1{
  width: 70%;
  font-size: 13px;
  border-left: 1px solid #C1C1C1;
  line-height: 18px;
  overflow: hidden;
  margin: 5px 0px;
}
.input_info{
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 0px;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  height: 18px;
  line-height: 18px;
  outline: 0;
  padding: 0 15px;
  width: 90%;
  text-align: right
}
.change-input{
  margin-bottom: 10px;
}
.infoTime{
  color: black;
}
#upfile1,#upfile2{
  display: none;
}
.set-title{
  text-align: left;
  font-size: 14px;
  color: #55575c86;
  border-bottom: 1px solid #EEEEEE;
  padding: 5px;
}
.shop-icon{
  width: 28px;
  height: 28px;
}
.shop-icon img{
  width: 100%;
  height: 100%;
}
.cost-footer-button{
  display: flex;
  align-items: center;
  width: 100%;
}
.address-box{
  padding: 3px;
}
.address-left{
  width: calc(100% - 40px);
}
.address-right{
  width: 30px;
  height: 30px;
  font-size: 30px;
}
.address-num{
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon-box{
  width: 100%;
  height: 0px;
  padding-bottom: 60%;
  position: relative;
}
.icon-box img{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
}
.item-text{
  margin-top: 5px;
  margin-bottom: 5px;
  border: 0px;
  width: 100%;
  padding: 0px;
}
.item-body{
  text-align: left;
}
.item-title{
  text-align: left;
  margin-bottom: 5px;
}
</style>