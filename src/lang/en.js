/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-16 17:43:24
 * @LastEditTime : 2019-12-26 10:09:17
 * @LastEditors  : Please set LastEditors
 */
import menuZh from './menuZh';

export default {
  route: {
    ...menuZh,
    dashboard: '首页',
    lottery: '抽奖',
    answer: '答题',
    code: '编码管理',
    codeList: '码段列表',
    codeStatics: '扫码统计',
    codeCreate: '创建码段',
    codeModify: '编辑码段',
    prize: '奖品管理',
    prizeTemplate: '奖品模板',
    prizeTemplateCreate: '创建奖品模板',
    prizeTemplateModify: '编辑奖品模板',
    prizeManagement: '奖品库存管理',
    prizeCreate: '创建奖品库存',
    prizeModify: '奖品编辑',
    lotteryRuleManagement: '抽奖规则管理',
    lotteryRule: '抽奖规则',
    lotteryRuleCreate: '创建抽奖规则',
    lotteryRuleModify: '编辑抽奖规则',
    prizeRule: '奖品规则',
    prizeRuleCreate: '创建奖品规则',
    prizeRuleModify: '编辑奖品规则',
    lotteryActivityManagement: '活动管理',
    lotteryActivity: '抽奖活动列表',
    lotteryActivityCreate: '新增抽奖活动',
    lotteryActivityModify: '编辑抽奖活动',
    client: '客户管理',
    clientList: '客户列表',
    clientRecord: '获奖记录',
    clientModify: '编辑客户',
    sysLog: '系统日志',
    operationLog: '操作日志',
    basicManagement: '基础管理',
    bindPublicNumber: '绑定小程序',
    activityAwardRecord: '中奖纪录',
    gameManagement: '比赛管理',
    gameList: '比赛列表',
    taskCenterManagerList: '任务列表',
    gameDetail: '比赛详情',
    gameReward: '比赛奖励',
    gameView: '界面配置',
    gameCreate: '新建比赛',
    gameModify: '修改比赛',
    gameNameList: '称号列表',
    gameNameCreate: '新建称号',
    gameNameModify: '编辑称号',
    questionManagement: '题库管理',
    questionList: '题库列表',
    questionCreate: '新建题库',
    questionModify: '修改题库',
    topicList: '题目列表',
    topicCreate: '新建题目',
    topicModify: '修改题目',
    userManagement: '用户管理',
    teamList: '团队列表',
    teamDetail: '团队详情',
    userList: '用户列表',
    userDetail: '用户详情',
    userExamine: '报名审核',
    uploadWorkTag: '作品标签',
    ranking: '查看排名',
    userMatchRecord: '比赛记录',
    operationManagement: '运营管理',
    advertManagement: '广告管理',
    advertCreate: '编辑广告',
    taskManager: '任务管理',
    taskCenterManage: '任务列表',
    advertModify: '新建广告',
    noticeList: '通知管理',
    noticeCreate: '新建通知',
    fightGroup: '商城',
    activityCenter: '活动中心',
    userCenter: '用户中心',
    activityManagement: '拼团管理',
    activityCreate: '创建拼团',
    activityModify: '修改拼团',
    activityInfoManagement: '运营管理',
    activityIntroduce: '现场活动介绍',
    activityGuide: '活动指南',
    activityHighlight: '现场活动集锦',
    activityHighlightCover: '活动集锦封面',
    activityHighlightCreate: '新增活动集锦',
    activityHighlightModify: '编辑活动集锦封面',
    commodityManagement: '商品管理',
    commodityCreate: '发布商品',
    commodityModify: '编辑商品',
    orderManagement: '订单管理',
    orderOverview: '订单总览',
    orderStatic: '订单总览',
    orderList: '订单概况',
    fightGroupRefund: '退款管理',
    orderTeamOverview: '成团状态总览',
    orderModify: '编辑商品',
    payManagement: '支付管理',
    writeOffManagement: '核销管理',
    writeOffRecord: '核销记录',
    writeOffControl: '核销',
    personnelManagement: '核销人员',
    personnelCreate: '新增核销人员',
    personnelModify: '编辑核销人员',
    aldDataView: '阿拉丁平台数据分析',
    dataViewSetting: '数据展示设置',
    dataViewModify: '数据展示设置',
    learningCenter: '学习中心',
    newArticle: '新建文章',
    editArticle: '编辑文章',
    taskList: '任务管理',
    editingTask: '编辑任务',
    newTask: '添加任务',
    service: '客服中心',
    communication: '客服沟通',
    publicAddressManagement: '公众号授权',
    miniProgramManagement: '小程序授权',
    commentCenter: '评论管理',
    commentManagment: '评论管理',
    commentConfig: '评论配置',
    integralCenter: '积分中心',
    integralMall: '积分商城',
    mallOverview: '商城概况',
    mallEdith: '商城设置',
    integralCommodityManagement: '商品管理',
    integralCommodityCreate: '创建商品',
    integralCommodityModify: '修改商品',
    integralOrder: '兑换管理',
    integralTask: '任务中心',
    taskEdit: '编辑任务',
    integralTaskList: '任务列表',
    integralTaskOverview: '任务总览',
    integralTaskDetails: '任务数据详情',
    integralTaskCreate: '任务设置',
    integralAwardTask: '有奖任务',
    integralArticleAdd: '文章任务',
    integralManage: '积分管理',
    taskLogsDetails: '任务数据详情',
    integralRule: '积分规则',
    integralOverview: '积分总览',
    integralDetails: '积分明细',
    users: '用户',
    taskCreate: '创建任务',
    usersManage: '用户管理',
    voteOperationManagementAward: '红包管理',
    voteOperationManagement: '运营管理',
    usersDetails: '用户详情',
    userDetails: '用户详情',
    vote: '投票',
    voteActivityManagement: '活动管理',
    voteActivityCreate: '新增活动',
    voteActivityModify: '编辑活动',
    judgesScore: '评委评分',
    works: '作品管理',
    wotksList: '作品列表',
    uploadWork: '上传作品',
    comment: '评论管理',
    stage: '阶段管理',
    newStage: '新建阶段',
    editStage: '修改阶段',
    taskManage: '任务管理',
    taskCenter: '任务中心',
    taskArticle: '阅读公众号文章',
    taskArticleParameter: '公众号文章跳转小程序参数',
    taskLogs: '任务数据',
    logsAll: '日志总览',
    missionAwardTaskCreate: '任务设置',
    blackList: '黑名单管理',
    signUpBlack: '报名黑名单',
    worksBlack: '作品黑名单',
    commentBlack: '评论黑民单',
    voteTaskManagement: '任务管理',
    voteTaskCreate: '创建任务',
    voteTaskModify: '编辑任务',
    integralMarketing: '抽奖',
    marketingActivity: '活动管理',
    marketingActivityCreate: '新增活动',
    marketingActivityModify: '编辑活动',
    marketingRule: '抽奖规则',
    marketingRuleCreate: '新增规则',
    marketingRuleModify: '编辑规则',
    marketingPrize: '奖品管理',
    marketingPrizeCreate: '新增奖品',
    marketingPrizeModify: '编辑奖品',
    marketingLotteryPrize: '抽奖奖品列表',
    marketingLotteryPrizeCreate: '新增抽奖奖品',
    marketingLotteryPrizeModify: '编辑抽奖奖品',
    marketingData: '活动数据',
    global: '全局配置',
    contentPlatform: '内容',
    channel: '渠道管理',
    content: '内容管理',
    auxiliary: '辅助功能',
    configure: '系统账号设置',
    smallProgram: '频道管理',
    mp: '公众号',
    addChannel: '新建频道',
    editChannel: '编辑频道',
    contentClass: '内容分类',
    contentList: '内容列表',
    addClass: '新建分类',
    editClass: '编辑分类',
    addContent: '添加内容',
    editContent: '编辑内容',
    contentCenter: '内容中心',
    label: '标签管理',
    addLabel: '新建标签',
    editLabel: '编辑标签',
    role: '角色管理',
    accountNumber: '账号管理',
    addRole: '新建角色',
    editRole: '编辑角色',
    userBlack: '用户黑名单',
    userManager: '用户管理',
    addAccountNumber: '新建账号',
    editAccountNumber: '编辑账号',
    readingClub: '打卡',
    readingClubInterpretation: '解读管理',
    interpretationCreate: '新建解读',
    interpretationModify: '编辑解读',
    readingClubUser: '用户管理',
    readingClubSelectBook: '选择图书',
    clockActivityManagement: '活动管理',
    newActivity: '新建活动',
    readTaskList: '主题列表',
    taskDetail: '主题详情',
    clockManagement: '打卡管理',
    userClock: '打卡记录',
    templateManage: '小程序模板消息',
    myTemplateList: '我的模板',
    myTemplateCreate: '添加模板',
    myTemplateModify: '编辑模板',
    templateLibraryList: '模板库',
    templateLibraryModify: '选用模板',
    messagePushList: '消息推送列表',
    messageListCreate: '新增消息推送',
    messageListModify: '编辑消息推送',
    subscribe: '订阅管理',
    giftCenter: '奖品中心',
    giftManage: '奖品管理',
    giftWays: '发奖策略',
    giftlist: '奖品流水',
    addPlot: '新建发奖策略',
    giftconf: '新建奖品',
    reportSystem: '数据报表',
    rewardRecords: '奖励记录',
    redPacketRecords: '红包发放',
    supplierManagement: '供应商管理',
    orderDetail: '订单详情',
    supplierCreate: '创建供应商',
    supplierModify: '编辑供应商',
    classificationManagement: '商品分类',
    classificationCreate: '新增商品分类',
    classificationModify: '编辑商品分类',
    deliverGoods: '批量发货',
    writeOffCodeManagement: '核销码管理',
    writeOffCreateManagement: '创建核销码',
    commodityList: '商品管理',
    commodityWriteCode: '商品核销码',
    usersGrowth: '用户档案',
    growthIndex: '档案数据管理',
    growthType: '档案模型管理',
    growthView: '档案详情',
    growthAddType: '新增档案模型',
    growthEditType: '编辑档案模型',
    growthActivityIndex: '线下活动',
    growthEditActivity: '编辑线下活动',
    activityCenterConfig: '发现页配置',
    activityCenterList: '活动列表',
    activityColumnList: '活动栏目',
    activityColumnCreate: '新增活动栏目',
    activityColumnModify: '编辑活动栏目',
    columnActivityWeight: '活动权重',
    giftWriteCode: '奖品核销码',
    integralCommodityWriteCode: '积分奖品核销码',
    topicManagement: '主题管理',
    topicListManagement: '主题列表',
    topicListCreate: '新建主题',
    topicListModify: '编辑主题',
    topicSeriesManagement: '主题系列',
    topicSeriesCreate: '新建主题系列',
    topicSeriesModify: '编辑主题系列',
    bannerManagement: 'banner管理',
    editBanner: '编辑banner',
    newcontentPlatform: '内容中心',
    calendarManage: '日历管理',
    eventCollectionMagage: '事件集管理',
    eventMagage: '事件管理',
    eventPush: '事件推送机制',
    eventTags: '事件标签',
    advertisingPositionManage: '广告位管理',
    advertisingPositionEdit: '广告位详情',
    advertisingPositionAdvertisingList: '广告列表',
    advertisingPositionAdvertisingDetails: '广告详情',
    contentApprovalManagment: '内容审核',
    contentApproval: '审核详情',
    contentColumn: '内容栏目',
    dataTotalAnalysis: '数据统计分析',
    matchSolicitation: '赛事征集',
    matchSloganList: '口号征集',
    matchEmblemList: '会徽征集',
    matchMascotList: '吉祥物征集',
    matchBlessingList: '祝福征集',
    matchOfficialList: '开闭幕式文案征集',
    matchSolicitationDetails: '征集详情',
    matchOfficialDetails: '征集详情',
    matchCooperation: '赛事合作审核',
    matchCooperationDetails: '审核详情',
    contentCenterNew: '内容中心',
    addContentNew: '内容编辑',
    miniNavigation: '迷你导航',
    competitionCenter: '比赛中心',
    participateIn: '参与其中',
    aboutUs: '关于我们',
    logManage: '操作日志',
    contentStatisticsManagment: '数据统计',
    editStatistics: '编辑统计'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    screenfull: 'screenfull',
    theme: 'theme'
  },
  login: {
    title: 'Login Form',
    logIn: 'Log in',
    username: 'Username',
    password: 'Password',
    thirdparty: 'phoneLogin',
    phone: 'phoneNumber',
    code: 'code',
    titleSupplier: 'Supplier Login'
  },
  permission: {
    roles: 'Your roles',
    switchRoles: 'Switch roles'
  },
  theme: {
    change: 'Theme change'
  },
  tagsView: {
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  }
};
