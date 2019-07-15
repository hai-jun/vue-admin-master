<template>
  <div>
    <el-carousel :interval="4000" type="card" height="600px">
      <el-carousel-item v-for="item in this.images" :key="item" style="height:500px;width:600px">
        <img :src="item" height="500" width="600">
        <!-- <img src="../../images/1.jpg"> -->
      </el-carousel-item>
    </el-carousel>
    <div>
        <div>
            <section v-for="(file, index) of files" :key="file.name">
                <img :src="file.src" alt="" ondragstart="return false;" height="100" width="150">
                <div @click="remove(index)" class="x-class">x</div>
            </section>
        </div>
        <section v-if="files.length != 0">
            <div>
                <el-button type="primary" round v-if="status == 'ready'" @click="submit">上传</el-button>
                <!-- <button v-if="status == 'finished'" @click="finished">完成</button> -->
            </div>
        </section>
        <input class="file-class" type="file" @change="fileChanged" ref="file" multiple="multiple" accept="image/jpg,image/jpeg,image/png,image/bmp">
    </div>
  </div>
</template>

<script>
import {
  savePicUrl,         //保存图片地址
  loadAllPrc,         //获取所有图片地址
} from '../../api/axiosapi.js'
import { setTimeout } from 'timers';
import { isNullOrUndefined } from 'util';
	export default {
     data() {
       return {
          images: [],

          status: 'created',
          files: [],
          uploading: false,
       }
     },
     methods: {
      //加载全部图片
      loadPictures() {
        loadAllPrc().then(res => {
          let {code,msg,data} = res
          if(code==200){
            var pics = JSON.parse(JSON.stringify(data))
            debugger
            for (let index = 0; index < pics.length; index++) {
              var i = pics[index].indexOf("?")
              pics[index] = pics[index].substring(0,pics[index].indexOf("?")==-1?pics[index].length:pics[index].indexOf("?"));
            }
            this.images = pics
          }
        })
      },
      submit() {
          console.log(this.files)
          var that=this

          let OSS = require('ali-oss');
          let client = new OSS({
              region: 'oss-cn-hangzhou',  
              accessKeyId: 'LTAI0fHS3RadpBIB',
              accessKeySecret: 'tL2WrMSQcyS0a84MIGjdGQQQMHckOU',
              bucket: 'for-haijun'
          });
          const fNum = this.files;
          for(var i=0;i<fNum.length;i++){
              var f=fNum[i].file
              console.log(f)
              const Name=f.name
              console.log(Name)
              const suffix = Name.substr(Name.indexOf("."));
              const obj=this.timestamp();
              const storeAs = 'images/'+obj+suffix  //  路径+时间戳+后缀名
              console.log(storeAs)
              let tempCheckpoint;
              client.multipartUpload(storeAs, f, { 
                progress: async function (p, checkpoint) {
                  // 断点记录点。 浏览器重启后无法直接继续上传，需用户手动触发进行设置。
                  tempCheckpoint = checkpoint;
                }
              }).then(function (result){
                  console.log(result.res.requestUrls)

                  //获取刚刚上传的图片的地址并保存到数据库
                  var picUrl = result.res.requestUrls
                  var params = {"picUrl": picUrl}
                  savePicUrl(params).then(res => {
                    let {code,msg,data} = res
                    if(code!=200){
                      alert("上传失败！")
                      return;
                    }else{
                      alert("上传成功！")
                    }
                  })
              })
          }        
      },
      //  时间戳
      timestamp:function(){  
          const time = new Date();  
          const y = time.getFullYear();  
          const m = time.getMonth()+1;  
          const d = time.getDate();  
          const h = time.getHours();  
          const mm = time.getMinutes();  
          const s = time.getSeconds();  
          const ms = time.getMilliseconds()  
          return ""+y+this.Add0(m)+this.Add0(d)+this.Add0(h)+this.Add0(mm)+this.Add0(s)+this.Add0(ms);  
      },
      Add0:function(m){  
          return m<10?'0'+m : m;  
      } ,

      finished() {
          this.files = []
          this.status = 'ready'
          
      },
      remove(index) {
          this.files.splice(index, 1)
      },
      fileChanged() {
          const list = this.$refs.file.files
          for (let i = 0; i < list.length; i++) {
              if (!this.isContain(list[i])) {
                  const item = {
                      name: list[i].name,
                      size: list[i].size,
                      file: list[i]
                  }
                  this.html5Reader(list[i], item)
                  this.files.push(item)
              }
          }
          this.$refs.file.value = ''
          this.status = 'ready'
      },
      // 将图片文件转成BASE64格式
      html5Reader(file, item){
          const reader = new FileReader()
          reader.onload = (e) => {
              this.$set(item, 'src', e.target.result)
          }
          reader.readAsDataURL(file)
      },
      isContain(file) {
        return this.files.find((item) => item.name === file.name && item.size === file.size)
      },
      getImgs(){
        //  获取本地images下的所有图片路径
        //  const files = require.context('../../images', false, /(png|jpg|jpeg|gif|bmp|webp)$/).keys();
        //  for (let item of files) {
        //   //  debugger
        //    var src = require('../../images'+item.substring(1));
        //    this.images.push(src)
        //  }

        //获取阿里云oss中的所有文件路径，事先已经保存在数据库中了
      },
     },
     mounted() {
       this.loadPictures();
     }
  }
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .file-class {
    line-height: 10px;
    padding:10px
  }
  .x-class {
    color: red;
    font-size: 180%;
    display: inline;
    margin: -16px;
    cursor:pointer;
  }
</style>