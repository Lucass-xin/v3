<template>
  <van-dropdown-menu>
    <van-dropdown-item
      v-model="state.searchValue.grade"
      :options="state.gradeOption"
      @change="changeOption"
    />
    <van-dropdown-item
      v-model="state.searchValue.classId"
      :options="state.classOption"
      @change="changeOption"
    />
    <van-dropdown-item
      v-model="state.searchValue.week"
      :options="state.weekOption"
      @change="changeOption"
    />
    <van-dropdown-item
      v-model="state.searchValue.subject"
      :options="state.subjectOption"
      @change="changeOption"
    />
  </van-dropdown-menu>
  <swiper-table  v-show="!state.isLoading"
    :headData="state.headData"
    :tableData="state.tableData"
    ref="table"
  ></swiper-table>
  <!-- <van-checkbox-group v-model="state.eva">
  </van-checkbox-group> -->
  <!-- <van-action-bar>
     <van-action-bar-icon icon="shop-o" text="学生" badge="12" />
     <van-action-bar-icon icon="shop-o" text="分数" badge="12" />
    <van-action-bar-button type="danger" text="立即评价" @click="onClickButton"/>
  </van-action-bar> -->
  <van-pagination
    v-model="state.currentPage"
    :page-count="state.count"
    mode="simple" 
    @change="getMyData"/>
</template>

<script lang="ts">
import { createApp, reactive, computed, onMounted, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { getData, getOption, getSubject, getEvaluate, getCurrentWeek} from "/@/api/teacher/evaluate";
import { Notify, Checkbox, CheckboxGroup} from "vant";
import store from '/@/store'
import swiperTable from "/@/components/swiperTable.vue"

export default {
  components: { swiperTable },
  setup(props, context) {
    const state = reactive({
      searchValue:  {
        pindex: 0,
        number: 10,
        subject: "",
        week: 0,
        classId: '',
        grade: ''
      },
      checkWeek: '',
      gradeOption: [],
      classOption: [],
      tempOption: [],
      weekOption: [],
      subjectOption: [],
      cityOption:[],
      headData: [
        { text: '名字', value: 'name' },
        { text: '学号', value: 'id'},
        { text: '本周', value: 'weeklyScore'},
        { text: '总分', value:'totalScore'}
      ],
      tableData: [],
      checked: false,
      evaData: [],
      eva: [],
      city:'',
      isLoading: false,
      currentPage: 1,
      count: 0,
    });

    const table = ref(null)

    const getMyData = (() => {
      state.searchValue.pindex = state.currentPage - 1
      state.isLoading = true;
      getData(state.searchValue).then((res) => {
        state.count = Math.ceil(res.result.totalnum / 10)
        state.tableData = res.result.data
        state.isLoading = false;
        if (res.result.data.length) 
          table.value.print()
      })
    })

    function getMyEvaluate() {
      getEvaluate(state.evaData,state.eva).then((res) => {
        state.evaData = res.result.data;
        // state.bodyData = res.result.data;
      })
    };



    const changeOption = ((value) => {
      state.currentPage = 1
      getMyData()
    })


    onMounted(() => {
      // 获取年级班级
      const promise1 = new Promise((resolve, reject) => {
        getOption().then((res) => {
          // 改变格式
          var map = {};
          for (let i = 0; i < res.result.data.length; i++) {
            const ai = res.result.data[i];
            if (!map[ai.gradeId]) {
              state.tempOption.push({
                id: ai.gradeId,
                name: ai.gradeName,
                data: [ai],
              });
              map[ai.gradeId] = ai;
            } else {
              for (let j = 0; j < state.tempOption.length; j++) {
                const dj = state.tempOption[j];
                if (dj.id == ai.gradeId) {
                  dj.data.push(ai);
                  break;
                }
              }
            }
          }
          console.log(state.tempOption);
          
          // 展示
          state.tempOption.forEach((item) => {
            state.gradeOption.push({ text: item.name, value: item.id})
          })
          if (state.gradeOption.length) {
            state.searchValue.grade = state.gradeOption[0].value
            const temp = state.tempOption[0]
            temp.data.forEach((item) => {
              state.classOption.push({ text: item.className, value: item.classId})
            })
            if (state.gradeOption.length) {
              state.searchValue.classId = state.classOption[0].value
            }
          }
          // 获取当前周次
          getCurrentWeek(store.state.schoolId).then((res) => {
            store.commit('setCurrentWeek', res)
            sessionStorage.setItem("currentWeek", res);
            for (let i = 1; i <= res; i++) {
              const str = `第${i}周`
              state.weekOption.push({ text: str, value: i })
            }
            const len = state.weekOption.length - 1
            state.searchValue.week = state.weekOption[len].value
          })
          resolve()
        });
      });
      // 初次获取城市
      promise1.then(() => {
        const promise2 = new Promise((resolve, reject) => {
          // 获取科目
          getSubject(state.searchValue.classId).then((res) => {
            res.result.data.forEach((item, index) => {
              state.subjectOption.push({ text: item, value: index})
            })
            state.searchValue.subject = state.subjectOption[0].value
            console.log(state.searchValue.subject)
            resolve()
          });
        });

        promise2.then(() => {
          console.log(state.searchValue, 111);
          
          getMyData()
        })
        getMyEvaluate()
      })
    });

    return {
      state,
      getMyData,
      changeOption
    };
  },
};

</script>
<style lang="scss" scoped>
  ::v-deep .van-dropdown-menu__bar {
    box-shadow: none;
    height: 30px;
  }

  ::v-deep .van-ellipsis{
		color: #1989fa;
	}

  .loading{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
  }
</style>

