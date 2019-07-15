<template>
    <div>
        <el-collapse v-for="(item,index) in logInfos" :key="index" @change="handleChange">
            <el-collapse-item :title="item.date" :name="item.id">
                <div >{{item.value}}</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import{
    selectLogs,             //查询所有日志
} from '../../api/axiosapi'
  export default {
    data() {
      return {
        logInfos: []
      };
    },
    methods: {
        handleChange(val) {
            console.log(val);
        },
        //获取全部日志信息
        getAllLogs() {
            selectLogs().then(res => {
                let {code,msg,data} = res;
                if(code==200){
                    this.logInfos = JSON.parse(JSON.stringify(data))
                }
            })
        }
    },
    mounted() {
        this.getAllLogs();
    }
  }
</script>
