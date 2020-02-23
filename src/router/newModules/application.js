import Layout from '@/views/layout/Layout';
import blankLayout from '@/views/layout/blankLayout';
export default {
  order: 0,
  orderName: 'application',
  path: '/app',
  component: Layout,
  meta: {
    title: 'application',
    icon: 'app',
    roles: ['11', 'admin']
  },
  alwaysShow: true,
  children: [
    {
      path: 'answer',
      component: blankLayout,
      meta: {
        title: 'answer',
        icon: 'quiz'
      },
      alwaysShow: true,
      children: [
        // 全局配置
        {
          path: 'global',
          component: () => import('@/views/answer/global/index'),
          meta: { title: 'global', noCache: true }
        },
        // 比赛管理
        {
          path: 'game',
          component: blankLayout,
          meta: {
            title: 'gameManagement'
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/answer/game/list'),
              name: 'gameList',
              meta: { title: 'gameManagement', noCache: true }
            },
            {
              path: 'name/list/:gameId',
              component: () => import('@/views/answer/game/nameList'),
              name: 'gameNameList',
              meta: { title: 'gameNameList', noCache: true },
              hidden: true
            },
            {
              path: 'name/create/:gameId',
              component: () => import('@/views/answer/game/nameEditor'),
              name: 'gameNameCreate',
              meta: { title: 'gameNameCreate', noCache: true },
              hidden: true
            },
            {
              path: 'name/:gameId/:id',
              component: () => import('@/views/answer/game/nameEditor'),
              name: 'gameNameModify',
              meta: { title: 'gameNameModify', noCache: true },
              hidden: true
            },
            {
              path: 'detail/:gameId',
              component: () => import('@/views/answer/game/gameDetail'),
              name: 'gameDetail',
              meta: { title: 'gameDetail', noCache: true },
              hidden: true
            },
            {
              path: 'view/:gameId',
              component: () => import('@/views/answer/game/view'),
              name: 'gameView',
              meta: { title: 'gameView', noCache: true },
              hidden: true
            },
            {
              path: 'reward/:gameId',
              component: () => import('@/views/answer/game/reward'),
              name: 'gameReward',
              meta: { title: 'gameReward', noCache: true },
              hidden: true
            },
            {
              path: 'create',
              component: () => import('@/views/answer/game/editor'),
              name: 'gameCreate',
              meta: { title: 'gameCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/answer/game/editor'),
              name: 'gameModify',
              meta: { title: 'gameModify', noCache: true },
              hidden: true
            }
          ]
        },
        // 题库管理
        {
          path: 'question',
          component: blankLayout,
          meta: {
            title: 'questionManagement'
          },
          children: [
            {
              path: 'group',
              component: () => import('@/views/answer/question/groupList'),
              name: 'questionGroupList',
              meta: { title: 'questionManagement', noCache: true }
            },
            {
              path: 'group/create',
              component: () => import('@/views/answer/question/groupEditor'),
              name: 'questionGroupCreate',
              meta: { title: 'questionCreate', noCache: true },
              hidden: true
            },
            {
              path: 'group/:id',
              component: () => import('@/views/answer/question/groupEditor'),
              name: 'questionGroupModify',
              meta: { title: 'questionModify', noCache: true },
              hidden: true
            },
            {
              path: 'topic/create',
              component: () => import('@/views/answer/question/topicEditor'),
              name: 'topicCreate',
              meta: { title: 'topicCreate', noCache: true },
              hidden: true
            },
            {
              path: 'topic/:id',
              component: () => import('@/views/answer/question/topicEditor'),
              name: 'topicModify',
              meta: { title: 'topicModify', noCache: true },
              hidden: true
            },
            {
              path: 'topic',
              component: () => import('@/views/answer/question/topicList'),
              name: 'topicList',
              meta: { title: 'topicList', noCache: true },
              hidden: true
            }
          ]
        },
        // // 任务管理
        {
          path: 'task',
          component: blankLayout,
          meta: {
            title: 'taskList'
          },
          hidden: true,
          children: [
            {
              path: 'list',
              component: () => import('@/views/answer/taskList/index'),
              name: 'taskList',
              meta: { title: 'taskList', noCache: true }
            },
            {
              path: 'newTask',
              component: () => import('@/views/answer/taskList/editingTask'),
              name: 'newTask',
              meta: { title: 'newTask', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/answer/taskList/editingTask'),
              name: 'editingTask',
              meta: { title: 'editingTask', noCache: true },
              hidden: true
            }
          ]
        },
        // 学习中心
        {
          path: 'learning',
          component: blankLayout,
          meta: {
            title: 'learningCenter'
          },
          children: [
            {
              path: 'center',
              component: () => import('@/views/answer/learningCenter/index'),
              name: 'learningCenter',
              meta: { title: 'learningCenter', noCache: true }
            },
            {
              path: 'newArticle',
              component: () => import('@/views/answer/learningCenter/newArticle'),
              name: 'newArticle',
              meta: { title: 'newArticle', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/answer/learningCenter/editArticle'),
              name: 'editArticle',
              meta: { title: 'editArticle', noCache: true },
              hidden: true
            }
          ]
        },
        // 用户管理
        {
          path: 'userManagement',
          component: blankLayout,
          meta: {
            title: 'userManagement'
          },
          alwaysShow: true,
          children: [
            {
              path: 'team/list',
              component: () => import('@/views/answer/user/teamList'),
              name: 'teamList',
              meta: { title: 'teamList', noCache: true }
            },
            {
              path: 'user/list',
              component: () => import('@/views/answer/user/userList'),
              name: 'userList',
              meta: { title: 'userList', noCache: true }
            },
            {
              path: 'team/:id',
              component: () => import('@/views/answer/user/teamDetail'),
              name: 'teamDetail',
              meta: { title: 'teamDetail', noCache: true },
              hidden: true
            },
            {
              path: 'matchRecord/:id',
              component: () => import('@/views/answer/user/userMatchRecord'),
              name: 'userMatchRecord',
              meta: { title: 'userMatchRecord', noCache: true },
              hidden: true
            }
          ]
        },
        // 运营管理
        {
          path: 'operationManagement',
          component: blankLayout,
          meta: {
            title: 'operationManagement'
          },
          alwaysShow: true,
          children: [
            // 客服中心
            {
              path: 'center',
              component: blankLayout,
              children: [
                {
                  path: 'service',
                  component: () => import('@/views/answer/service/index'),
                  name: 'service',
                  meta: { title: 'service' }
                },
                {
                  path: 'communication',
                  component: () => import('@/views/answer/service/communication'),
                  name: 'answerServiceCommunication',
                  meta: { title: 'communication' },
                  hidden: true
                }
              ]
            },
            // 绑定小程序
            // {
            //   path: 'publicNumber',
            //   component: () => import('@/views/answer/basic/bindPublicNumber'),
            //   name: 'bindPublicNumber',
            //   meta: { title: 'bindPublicNumber', noCache: true }
            // },
            // 广告管理
            {
              path: 'advert/list',
              component: () => import('@/views/answer/operation/advertList'),
              name: 'advertManagement',
              meta: { title: 'advertManagement', noCache: true }
            },
            {
              path: 'advert/create',
              component: () => import('@/views/answer/operation/advertEditor'),
              name: 'advertModify',
              meta: { title: 'advertModify', noCache: true },
              hidden: true
            },
            {
              path: 'advert/:id',
              component: () => import('@/views/answer/operation/advertEditor'),
              name: 'advertCreate',
              meta: { title: 'advertCreate', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    },
    { path: 'vote',
      component: blankLayout,
      meta: {
        title: 'vote',
        icon: 'vote'
      },
      alwaysShow: true,
      children: [
        { // 活动管理
          path: 'activity',
          component: blankLayout,
          meta: {
            title: 'voteActivityManagement'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/vote/activity/index'),
              name: 'voteActivity',
              meta: { title: 'voteActivityManagement', noCache: true }
            },
            { // 新建活动
              path: 'editorActivity',
              component: () => import('@/views/vote/activity/editorActivity'),
              name: 'addActivity',
              meta: { title: 'voteActivityCreate', noCache: true },
              hidden: true // 是否不在侧边栏显示
            },
            { // 修改活动
              path: 'editorActivity/:id',
              component: () => import('@/views/vote/activity/editorActivity'),
              name: 'modifyActivity',
              meta: { title: 'voteActivityModify', noCache: true },
              hidden: true
            },
            { // 阶段列表
              path: 'stageList/:id',
              component: () => import('@/views/vote/activity/stageList'),
              name: 'stageList',
              meta: { title: 'stage', noCache: true },
              hidden: true
            },
            { // 新建阶段
              path: 'newStage/:activityId',
              component: () => import('@/views/vote/activity/newStage'),
              name: 'newStage',
              meta: { title: 'newStage', noCache: true },
              hidden: true
            },
            { // 修改阶段
              path: 'editStage/:activityId/:id',
              component: () => import('@/views/vote/activity/newStage'),
              name: 'editStage',
              meta: { title: 'editStage', noCache: true },
              hidden: true
            },
            { // 任务管理
              path: 'taskList/:stageId',
              component: () => import('@/views/vote/activity/taskList'),
              name: 'voteTaskList',
              meta: { title: 'taskList', noCache: true },
              hidden: true
            },
            { // 新建任务
              path: 'editorTask/:stageId',
              component: () => import('@/views/vote/activity/editorTask'),
              name: 'voteNewStage',
              meta: { title: 'newTask', noCache: true },
              hidden: true
            },
            { // 修改任务
              path: 'editorTask/:stageId/:id',
              component: () => import('@/views/vote/activity/editorTask'),
              name: 'voteEditorTask',
              meta: { title: 'editingTask', noCache: true },
              hidden: true
            },
            { // 报名审核
              path: 'userExamine/:id',
              component: () => import('@/views/vote/user/userExamine'),
              name: 'userExamine',
              meta: { title: 'userExamine', noCache: true },
              hidden: true
            },
            { // 查看排名
              path: 'ranking/:id',
              component: () => import('@/views/vote/activity/ranking'),
              name: 'voteActivityRankink',
              meta: { title: 'ranking', noCache: true },
              hidden: true
            },
            { // 评委评分
              path: 'judges/:id',
              component: () => import('@/views/vote/activity/judgesScore'),
              name: 'judgesScore',
              meta: { title: 'judgesScore', noCache: true },
              hidden: true
            }
          ]
        },
        { // 作品管理
          path: 'works',
          component: blankLayout,
          meta: {
            title: 'works'
          },
          alwaysShow: true,
          children: [
            {
              path: 'index',
              component: () => import('@/views/vote/works/index'),
              name: 'voteWorks',
              meta: { title: 'wotksList', noCache: true }
            },
            {
              path: 'uploadWork',
              component: () => import('@/views/vote/works/uploadWork'),
              name: 'uploadWork',
              meta: { title: 'uploadWork', noCache: true }
            },
            {
              path: 'tag',
              component: () => import('@/views/vote/works/tag'),
              name: 'uploadWorkTag',
              meta: { title: 'uploadWorkTag', noCache: true }
            },
            {
              path: 'comment/:id',
              component: () => import('@/views/vote/works/comment'),
              name: 'voteComment',
              meta: { title: 'comment', noCache: true },
              hidden: true
            }
          ]
        },
        { // 用户管理
          path: 'voteUser',
          component: blankLayout,
          meta: {
            title: 'userManagement'
          },
          alwaysShow: true,
          children: [
            {
              path: 'index',
              component: () => import('@/views/vote/user/index'),
              name: 'voteUser',
              meta: { title: 'userList', noCache: true }
            },
            {
              path: 'blackList',
              component: () => import('@/views/vote/user/blacklist'),
              name: 'blackList',
              meta: { title: 'blackList', noCache: true }
            },
            {
              path: 'userDetails/:id',
              component: () => import('@/views/vote/user/userDetails'),
              name: 'voteUserDetails',
              meta: { title: 'userDetail', noCache: true },
              hidden: true
            }
          ]
        },
        { // 红包管理
          path: 'award',
          component: blankLayout,
          meta: {
            title: 'voteOperationManagementAward'
          },
          children: [
            {
              path: 'index',
              component: () => import('@/views/vote/operation/award'),
              name: 'voteOperationManagementAward',
              meta: { title: 'voteOperationManagementAward', noCache: true }
            }
          ]
        },
        { // 任务管理
          path: 'task',
          component: blankLayout,
          meta: {
            title: 'voteTaskManagement'
          },
          hidden: true,
          children: [
            {
              path: 'index',
              component: () => import('@/views/vote/task/index'),
              name: 'voteTask',
              meta: { title: 'voteTaskManagement', noCache: true }
            },
            {
              path: 'editorTask',
              component: () => import('@/views/vote/task/editor'),
              name: 'addTask',
              meta: { title: 'voteTaskCreate', noCache: true },
              hidden: true
            },
            {
              path: 'editorTask/:id',
              component: () => import('@/views/vote/task/editor'),
              name: 'modifyTask',
              meta: { title: 'voteTaskModify', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    },
    { path: 'reading',
      component: blankLayout,
      meta: {
        title: 'readingClub',
        icon: 'punch'
      },
      alwaysShow: true,
      children: [
        {
          path: 'interpretation',
          component: blankLayout,
          meta: {
            title: 'readingClub'
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/readingClub/Interpretation/index'),
              name: 'interpretationList',
              meta: { title: 'readingClubInterpretation', noCache: true }
            },
            {
              path: 'selectBook',
              component: () => import('@/views/readingClub/Interpretation/selectBook'),
              name: 'readingClubSelectBook',
              meta: { title: 'readingClubSelectBook', noCache: true },
              hidden: true
            },
            {
              path: 'create',
              component: () => import('@/views/readingClub/Interpretation/editor'),
              name: 'readingClubInterpretationCreate',
              meta: { title: 'interpretationCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/readingClub/Interpretation/editor'),
              name: 'readingClubInterpretationModify',
              meta: { title: 'interpretationModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'user',
          component: blankLayout,
          meta: {
            title: 'readingClubUser'
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/readingClub/user/index'),
              name: 'readingClubUser',
              meta: { title: 'readingClubUser', noCache: true }
            }
          ]
        },
        {
          path: 'clockActivityManagement', // 打卡活动管理
          component: blankLayout,
          meta: {
            title: 'clockActivityManagement'
          },
          children: [
            {
              path: 'list', // 管理列表
              component: () => import('@/views/readingClub/clockActivityManagement/list'),
              name: 'clockActivityManagement',
              meta: { title: 'clockActivityManagement', noCache: true }
            },
            {
              path: 'activityDetail', // 新建活动
              component: () => import('@/views/readingClub/clockActivityManagement/activityDetail'),
              name: 'newActivity',
              meta: { title: 'newActivity', noCache: true },
              hidden: true
            },
            {
              path: 'readTaskList', // 主题列表
              component: () => import('@/views/readingClub/clockActivityManagement/readTaskList'),
              name: 'readTaskList',
              meta: { title: 'readTaskList', noCache: true },
              hidden: true
            },
            {
              path: 'taskDetail', // 主题详情
              component: () => import('@/views/readingClub/clockActivityManagement/taskDetail'),
              name: 'taskDetail',
              meta: { title: 'taskDetail', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'topic', // 主题列表
          component: blankLayout,
          meta: {
            title: 'topicManagement'
          },
          alwaysShow: true,
          children: [
            {
              path: 'series',
              component: blankLayout,
              meta: {
                title: 'topicSeriesManagement'
              },
              children: [
                {
                  path: 'index',
                  component: () => import('@/views/readingClub/topic/series/index'),
                  name: 'topicSeriesManagement',
                  meta: { title: 'topicSeriesManagement', noCache: true }
                },
                {
                  path: 'create',
                  component: () => import('@/views/readingClub/topic/series/editor'),
                  name: 'topicSeriesCreate',
                  meta: { title: 'topicSeriesCreate', noCache: true },
                  hidden: true
                },
                {
                  path: ':id',
                  component: () => import('@/views/readingClub/topic/series/editor'),
                  name: 'topicSeriesModify',
                  meta: { title: 'topicSeriesModify', noCache: true },
                  hidden: true
                }
              ]
            },
            {
              path: 'list',
              component: blankLayout,
              meta: {
                title: 'topicListManagement'
              },
              children: [
                {
                  path: 'index',
                  component: () => import('@/views/readingClub/topic/list/index'),
                  name: 'topicListManagement',
                  meta: { title: 'topicListManagement', noCache: true }
                },
                {
                  path: 'create',
                  component: () => import('@/views/readingClub/topic/list/editor'),
                  name: 'topicListCreate',
                  meta: { title: 'topicListCreate', noCache: true },
                  hidden: true
                },
                {
                  path: ':id',
                  component: () => import('@/views/readingClub/topic/list/editor'),
                  name: 'topicListModify',
                  meta: { title: 'topicListModify', noCache: true },
                  hidden: true
                }
              ]
            }
          ]
        },
        {
          path: 'clockManagement', // 打卡管理
          component: blankLayout,
          meta: {
            title: 'clockManagement'
          },
          children: [
            {
              path: 'list', // 管理列表
              component: () => import('@/views/readingClub/clockManagement/list'),
              name: 'clockManagement',
              meta: { title: 'clockManagement', noCache: true }
            },
            {
              path: 'userClock', // 用户打卡记录
              component: () => import('@/views/readingClub/clockManagement/userClock'),
              name: 'userClock',
              meta: { title: 'userClock', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    },
    {
      path: 'integralMarketing', // 抽奖
      component: blankLayout,
      meta: { title: 'integralMarketing', icon: 'lottery' },
      children: [
        {
          path: 'prize',
          component: blankLayout,
          name: 'marketingPrize',
          meta: { title: 'marketingPrize', noCache: false },
          hidden: false,
          children: [
            {
              path: 'list',
              component: () => import('@/views/integralMall/marketingActivity/prize/index'),
              name: 'marketingPrizeList',
              meta: { title: 'marketingPrize', noCache: true }
            },
            {
              path: 'create',
              component: () => import('@/views/integralMall/marketingActivity/prize/add'),
              name: 'marketingPrizeCreate',
              meta: { title: 'marketingPrizeCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/integralMall/marketingActivity/prize/add'),
              name: 'marketingPrizeModify',
              meta: { title: 'marketingPrizeModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'rule',
          component: blankLayout,
          name: 'marketingRule',
          meta: { title: 'marketingRule', noCache: false },
          children: [
            {
              path: 'list',
              component: () => import('@/views/integralMall/marketingActivity/rule/index'),
              name: 'marketingRuleList',
              meta: { title: 'marketingRule', noCache: true }
            },
            {
              path: 'create',
              component: () => import('@/views/integralMall/marketingActivity/rule/add'),
              name: 'marketingRuleCreate',
              meta: { title: 'marketingRuleCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/integralMall/marketingActivity/rule/add'),
              name: 'marketingRuleModify',
              meta: { title: 'marketingRuleModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'activity',
          component: blankLayout,
          name: 'marketingActivity',
          meta: { title: 'marketingActivity', noCache: false },
          children: [
            {
              path: 'list',
              component: () => import('@/views/integralMall/marketingActivity/activity/index'),
              name: 'marketingActivityList',
              meta: { title: 'marketingActivity', noCache: true }
            },
            {
              path: 'create',
              component: () => import('@/views/integralMall/marketingActivity/activity/add'),
              name: 'marketingActivityCreate',
              meta: { title: 'marketingActivityCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/integralMall/marketingActivity/activity/add'),
              name: 'marketingActivityModify',
              meta: { title: 'marketingActivityModify', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'data',
          component: () => import('@/views/integralMall/marketingActivity/data/index'),
          name: 'marketingData',
          meta: { title: 'marketingData', noCache: false }
        },
        {
          path: 'lotteryPrize',
          component: blankLayout,
          name: 'marketingLotteryPrize',
          meta: { title: 'marketingLotteryPrize', noCache: false },
          hidden: true,
          children: [
            {
              path: 'list',
              component: () => import('@/views/integralMall/marketingActivity/lotteryPrize/index'),
              name: 'marketingLotteryPrizeList',
              meta: { title: 'marketingLotteryPrize', noCache: true },
              hidden: true
            },
            {
              path: 'create',
              component: () => import('@/views/integralMall/marketingActivity/lotteryPrize/add'),
              name: 'marketingLotteryPrizeCreate',
              meta: { title: 'marketingLotteryPrizeCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/integralMall/marketingActivity/lotteryPrize/add'),
              name: 'marketingLotteryPrizeModify',
              meta: { title: 'marketingLotteryPrizeModify', noCache: true },
              hidden: true
            }
          ]
        }
      ]
    },
    {
      path: 'integralMall', // 积分商城
      component: blankLayout,
      meta: {
        title: 'integralMall',
        icon: 'mall'
      },
      alwaysShow: true,
      children: [
        {
          path: 'mallOverview',
          component: blankLayout,
          meta: { title: 'mallOverview', noCache: true },
          children: [
            {
              path: 'list',
              name: 'mallOverview',
              component: () => import('@/views/integralMall/mallOverview/index'),
              meta: { title: 'mallOverview', noCache: true }
            },
            {
              path: 'mallEdith',
              component: () => import('@/views/integralMall/mallOverview/edit'),
              name: 'mallEdith',
              meta: { title: 'mallEdith', noCache: false },
              hidden: true
            }
          ]
        },
        {
          path: 'integralCommodity',
          component: blankLayout,
          meta: {
            title: 'integralCommodityManagement'
          },
          children: [
            {
              path: 'list',
              component: () => import('@/views/integralMall/commodity/index'),
              name: 'integralCommodityList',
              meta: { title: 'integralCommodityManagement', noCache: true }
            },
            {
              path: 'create',
              component: () => import('@/views/integralMall/commodity/add'),
              name: 'integralCommodityCreate',
              meta: { title: 'integralCommodityCreate', noCache: true },
              hidden: true
            },
            {
              path: ':id',
              component: () => import('@/views/integralMall/commodity/add'),
              name: 'integralCommodityModify',
              meta: { title: 'integralCommodityModify', noCache: true },
              hidden: true
            },
            // 奖品核销码
            {
              path: 'writeCode',
              name: 'integralCommodityWriteCode',
              component: () => import('@/views/integralMall/commodity/writeCode'),
              meta: { title: 'integralCommodityWriteCode', noCache: true },
              hidden: true
            }
          ]
        },
        {
          path: 'integralOrder',
          name: 'integralOrder',
          component: () => import('@/views/integralMall/order/index'),
          meta: { title: 'integralOrder', noCache: true }
        }
      ]
    }
  ]
};
